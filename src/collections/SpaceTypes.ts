import type { CollectionConfig } from 'payload'
import { aiLocalizeCollection } from '../hooks/aiLocalize'

export const SpaceTypes: CollectionConfig = {
  slug: 'space-types',
  labels: {
    singular: 'Space Type',
    plural: 'Space Types',
  },
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'label', 'updatedAt'],
    group: 'Reference Data',
  },

  access: {
    read: () => true, // public read
  },

  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      localized: false,
      admin: {
        description: 'Machine key (e.g. balcony, garden) — must match D1.space_types.key',
      },
    },
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
      name: 'sort',
      type: 'number',
      defaultValue: 0,
      localized: false,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      localized: false,
    },
  ],

  hooks: {
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
          maxTokens: 300,
        },
        {
          fields: ['label', 'description'], // the localized fields to fill
          sourceLocale: 'en', // change if your default is different
          // targetLocales: ['de','fr','it'],       // or omit to use all configured except source
          guardFlagField: 'autoLocalize', // only runs when true
        },
      ),
    ],
  },
}
