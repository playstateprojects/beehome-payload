import type { CollectionConfig } from 'payload'
import { aiLocalizeCollection } from '../hooks/aiLocalize'
import { localizeDocument } from '../hooks/aiLocalizeService'
import { slugify } from 'payload/shared'

export const SpaceActions: CollectionConfig = {
  slug: 'space-actions',
  orderable: true,
  versions: { drafts: true },
  labels: {
    singular: 'Space Action',
    plural: 'Space Actions',
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['slug', 'label', 'updatedAt'],
    group: 'Reference Data',
  },

  access: {
    read: () => true, // public read
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
          const result = await localizeDocument(payload, 'space-actions', id as string, {
            fields: ['label', 'description', 'tagline'],
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
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Human-readable name (localized).',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              localized: false,
              admin: {
                description: 'Machine identifier — must match D1.space_actions.key',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'tagline',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'link',
              type: 'text',
              required: false,
              localized: false,
              admin: {
                description: 'Link for the action card',
              },
            },
            {
              name: 'active',
              type: 'checkbox',
              defaultValue: true,
              localized: false,
            },
            {
              name: 'includedSpaceTypes',
              type: 'relationship',
              relationTo: 'space-types',
              hasMany: true,
              required: false,
              localized: false,
              defaultValue: async ({ req }) => {
                const spaceTypes = await req.payload.find({
                  collection: 'space-types',
                  limit: 0,
                  pagination: false,
                })
                return spaceTypes.docs.map((doc) => doc.id)
              },
              admin: {
                description: 'This message will only be shown to users with these space types.',
              },
            },
            {
              name: 'includedCommitments',
              type: 'relationship',
              relationTo: 'commitments',
              hasMany: true,
              required: false,
              localized: false,
              admin: {
                description: 'This message will only be shown to users who have these commitments.',
              },
            },
            {
              name: 'excludedCommitments',
              type: 'relationship',
              relationTo: 'commitments',
              hasMany: true,
              required: false,
              localized: false,
              admin: {
                description:
                  'This message will only be shown to users who do not have these commitments.',
              },
            },
            {
              name: 'minCommitments',
              type: 'number',
              required: false,
              localized: false,
              admin: {
                description: 'Total number of commitments required to see this message',
              },
            },
            {
              name: 'maxCommitments',
              type: 'number',
              required: false,
              localized: false,
              admin: {
                description: 'The Maximum number of commitments required to see this message',
              },
            },
          ],
        },
        {
          label: 'Scheduling',
          fields: [
            {
              name: 'publishDate',
              label: 'Publish date',
              type: 'date',
              defaultValue: () => new Date().toISOString(),
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
                description: 'The space action will only be displayed once this date is reached.',
              },
              localized: false,
            },
            {
              name: 'endDate',
              label: 'End Date',
              type: 'date',
              defaultValue: () => {
                const date = new Date()
                date.setMonth(date.getMonth() + 1)
                return date.toISOString()
              },
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
                description: 'The space action will not be displayed after this date.',
              },
              localized: false,
            },
            {
              type: 'collapsible',
              label: 'Advanced Scheduling',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'schedule',
                  label: 'Repeat after',
                  type: 'number',
                  defaultValue: 365,
                  localized: false,
                  admin: {
                    description:
                      'The number of days between repeat displays. If set to 365, the user would receive the same message again next year.',
                    placeholder: '365',
                  },
                },
                {
                  name: 'validMonths',
                  label: 'Valid Months',
                  type: 'select',
                  hasMany: true,
                  localized: false,
                  admin: {
                    description: 'Select the months that this space action is valid for.',
                  },
                  options: [
                    { label: 'January', value: '1' },
                    { label: 'February', value: '2' },
                    { label: 'March', value: '3' },
                    { label: 'April', value: '4' },
                    { label: 'May', value: '5' },
                    { label: 'June', value: '6' },
                    { label: 'July', value: '7' },
                    { label: 'August', value: '8' },
                    { label: 'September', value: '9' },
                    { label: 'October', value: '10' },
                    { label: 'November', value: '11' },
                    { label: 'December', value: '12' },
                  ],
                },
                {
                  name: 'limmit',
                  label: 'Max number of possible displays',
                  type: 'number',
                  defaultValue: 999,
                  localized: false,
                  admin: {
                    description:
                      'Number of times a user can receive this message. When set to 1, the user will never see this space action again after the first display.',
                    placeholder: '999',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'author',
              label: 'Author',
              type: 'text',
              defaultValue: ({ user }) => user?.name ?? 'Nadine',
              localized: false,
            },
            {
              name: 'reviewStatus',
              label: 'Review Status',
              type: 'text',
              localized: false,
              admin: { width: '33%' },
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
          const label =
            (typeof data.label === 'object' ? data.label?.[defaultLocale] : data.label) || ''
          if (label) data.slug = slugify(label)
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
          maxTokens: 300,
        },
        {
          fields: ['label', 'description', 'tagline'],
          sourceLocale: 'en',
          guardFlagField: 'autoLocalize',
        },
      ),
    ],
  },
}
