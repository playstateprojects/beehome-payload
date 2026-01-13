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
        // Handle tabs structure - visit each tab's fields
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

function slateToPlain(val: any): string {
  if (!Array.isArray(val)) return ''
  const segments: string[] = []

  const collect = (node: any): void => {
    if (!node || typeof node !== 'object') return
    if (typeof node.text === 'string') {
      segments.push(node.text)
      return
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(collect)
    }
  }

  val.forEach(collect)

  // Use a unique delimiter to preserve text node boundaries
  return segments.map((seg, idx) => `<SEG${idx}>${seg}</SEG${idx}>`).join('')
}

function lexicalToPlain(val: any): string {
  if (!val?.root?.children) return ''
  const segments: string[] = []

  const walk = (nodes: any[]) => {
    for (const n of nodes) {
      if (n.type === 'text' && typeof n.text === 'string') {
        segments.push(n.text)
      } else if (Array.isArray(n.children)) {
        walk(n.children)
      } else if (n.type === 'linebreak') {
        segments.push('\n')
      }
    }
  }

  walk(val.root.children)

  // Use a unique delimiter to preserve text node boundaries
  return segments.map((seg, idx) => `<SEG${idx}>${seg}</SEG${idx}>`).join('')
}

function translateLexicalContent(source: any, translatedText: string): any {
  if (!source?.root) return source

  const result = JSON.parse(JSON.stringify(source))

  // Collect all text nodes in order
  const textNodes: any[] = []
  const findTextNodes = (nodes: any[]) => {
    for (const node of nodes || []) {
      if (node.type === 'text') {
        textNodes.push(node)
      }
      if (node.children) {
        findTextNodes(node.children)
      }
    }
  }
  findTextNodes(result.root.children)

  if (textNodes.length === 0) return result

  // Extract translated segments from the <SEG> markers
  const segmentMatches: string[] = []
  for (let i = 0; i < textNodes.length; i++) {
    const regex = new RegExp(`<SEG${i}>([\\s\\S]*?)</SEG${i}>`)
    const match = translatedText.match(regex)
    if (match) {
      segmentMatches.push(match[1])
    } else {
      // Fallback: if markers not found, keep original or empty
      segmentMatches.push('')
    }
  }

  // If no segments found with markers, fall back to proportional distribution
  if (segmentMatches.every(s => s === '')) {
    const originalSegments = textNodes.map(n => n.text || '')
    const totalOriginalLength = originalSegments.join('').length || 1
    const translatedWords = translatedText.replace(/<SEG\d+>|<\/SEG\d+>/g, '').split(/(\s+)/)

    let wordIndex = 0
    for (let i = 0; i < textNodes.length; i++) {
      const originalLength = originalSegments[i].length
      const proportion = originalLength / totalOriginalLength
      const wordsToTake = Math.max(1, Math.round(translatedWords.length * proportion))

      const assignedWords = translatedWords.slice(wordIndex, wordIndex + wordsToTake)
      textNodes[i].text = assignedWords.join('')
      wordIndex += wordsToTake
    }

    if (wordIndex < translatedWords.length) {
      const remaining = translatedWords.slice(wordIndex).join('')
      textNodes[textNodes.length - 1].text += remaining
    }
  } else {
    // Apply the matched segments to text nodes
    for (let i = 0; i < textNodes.length; i++) {
      textNodes[i].text = segmentMatches[i] || ''
    }
  }

  return result
}

function translateSlateContent(source: any, translatedText: string): any {
  if (!Array.isArray(source)) return source

  const result = JSON.parse(JSON.stringify(source))

  // Collect all text nodes in order
  const textNodes: any[] = []
  const findTextNodes = (nodes: any[]) => {
    for (const node of nodes || []) {
      if (node.text !== undefined) {
        textNodes.push(node)
      }
      if (node.children) {
        findTextNodes(node.children)
      }
    }
  }
  findTextNodes(result)

  if (textNodes.length === 0) return result

  // Extract translated segments from the <SEG> markers
  const segmentMatches: string[] = []
  for (let i = 0; i < textNodes.length; i++) {
    const regex = new RegExp(`<SEG${i}>([\\s\\S]*?)</SEG${i}>`)
    const match = translatedText.match(regex)
    if (match) {
      segmentMatches.push(match[1])
    } else {
      segmentMatches.push('')
    }
  }

  // If no segments found with markers, fall back to proportional distribution
  if (segmentMatches.every(s => s === '')) {
    const originalSegments = textNodes.map(n => n.text || '')
    const totalOriginalLength = originalSegments.join('').length || 1
    const translatedWords = translatedText.replace(/<SEG\d+>|<\/SEG\d+>/g, '').split(/(\s+)/)

    let wordIndex = 0
    for (let i = 0; i < textNodes.length; i++) {
      const originalLength = originalSegments[i].length
      const proportion = originalLength / totalOriginalLength
      const wordsToTake = Math.max(1, Math.round(translatedWords.length * proportion))

      const assignedWords = translatedWords.slice(wordIndex, wordIndex + wordsToTake)
      textNodes[i].text = assignedWords.join('')
      wordIndex += wordsToTake
    }

    if (wordIndex < translatedWords.length) {
      const remaining = translatedWords.slice(wordIndex).join('')
      textNodes[textNodes.length - 1].text += remaining
    }
  } else {
    // Apply the matched segments to text nodes
    for (let i = 0; i < textNodes.length; i++) {
      textNodes[i].text = segmentMatches[i] || ''
    }
  }

  return result
}

async function callJSONModel<T = any>(
  opts: ClientOpts,
  systemPrompt: string,
  userPrompt: string,
): Promise<T> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), opts.timeoutMs ?? 20000)
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
        max_tokens: opts.maxTokens ?? 512,
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

