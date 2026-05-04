// src/hooks/aiLocalizeService.ts
import type { CollectionSlug, Payload } from 'payload'

type ClientOpts = {
  baseURL?: string
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
  timeoutMs?: number
}

type LocalizeConfig = {
  fields?: string[]
  sourceLocale?: string
  targetLocales?: string[]
  dryRun?: boolean
  skipIfSlateTarget?: boolean
  forceOverwrite?: boolean
}

type FieldMeta = { type: 'text' | 'textarea' | 'richText' }
type FieldMap = Map<string, FieldMeta>

/** A single translatable text run extracted from a rich text structure */
type Segment = { id: number; text: string; blockType?: string }

const HEADER_GUARD = 'x-ai-localize'

function detectLocalizedFieldsWithMeta(collection: any): { fields: string[]; meta: FieldMap } {
  const fields: string[] = []
  const meta: FieldMap = new Map()

  function visit(arr: any[], prefix = ''): void {
    for (const field of arr || []) {
      const name = field?.name
      const hasName = !!name
      const path = hasName ? (prefix ? `${prefix}.${name}` : name) : prefix

      if (
        hasName &&
        field.localized === true &&
        (field.type === 'text' || field.type === 'textarea' || field.type === 'richText')
      ) {
        fields.push(path)
        meta.set(path, { type: field.type })
      }

      if (field?.fields) visit(field.fields, hasName ? path : prefix)
      if (field?.tabs) {
        for (const tab of field.tabs || []) {
          visit(tab.fields || [], prefix)
        }
      }
      if (field?.blocks) {
        for (const b of field.blocks || []) {
          visit(b.fields || [], hasName ? `${path}.${b.slug}` : prefix)
        }
      }
    }
  }

  visit(collection.config?.fields || collection.fields || [])
  return { fields, meta }
}

function getByPath(obj: any, path: string) {
  if (!obj) return undefined
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj)
}

function setByPath(target: any, path: string, value: any) {
  const parts = path.split('.')
  let node = target
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (typeof node[p] !== 'object' || node[p] == null) node[p] = {}
    node = node[p]
  }
  node[parts[parts.length - 1]] = value
}

function looksLikeSlate(val: any): boolean {
  return Array.isArray(val) && val.every((n) => typeof n === 'object' && n != null && !!n.type)
}

function looksLikeLexical(val: any): boolean {
  return !!val && typeof val === 'object' && !!val.root && val.root.type === 'root'
}

// ─── Segment extraction ──────────────────────────────────────────────────────

/**
 * Walks a Lexical rich text tree and returns every non-empty text run as a
 * Segment. Each Segment carries a stable `id` (its sequential position among
 * ALL text nodes, including empty ones) so it can be mapped back without
 * ambiguity even when the LLM skips or reorders entries.
 */
function lexicalToSegments(val: any): Segment[] {
  if (!val?.root?.children) return []
  const segments: Segment[] = []
  let id = 0

  const walk = (nodes: any[], blockType?: string) => {
    for (const n of nodes) {
      if (n.type === 'text') {
        if (typeof n.text === 'string' && n.text) {
          segments.push({ id, text: n.text, ...(blockType ? { blockType } : {}) })
        }
        id++
      } else if (Array.isArray(n.children)) {
        walk(n.children, n.type && n.type !== 'root' ? n.type : blockType)
      }
    }
  }

  walk(val.root.children)
  return segments
}

/** Applies translated segments back onto a deep-cloned Lexical structure. */
function applySegmentsToLexical(source: any, segments: Segment[]): any {
  if (!source?.root) return source
  const result = JSON.parse(JSON.stringify(source))
  const segMap = new Map(segments.map((s) => [s.id, s.text]))
  let id = 0

  const walk = (nodes: any[]) => {
    for (const n of nodes) {
      if (n.type === 'text') {
        if (segMap.has(id)) n.text = segMap.get(id)!
        id++
      } else if (Array.isArray(n.children)) {
        walk(n.children)
      }
    }
  }

  walk(result.root.children)
  return result
}

/** Walks a Slate rich text tree and returns every non-empty text run. */
function slateToSegments(val: any): Segment[] {
  if (!Array.isArray(val)) return []
  const segments: Segment[] = []
  let id = 0

  const walk = (nodes: any[], blockType?: string) => {
    for (const n of nodes) {
      if (n.text !== undefined) {
        if (typeof n.text === 'string' && n.text) {
          segments.push({ id, text: n.text, ...(blockType ? { blockType } : {}) })
        }
        id++
      } else if (Array.isArray(n.children)) {
        walk(n.children, n.type || blockType)
      }
    }
  }

  walk(val)
  return segments
}

