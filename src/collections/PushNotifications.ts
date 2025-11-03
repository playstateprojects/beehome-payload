import { aiLocalizeCollection } from '@/hooks/aiLocalize'
import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'

export const PushNotifications: CollectionConfig = {
  slug: 'push-notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'message', 'publishDate', 'tags'],
    group: 'Notifications',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                placeholder: 'e.g., Spring Beekeeping Tips',
              },
            },
            {
              name: 'message',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                placeholder: 'e.g., Check your hive for signs of swarming this season',
              },
            },
            {
              name: 'image',
              label: 'Hero image',
              type: 'upload',
              relationTo: 'media', // ensure you have a Media collection with uploads enabled
              localized: false,
            },
            {
              name: 'tags',
              label: 'Tags',
              type: 'text',
              hasMany: true,
              localized: false,
              admin: {
                description: 'Add tags to categorize this notification.',
                placeholder: 'e.g., seasonal, swarm-prevention, beginner',
              },
            },
            {
              name: 'conditionNotes',
              label: 'Condition Notes',
              type: 'textarea',
              localized: false,
              admin: {
                description:
                  'This note will not be displayed or used in the application but is a note for future reference as to the conditions under which this notification will be selected.',
                placeholder: 'e.g., Show to users who have registered their first hive',
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
                description: 'The notification will only be sent once this date is reached.',
              },
              localized: false,
            },
            {
              name: 'allUsers',
              type: 'checkbox',
              localized: false,
              label: 'Send to All Users',
              admin: {
                description:
                  'When checked, the message will be sent to all users of the app. All conditional checks will be skipped and all users will receive the notification.',
              },
            },
            {
              type: 'collapsible',
              label: 'Advanced Scheduling.',
              admin: {
                initCollapsed: true,
                condition: (data) => !data?.allUsers,
              },
              fields: [
                {
                  name: 'validMonths',
                  label: 'Valid Months',
                  type: 'select',
                  hasMany: true,
                  localized: false,
                  admin: {
                    description: 'Select the months that this notification is valid for.',
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
                  name: 'schedule',
                  label: 'Repeat after',
                  type: 'number',
                  defaultValue: 365,
                  localized: false,
                  admin: {
                    description:
                      'The number of days between repeat sends. If set to 365, the user would receive the same message again next year.',
                    placeholder: '365',
                  },
                },
                {
                  name: 'limmit',
                  label: 'Max number of possible sends',
                  type: 'number',
                  defaultValue: 1,
                  localized: false,
                  admin: {
                    description:
                      "Number of times a user can receive this message. When set to 1, the user will never be sent this notification again. Please note this does not include 'reads'. In other words, if sends is set to 8, the user will receive the message a maximum of 8 times, but only if they don't open it.",
                    placeholder: '1',
                  },
                },
              ],
            },
          ],
        },
      ],
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
