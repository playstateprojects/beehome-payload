import { aiLocalizeCollection } from '@/hooks/aiLocalize'
import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'

export const PushNotifications: CollectionConfig = {
  slug: 'push-notifications',
  admin: {
    useAsTitle: 'title',
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
      name: 'slug',
      type: 'text',
      required: true,
      localized: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'allUsers',
      type: 'checkbox',
      localized: false,
      label: 'Send to All Users',
      admin: {
        description: 'when checked the message will be sent to all users of the app.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data.key) data.key = crypto.randomUUID()
      },
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
          fields: ['message'],
          guardFlagField: 'autoLocalize',
        },
      ),
    ],
  },
}
