import type { CollectionConfig } from 'payload'
import { aiLocalizeCollection } from '../hooks/aiLocalize'

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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      localized: false,
      admin: {
        description: 'Machine key (e.g. no_pesticides, plant_native_flowers)',
      },
    },
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
      admin: {
        description: 'Space types this commitment applies to',
      },
    },
  ],

  hooks: {
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
