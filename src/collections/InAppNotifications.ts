import { aiLocalizeCollection } from '@/hooks/aiLocalize'
import type { CollectionConfig } from 'payload'

export const InAppNotifications: CollectionConfig = {
  slug: 'in-app-notifications',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['title', 'message', 'publishDate'],
    group: 'Notifications',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
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
                placeholder: 'e.g., Spring Gardening tips',
              },
            },
            {
              name: 'message',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                placeholder:
                  "e.g., What to plant now to ensure there's plenty of food for summer bees",
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
              type: 'row',
              fields: [
                {
                  name: 'actionButtonText',
                  label: 'Action Button Text',
                  type: 'text',
                  defaultValue: 'OK',
                  localized: true,
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., Learn More',
                  },
                },
                {
                  name: 'actionButtonLink',
                  label: 'Action Button Link',
                  type: 'text',
                  localized: true,
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., /guides/spring-care',
                  },
                },
              ],
            },
            {
              name: 'tags',
              label: 'Tags',
              type: 'text',
              hasMany: true,
              localized: false,
              admin: {
                description: 'Add tags to categorize this notification.',
                placeholder: 'e.g., spring, garden, beginner',
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
                placeholder: 'e.g., Show to users who have registered their first beehome',
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
                description: 'The notification will only be displayed once this date is reached.',
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
                description: 'The notification will not be displayed after this date.',
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
                  name: 'limmit',
                  label: 'Max number of possible displays',
                  type: 'number',
                  defaultValue: 999,
                  localized: false,
                  admin: {
                    description:
                      'Number of times a user can receive this message. When set to 1, the user will never see this notification again after the first display.',
                    placeholder: '999',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'key',
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
          fields: ['title', 'message', 'actionButtonText'],
          sourceLocale: 'en',
        },
      ),
    ],
  },
}