function buildPrompt(params: {
  collection: string
  sourceLocale: string
  targetLocale: string
  fields: string[]
  sourceValues: Record<string, string>
  extraContext?: Record<string, any>
}) {
  const { collection, sourceLocale, targetLocale, fields, sourceValues, extraContext } = params
  const sys = [
    `You fill missing localized fields for a CMS.`,
    `Return a strict JSON object with exactly these keys: ${fields.map((f) => `"${f}"`).join(', ')}.`,
    `Preserve meaning, tone, and domain terms.`,
    `Keep placeholders like {name}, {count}, %{var} unchanged.`,
    `CRITICAL: Some values contain <SEG0>, <SEG1>, etc. markers that separate text segments. You MUST preserve these exact markers in your translation and translate the text between them. Example: "<SEG0>hello</SEG0><SEG1>world</SEG1>" should become "<SEG0>hallo</SEG0><SEG1>Welt</SEG1>".`,
    `If a source key is empty, return an empty string for that key.`,
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

function stripSegmentMarkers(text: string): string {
  return text.replace(/<SEG\d+>|<\/SEG\d+>/g, '')
}

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
    if (looksLikeSlate(val)) {
      const plainText = stripSegmentMarkers(slateToPlain(val))
      if (plainText.trim().length > 0) {
        score += 1
        continue
      }
    }
    if (looksLikeLexical(val)) {
      const plainText = stripSegmentMarkers(lexicalToPlain(val))
      if (plainText.trim().length > 0) {
        score += 1
        continue
      }
    }
  }
  return score
}

/**
 * Main localization function that can be called from anywhere
 */
export async function localizeDocument(
  payload: Payload,
  collectionSlug: CollectionSlug,
  docId: string | number,
  config: LocalizeConfig = {},
  clientOverrides?: Partial<ClientOpts>,
): Promise<{ success: boolean; message: string; localesUpdated?: string[] }> {
  // Default client configuration
  const client: ClientOpts = {
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY!,
    model: 'deepseek-chat',
    temperature: 0.2,
    maxTokens: 8000,
    timeoutMs: 90000,
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

    // Fetch document with all locales
    const docAllLocales = await payload.findByID({
      collection: collectionSlug,
      id: docId,
      depth: 0,
      locale: 'all',
    })

    // Auto-pick source locale with most content
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

    // Flatten sources to strings for the LLM
    const sourceValues: Record<string, string> = {}
    const sourceRichTextStructures: Record<string, any> = {}
    const fieldsWithContent: string[] = []

    for (const f of fieldsToLocalize) {
      const v = getByPath(docAllLocales, f)
      const val = typeof v === 'object' && v !== null ? v[actualSourceLocale] : v
      const kind = fieldMeta.get(f)?.type
      let textValue = ''

      if (kind === 'richText') {
        if (looksLikeSlate(val)) {
          textValue = slateToPlain(val)
          if (textValue.trim()) {
            sourceRichTextStructures[f] = { type: 'slate', structure: val }
          }
        } else if (looksLikeLexical(val)) {
          textValue = lexicalToPlain(val)
          if (textValue.trim()) {
            sourceRichTextStructures[f] = { type: 'lexical', structure: val }
          }
        } else {
          textValue = typeof val === 'string' ? val : ''
        }
      } else {
        textValue = typeof val === 'string' ? val : ''
      }

      // Only include fields that have actual content
      if (textValue.trim().length > 0) {
        sourceValues[f] = textValue
        fieldsWithContent.push(f)
      }
    }

    if (fieldsWithContent.length === 0) {
      return {
        success: false,
        message: `No source content found. Checked locales: ${allLocales.join(', ')}. Make sure at least one locale has content in the configured fields.`,
      }
    }

    // Compute missing fields per target locale (only for fields that have source content)
    const targets = requestedTargets.filter((l) => l !== actualSourceLocale)
    const toFill: Array<{ locale: string; fieldsMissing: string[] }> = []
    for (const locale of targets) {
      const fieldsMissing: string[] = []
      // Only check fields that have content in the source
      for (const f of fieldsWithContent) {
        // If forceOverwrite is true, always include the field
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
          else if (looksLikeSlate(val)) {
            const plainText = stripSegmentMarkers(slateToPlain(val))
            empty = plainText.trim().length === 0
          }
          else if (looksLikeLexical(val)) {
            const plainText = stripSegmentMarkers(lexicalToPlain(val))
            empty = plainText.trim().length === 0
          }
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
      const { sys, user } = buildPrompt({
        collection: collectionSlug,
        sourceLocale: actualSourceLocale,
        targetLocale: locale,
        fields: fieldsMissing,
        sourceValues,
        extraContext,
      })

      try {
        const result = await callJSONModel<Record<string, string>>(client, sys, user)

        const patch: Record<string, any> = {}

        for (const f of fieldsMissing) {
          const proposed = (result?.[f] ?? '').toString()
          const kind = fieldMeta.get(f)?.type

          if (kind === 'richText') {
            const richTextMeta = sourceRichTextStructures[f]
            if (richTextMeta) {
              if (richTextMeta.type === 'lexical') {
                setByPath(patch, f, translateLexicalContent(richTextMeta.structure, proposed))
              } else if (richTextMeta.type === 'slate') {
                setByPath(patch, f, translateSlateContent(richTextMeta.structure, proposed))
              } else {
                setByPath(patch, f, proposed)
              }
            } else {
              setByPath(patch, f, proposed)
            }
          } else {
            setByPath(patch, f, proposed)
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