/** Applies translated segments back onto a deep-cloned Slate structure. */
function applySegmentsToSlate(source: any, segments: Segment[]): any {
  if (!Array.isArray(source)) return source
  const result = JSON.parse(JSON.stringify(source))
  const segMap = new Map(segments.map((s) => [s.id, s.text]))
  let id = 0

  const walk = (nodes: any[]) => {
    for (const n of nodes) {
      if (n.text !== undefined) {
        if (segMap.has(id)) n.text = segMap.get(id)!
        id++
      } else if (Array.isArray(n.children)) {
        walk(n.children)
      }
    }
  }

  walk(result)
  return result
}

// ─── LLM call ────────────────────────────────────────────────────────────────

async function callJSONModel<T = any>(
  opts: ClientOpts,
  systemPrompt: string,
  userPrompt: string,
): Promise<T> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), opts.timeoutMs ?? 180000)
  try {
    const res = await fetch(`${opts.baseURL || 'https://api.openai.com'}/v1/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${opts.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: opts.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: opts.temperature ?? 0.2,
        response_format: { type: 'json_object' },
        max_tokens: opts.maxTokens ?? 65536,
      }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`LLM error ${res.status}: ${await res.text().catch(() => '')}`)
    const json = (await res.json()) as any
    const content = json?.choices?.[0]?.message?.content
    if (!content) throw new Error('Empty LLM response')
    return JSON.parse(content) as T
  } finally {
    clearTimeout(id)
  }
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

/**
 * sourceValues may contain either plain strings (text/textarea) or Segment
 * arrays (richText). The prompt instructs the LLM to return arrays for richText
 * fields using the same id values so they can be mapped back precisely.
 */
function buildPrompt(params: {
  collection: string
  sourceLocale: string
  targetLocale: string
  fields: string[]
  sourceValues: Record<string, string | Segment[]>
  extraContext?: Record<string, any>
}) {
  const { collection, sourceLocale, targetLocale, fields, sourceValues, extraContext } = params
  const sys = [
    `You fill missing localized fields for a CMS.`,
    `Return a strict JSON object with exactly these keys: ${fields.map((f) => `"${f}"`).join(', ')}.`,
    `Translate into natural, fluent ${targetLocale} as a native speaker would write it — not as a translator would render it.
  Prioritize how a native speaker would naturally express the idea over literal accuracy to the source structure.
  Rewrite sentence structure, word order, and phrasing from scratch if needed.
  Do not carry over grammatical patterns, idioms, or stylistic conventions from the source language.
  Avoid translationese: stiff phrasing, unnatural word order, or constructions that reveal the source language.`,
    `Match the register and tone of the original (e.g. friendly, educational, conversational) but express it the way a native ${targetLocale} writer in that genre would.`,
    `Preserve meaning, domain terms, and key concepts — but feel free to restructure sentences, split or combine them, or reorder information if it reads more naturally.`,
    `Keep placeholders like {name}, {count}, %{var} unchanged.`,
    `RICH TEXT FIELDS: Some field values are JSON arrays of segment objects: [{id, text, blockType?}, ...].
  For these fields you MUST return a JSON array (not a string) of the form [{id: <same number>, text: "<translation>"}...].
  - Preserve EVERY id value exactly — never add, remove, or renumber ids.
  - Translate ONLY the "text" values; do not include "blockType" in the output.
  - Each segment is an independent text run inside a paragraph or heading — keep translations appropriately scoped.
  - Do not merge or split segments; one input segment = one output segment.`,
    `TERMINOLOGY: Always use these exact translations. Do not paraphrase or substitute them.
  - Summ-Level → EN: "Buzz Level" / FR: "Niveau de Bzz"
  - Wildbienen-Oase → EN: "Wild Bee Oasis" / FR: "Oasis pour abeilles"
  - Bienen-Oase → EN: "Bee Oasis" / FR: "Oasis pour abeilles"
  - Mini Wildbienen-Oase → EN: "Mini Wild Bee Oasis" / FR: "Mini oasis pour abeilles"
  - Premium Wildbienen-Oase → EN: "Premium Wild Bee Oasis" / FR: "Oasis Premium pour abeilles"
  - Premium Oase → EN: "Premium Oasis" / FR: "Oasis Premium"
  - Pro Wildbienen-Oase → EN: "Pro Wild Bee Oasis" / FR: "Oasis expert pour abeilles"
  - Heldentaten → EN: "Hero Actions" / FR: "Actions héroïques"
  - Trittstein → EN: "Stepping Stone" / FR: "Tremplin"
  - BeeHome → EN: "BeeHome" / FR: "BeeHome" (feminine noun — la BeeHome, une BeeHome)
  - Mauerbiene → EN: "mason bee" / FR: "abeille maçonne" (feminine — l'abeille maçonne)
  - Wildbienen-Pflege → EN: "wild bee care" / FR: "soins aux abeilles sauvages"
  - summend / summende → EN: "buzzing" / FR: "bourdonnant"`,
    `LANGUAGE-SPECIFIC RULES:
  - Address the user informally: "Du" in German, "Tu" in French, "you" in English.
  - FR only: When referring to bees, always use "abeille" — never "osmie".
  - FR only: For button labels and calls to action, render German imperative verbs as French infinitives (e.g. "Entdecken" → "Découvrir", not "Découvrez").
  - FR only: Use guillemets « » for quotation marks, not " ".`,
    `If a source string key is empty, return an empty string for that key.`,
    `No markdown. No extra keys. No explanations.`,
  ].join(' ')

  const userObj: any = {
    task: 'localize',
    collection,
    from: sourceLocale,
    to: targetLocale,
    source: sourceValues,
  }
  if (extraContext) userObj.context = extraContext
  return { sys, user: JSON.stringify(userObj, null, 2) }
}

// ─── Content scoring ──────────────────────────────────────────────────────────

function contentScore(
  docAllLocales: any,
  fields: string[],
  locale: string,
  meta: FieldMap,
): number {
  let score = 0
  for (const f of fields) {
    const v = getByPath(docAllLocales, f)
    const val = typeof v === 'object' && v !== null ? v[locale] : v
    if (typeof val === 'string' && val.trim().length > 0) {
      score += 1
      continue
    }
    if (looksLikeSlate(val) && slateToSegments(val).length > 0) {
      score += 1
      continue
    }
    if (looksLikeLexical(val) && lexicalToSegments(val).length > 0) {
      score += 1
      continue
    }
  }
  return score
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function localizeDocument(
  payload: Payload,
  collectionSlug: CollectionSlug,
  docId: string | number,
  config: LocalizeConfig = {},
  clientOverrides?: Partial<ClientOpts>,
): Promise<{ success: boolean; message: string; localesUpdated?: string[] }> {
  const client: ClientOpts = {
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY!,
    model: 'deepseek-v4-pro',
    temperature: 0.2,
    maxTokens: 65536,
    timeoutMs: 180000,
    ...clientOverrides,
  }
  try {
    const collection = payload.collections[collectionSlug]
    if (!collection) {
      return { success: false, message: `Collection ${collectionSlug} not found` }
    }

    const localesCfg = payload.config.localization
    if (!localesCfg) {
      return { success: false, message: 'Localization not configured' }
    }

    const { fields: fieldsToLocalize, meta: fieldMeta } = detectLocalizedFieldsWithMeta(collection)
    if (!fieldsToLocalize.length) {
      return { success: false, message: 'No localized fields found' }
    }

    const defaultLocale =
      config.sourceLocale ||
      (typeof localesCfg.defaultLocale === 'string'
        ? localesCfg.defaultLocale
        : (localesCfg.defaultLocale as any)?.code) ||
      'en'

    const allLocales = (localesCfg.locales as any[]).map((l) =>
      typeof l === 'string' ? l : l.code,
    )
    const requestedTargets = config.targetLocales?.length ? config.targetLocales : allLocales

    const docAllLocales = await payload.findByID({
      collection: collectionSlug,
      id: docId,
      depth: 0,
      locale: 'all',
    })

    const scores = Object.fromEntries(
      allLocales.map((l) => [l, contentScore(docAllLocales, fieldsToLocalize, l, fieldMeta)]),
    )
    const bestLocale = Object.entries(scores).sort(
      (a, b) => (b[1] as number) - (a[1] as number),
    )[0]?.[0]
    const actualSourceLocale = config.sourceLocale
      ? scores[config.sourceLocale] > 0
        ? config.sourceLocale
        : bestLocale || defaultLocale
      : scores[bestLocale!] > 0
        ? bestLocale!
        : defaultLocale

    // Flatten sources: plain strings for text/textarea, Segment[] for richText
    const sourceValues: Record<string, string | Segment[]> = {}
    // Maps richText field path → { type, structure } for reconstruction
    const sourceRichText: Record<string, { type: 'lexical' | 'slate'; structure: any }> = {}
    const fieldsWithContent: string[] = []

    for (const f of fieldsToLocalize) {
      const v = getByPath(docAllLocales, f)
      const val = typeof v === 'object' && v !== null ? v[actualSourceLocale] : v
      const kind = fieldMeta.get(f)?.type

      if (kind === 'richText') {
        if (looksLikeLexical(val)) {
          const segs = lexicalToSegments(val)
          if (segs.length > 0) {
            sourceValues[f] = segs
            sourceRichText[f] = { type: 'lexical', structure: val }
            fieldsWithContent.push(f)
          }
        } else if (looksLikeSlate(val)) {
          const segs = slateToSegments(val)
          if (segs.length > 0) {
            sourceValues[f] = segs
            sourceRichText[f] = { type: 'slate', structure: val }
            fieldsWithContent.push(f)
          }
        }
      } else {
        const textValue = typeof val === 'string' ? val : ''
        if (textValue.trim().length > 0) {
          sourceValues[f] = textValue
          fieldsWithContent.push(f)
        }
      }
    }

    if (fieldsWithContent.length === 0) {
      return {
        success: false,
        message: `No source content found. Checked locales: ${allLocales.join(', ')}. Make sure at least one locale has content in the configured fields.`,
      }
    }

    const targets = requestedTargets.filter((l) => l !== actualSourceLocale)
    const toFill: Array<{ locale: string; fieldsMissing: string[] }> = []
    for (const locale of targets) {
      const fieldsMissing: string[] = []
      for (const f of fieldsWithContent) {
        if (config.forceOverwrite) {
          fieldsMissing.push(f)
          continue
        }

        const v = getByPath(docAllLocales, f)
        const val = typeof v === 'object' && v !== null ? v[locale] : undefined
        const kind = fieldMeta.get(f)?.type
        let empty = false
        if (kind === 'richText') {
          if (val == null) empty = true
          else if (looksLikeLexical(val)) empty = lexicalToSegments(val).length === 0
          else if (looksLikeSlate(val)) empty = slateToSegments(val).length === 0
          else if (Array.isArray(val)) empty = val.length === 0
          else if (typeof val === 'string') empty = val.trim().length === 0
          else empty = true
        } else {
          empty =
            val == null ||
            (typeof val === 'string' && val.trim() === '') ||
            (Array.isArray(val) && val.length === 0)
        }
        if (empty) fieldsMissing.push(f)
      }
      if (fieldsMissing.length) toFill.push({ locale, fieldsMissing })
    }

    if (!toFill.length) {
      return { success: false, message: 'All locales already have content' }
    }

    const extraContext = { collection: collectionSlug, knownKeys: config.fields, hints: {} }
    const localesUpdated: string[] = []

    for (const { locale, fieldsMissing } of toFill) {
      // Only send the source values for fields that need filling
      const filteredSource = Object.fromEntries(
        fieldsMissing.map((f) => [f, sourceValues[f]]),
      ) as Record<string, string | Segment[]>

      const { sys, user } = buildPrompt({
        collection: collectionSlug,
        sourceLocale: actualSourceLocale,
        targetLocale: locale,
        fields: fieldsMissing,
        sourceValues: filteredSource,
        extraContext,
      })

      try {
        const result = await callJSONModel<Record<string, string | Segment[]>>(client, sys, user)

        const patch: Record<string, any> = {}

        for (const f of fieldsMissing) {
          const proposed = result?.[f]
          const kind = fieldMeta.get(f)?.type

          if (kind === 'richText') {
            const richMeta = sourceRichText[f]
            if (richMeta && Array.isArray(proposed)) {
              if (richMeta.type === 'lexical') {
                setByPath(patch, f, applySegmentsToLexical(richMeta.structure, proposed as Segment[]))
              } else {
                setByPath(patch, f, applySegmentsToSlate(richMeta.structure, proposed as Segment[]))
              }
            } else if (richMeta && typeof proposed === 'string' && proposed) {
              // LLM returned a string for a richText field — surface as-is
              setByPath(patch, f, proposed)
            }
          } else {
            const text = (proposed ?? '').toString()
            if (text) setByPath(patch, f, text)
          }
        }

        if (Object.keys(patch).length === 0) {
          continue
        }

        if (config.dryRun) {
          console.log(`[aiLocalize][dryRun] ${collectionSlug}#${docId} -> ${locale}`, patch)
          localesUpdated.push(locale)
          continue
        }

        await payload.update({
          collection: collectionSlug,
          id: docId,
          locale: locale as any,
          data: patch,
          depth: 0,
          overrideAccess: true,
        })

        localesUpdated.push(locale)
      } catch (err) {
        console.error(
          `[aiLocalize] ${collectionSlug}#${docId} ${actualSourceLocale}->${locale} failed`,
          err,
        )
      }
    }

    return {
      success: true,
      message: `Successfully localized ${localesUpdated.length} locale(s) from ${actualSourceLocale}`,
      localesUpdated,
    }
  } catch (error) {
    console.error('[aiLocalize] Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
