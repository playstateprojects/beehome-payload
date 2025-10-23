import type { CollectionConfig } from 'payload'
import { aiLocalizeCollection } from '../hooks/aiLocalize'
import { slugify } from 'payload/shared'

export const Commitments: CollectionConfig = {
  slug: 'commitments',
  labels: {
    singular: 'Commitment',
    plural: 'Commitments',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['key', 'title', 'category', 'impact_score', 'updatedAt'],
    group: 'Reference Data',
  },

  access: {
    read: () => true, // public read
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Human-readable label (localized).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'emoji',
      type: 'text',
      localized: false,
      required: false,
      admin: {
        description: 'Single emoji character (optional)',
      },
      validate: (value: string) => {
        if (!value) return true // optional field
        // Regex to match a single emoji (including multi-codepoint emojis)
        const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u
        if (!emojiRegex.test(value)) {
          return 'Please enter a valid emoji character'
        }
        return true
      },
    },

    {
      name: 'impact_score',
      type: 'number',
      min: 0,
      max: 100,
      localized: false,
      defaultValue: 1,
      admin: {
        description: 'Rough impact score 0-100',
      },
    },
    {
      name: 'space_types',
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
        description: 'Space types this commitment applies to',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      localized: false,
      admin: {
        description: 'Machine key (e.g. no_pesticides, plant_native_flowers)',
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
          const title =
            (typeof data.title === 'object' ? data.title?.[defaultLocale] : data.title) || ''
          if (title) data.slug = slugify(title)
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
          fields: ['title', 'description'],
          guardFlagField: 'autoLocalize',
        },
      ),
    ],
  },
}
