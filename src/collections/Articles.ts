// src/payload/collections/Articles.ts
import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'
import { localizeDocument } from '../hooks/aiLocalizeService'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },
  versions: { drafts: { autosave: true } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishDate', 'author', 'reviewStatus', 'updatedAt'],
    group: 'Content',
  },
  access: { read: () => true },

  endpoints: [
    {
      path: '/:id/localize',
      method: 'post',
      handler: async (req) => {
        const { id } = req.routeParams || {}
        const payload = req.payload
        console.log(payload)
        if (!id) {
          return Response.json({ success: false, message: 'No document ID provided' })
        }

        try {
          const result = await localizeDocument(
            payload,
            'articles',
            id as string,
            {
              baseURL: 'https://api.deepseek.com',
              apiKey: process.env.DEEPSEEK_API_KEY!,
              model: 'deepseek-chat',
              temperature: 0.2,
              maxTokens: 1300,
            },
            {
              fields: ['body', 'intro', 'title', 'actionButton'],
              // sourceLocale omitted - will auto-detect which locale has the most content
            },
          )

          return Response.json(result)
        } catch (error) {
          return Response.json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      },
    },
  ],

  fields: [
    // AI Localize Button
    {
      name: 'localizeButton',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/LocalizeButton#LocalizeButton',
        },
      },
    },
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
    },

    // Body — localized rich text
    {
      name: 'body',
      label: 'Body',
      type: 'richText',
      localized: true,
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
  },
}

export default Articles
