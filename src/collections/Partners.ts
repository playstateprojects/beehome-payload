import type { CollectionConfig, PayloadRequest } from 'payload'
import { localizeDocument } from '../hooks/aiLocalizeService'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Partner', plural: 'Partners' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'url', 'email', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },

  endpoints: [
    {
      path: '/:id/localize',
      method: 'post',
      handler: async (req: PayloadRequest) => {
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
          const result = await localizeDocument(payload, 'partners', id as string, {
            fields: ['shortDescription', 'longDescription'],
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
                description: 'Partner name (used as the title in the admin).',
              },
            },
            {
              name: 'logo',
              label: 'Logo',
              type: 'upload',
              relationTo: 'media',
              localized: false,
            },
            {
              name: 'coverImage',
              label: 'Cover Image',
              type: 'upload',
              relationTo: 'media',
              localized: false,
            },
            {
              name: 'shortDescription',
              type: 'text',
              localized: true,
            },
            {
              name: 'longDescription',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              localized: false,
            },
            {
              name: 'appReferralCode',
              type: 'text',
              localized: false,
            },
            {
              name: 'email',
              type: 'email',
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
}

export default Partners
