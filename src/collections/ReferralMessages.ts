import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'
import { localizeDocument } from '../hooks/aiLocalizeService'
import { aiLocalizeCollection } from '../hooks/aiLocalize'

export const ReferralMessages: CollectionConfig = {
  slug: 'referral-messages',
  labels: { singular: 'Referral Message', plural: 'Referral Messages' },
  versions: { drafts: true },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'copy', 'updatedAt'],
    group: 'Notifications',
  },
  access: {
    read: () => true,
  },

  endpoints: [
    {
      path: '/:id/localize',
      method: 'post',
      handler: async (req) => {
        const { id } = req.routeParams || {}
        const payload = req.payload
        if (!id) {
          return Response.json({ success: false, message: 'No document ID provided' })
        }

        let forceOverwrite = false
        let sourceLocale: string | undefined
        try {
          const body = (await req.json?.()) as
            | { forceOverwrite?: boolean; sourceLocale?: string }
            | undefined
          forceOverwrite = body?.forceOverwrite === true
          sourceLocale = body?.sourceLocale
        } catch {
          // If no body or JSON parsing fails, use default
        }

        try {
          const result = await localizeDocument(payload, 'referral-messages', id as string, {
            fields: ['copy'],
            forceOverwrite,
            sourceLocale,
          })

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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              localized: false,
              admin: {
                description: 'Internal name for this referral message.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true as any,
              localized: false,
              admin: {
                description: 'Auto-filled from Name if left blank. Internal use only.',
              },
            },
            {
              name: 'copy',
              label: 'Copy',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'The message that will be shared when people share content in the app.',
              },
            },
            {
              name: 'image',
              label: 'Image',
              type: 'upload',
              relationTo: 'media',
              localized: false,
            },
            {
              name: 'link',
              label: 'Link',
              type: 'text',
              localized: false,
            },
          ],
        },
      ],
    },
    {
      name: 'localizeButton',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/LocalizeButton#LocalizeButton',
        },
      },
    },
  ],

  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return
        if (!data.slug || String(data.slug).trim() === '') {
          const localization = req.payload.config.localization
          const defaultLocale = localization ? localization.defaultLocale : 'en'
          const name =
            (typeof data.name === 'object' ? data.name?.[defaultLocale] : data.name) || ''
          if (name) data.slug = slugify(name)
        } else {
          data.slug = slugify(String(data.slug))
        }
      },
    ],
    afterChange: [
      aiLocalizeCollection(
        {
          baseURL: 'https://api.deepseek.com',
          apiKey: process.env.DEEPSEEK_API_KEY!,
          model: 'deepseek-chat',
          temperature: 0.2,
          maxTokens: 500,
        },
        {
          fields: ['copy'],
          sourceLocale: 'en',
        },
      ),
    ],
  },
}

export default ReferralMessages
