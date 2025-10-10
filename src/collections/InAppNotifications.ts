import { aiLocalizeCollection } from '@/hooks/aiLocalize'
import type { CollectionConfig } from 'payload'

export const InAppNotifications: CollectionConfig = {
  slug: 'in-app-notifications',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['title', 'message', 'publishDate'],
    group: 'Notifications',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      label: 'Hero image',
      type: 'upload',
      relationTo: 'media', // ensure you have a Media collection with uploads enabled
      localized: false,
    },
    {
      name: 'publishDate',
      label: 'Publish date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayAndTime' } },
      localized: false,
    },
    {
      name: 'schedule',
      label: 'Repeat after',
      type: 'number',
      defaultValue: 365,
      localized: false,
    },
    {
      name: 'limmit',
      label: 'Number of times a user can recieve this message.',
      type: 'number',
      defaultValue: 999,
      localized: false,
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      localized: false,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data.key) data.key = crypto.randomUUID()
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
          fields: ['message'],
          guardFlagField: 'autoLocalize',
        },
      ),
    ],
  },
}
