// src/payload/collections/Articles.ts
import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'
import { aiLocalizeCollection } from '../hooks/aiLocalize'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { BlocksFeature } from '@payloadcms/richtext-lexical'
import { ProductRecommendations } from '../blocks/ProductRecommendations'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishDate', 'author', 'reviewStatus', 'updatedAt'],
    group: 'Content',
  },
  access: { read: () => true },

  fields: [
    // Title — localized
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },

    // Slug — NOT localized (single canonical URL)
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true as any, // supported in Prisma adapter; harmless otherwise
      localized: false,
      admin: { description: 'Auto-filled from Title if left blank.' },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        description:
          'A short Tagline that will apear on the homepage and at the top of each article in a script font.',
      },
    },

    // Hero image — NOT localized
    {
      name: 'heroImage',
      label: 'Hero image',
      type: 'upload',
      relationTo: 'media', // ensure you have a Media collection with uploads enabled
      localized: false,
    },
    // Intro / Teaser — localized rich text
    {
      name: 'intro',
      label: 'Intro / Teaser',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter(
            (feature) => feature.key !== 'toolbarInline' && feature.key !== 'floatingSelectToolbar',
          ),
          FixedToolbarFeature(),
          BlocksFeature({
            blocks: [ProductRecommendations],
          }),
        ],
      }),
    },

    // Body — localized rich text
    {
      name: 'body',
      label: 'Body',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter(
            (feature) => feature.key !== 'toolbarInline' && feature.key !== 'floatingSelectToolbar',
          ),
          FixedToolbarFeature(),
          BlocksFeature({
            blocks: [ProductRecommendations],
          }),
        ],
      }),
    },
    {
      name: 'actionButton',
      type: 'text',
      localized: true,
    },
    {
      name: 'actionButtonLink',
      type: 'text',
      localized: false,
    },

    // Publish date — NOT localized
    {
      name: 'publishDate',
      label: 'Publish date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayAndTime' } },
      localized: false,
    },

    // Author — NOT localized
    {
      name: 'author',
      label: 'Author',
      type: 'text',
      defaultValue: ({ user }) => user?.name ?? 'Nadine',
      localized: false,
    },

    // Review Status — NOT localized
    {
      name: 'reviewStatus',
      label: 'Review Status',
      type: 'text',
      localized: false,
      admin: { width: '33%' },
    },
  ],

  hooks: {
    // Auto-generate slug from default-locale title if missing
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return
        if (!data.slug || String(data.slug).trim() === '') {
          const localization = req.payload.config.localization
          const defaultLocale = localization ? localization.defaultLocale : 'en'
          const title =
            (typeof data.title === 'object' ? data.title?.[defaultLocale] : data.title) || ''
          if (title) data.slug = slugify(title)
        } else {
          data.slug = slugify(String(data.slug))
        }
      },
    ],
    afterChange: [
      //   async ({ doc, operation }) => {
      //     // Optional: fire a webhook to your Cloudflare Worker to invalidate cache
      //     if (!process.env.OPTIONS_WEBHOOK_URL) return
      //     try {
      //       const body = JSON.stringify({
      //         event: 'space-types.updated',
      //         operation,
      //         key: doc.key,
      //       })
      //       await fetch(process.env.OPTIONS_WEBHOOK_URL, {
      //         method: 'POST',
      //         headers: { 'Content-Type': 'application/json' },
      //         body,
      //       })
      //     } catch (err) {
      //       console.error('Webhook failed', err)
      //     }
      //   },
      aiLocalizeCollection(
        {
          baseURL: 'https://api.deepseek.com', // e.g. https://api.deepseek.com (if OpenAI-compatible)
          apiKey: process.env.DEEPSEEK_API_KEY!,
          model: 'deepseek-chat',
          temperature: 0.2,
          maxTokens: 1300,
        },
        {
          fields: ['body', 'intro', 'title', 'tagline'], // the localized fields to fill
          sourceLocale: 'en', // change if your default is different
          // targetLocales: ['de','fr','it'],       // or omit to use all configured except source
        },
      ),
    ],
  },
}

export default Articles
