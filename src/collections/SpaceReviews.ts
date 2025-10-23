import type { CollectionConfig } from 'payload'
import { aiLocalizeCollection } from '../hooks/aiLocalize'
import { slugify } from 'payload/shared'

export const SpaceReviews: CollectionConfig = {
  slug: 'space-reviews',
  labels: {
    singular: 'Space Review',
    plural: 'Space Reviews',
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['slug', 'label', 'updatedAt'],
    group: 'Reference Data',
  },

  access: {
    read: () => true, // public read
  },

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
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'includedSpaceTypes',
      type: 'relationship',
      relationTo: 'space-types',
      hasMany: true,
      required: true,
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
        description: 'This message is aplicable to these space types.',
      },
    },
    {
      name: 'includedCommitments',
      type: 'relationship',
      relationTo: 'commitments',
      hasMany: true,
      required: true,
      localized: false,
      defaultValue: async ({ req }) => {
        const commitments = await req.payload.find({
          collection: 'commitments',
          limit: 0,
          pagination: false,
        })
        return commitments.docs.map((doc) => doc.id)
      },
      admin: {
        description: 'This message is aplicable to these commitments',
      },
    },
    {
      name: 'totalCommitments',
      type: 'number',
      required: false,
      localized: false,
      admin: {
        description: 'Total number of commitments',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      localized: false,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      localized: false,
      admin: {
        description: 'Machine identifier — must match D1.space_reviews.key',
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
          fields: ['label', 'description'],
          sourceLocale: 'en',
          guardFlagField: 'autoLocalize',
        },
      ),
    ],
  },
}
