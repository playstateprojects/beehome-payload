// src/payload/collections/Articles.ts
import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'
import { aiLocalizeCollection } from '../hooks/aiLocalize'

export const ActionCards: CollectionConfig = {
  slug: 'action-cards',
  labels: { singular: 'Action Card', plural: 'Action Cards' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'link'],
    group: 'Content',
  },
  access: { read: () => true },

  fields: [
    // Title — localized
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: false,
      hidden: true,
    },
    {
      name: 'topic',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Appears top left.' },
    },
    {
      name: 'tag',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Appears top right.' },
    },

    // Slug — NOT localized (single canonical URL)
    {
      name: 'link',
      type: 'text',
      localized: false,
      admin: { description: 'A link to follow when the action cards is clicked.' },
    },

    // Hero image — NOT localized
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media', // ensure you have a Media collection with uploads enabled
      localized: false,
    },

    // Body — localized rich text
    {
      name: 'body',
      label: 'Body',
      type: 'richText',
      localized: true,
    },

    // Publish date — NOT localized
    {
      name: 'publishDate',
      label: 'Publish date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayAndTime' } },
      localized: false,
    },
    {
      name: 'endDate',
      label: 'Publish date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayAndTime' } },
      localized: false,
    },
    {
      name: 'multipleViews',
      label: 'Multiple Views',
      type: 'checkbox',
      localized: false,
      admin: { description: 'Show even if already viewed' },
    },
    {
      name: 'displayToAllUsers',
      label: 'Display to all.',
      type: 'checkbox',
      localized: false,
      admin: {
        description:
          'Display this Action Card to all users. No rules will be checked before display',
      },
    },
  ],

  hooks: {
    // Auto-generate slug from default-locale title if missing
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
          maxTokens: 1300,
        },
        {
          fields: ['body', 'topic', 'title', 'tag'], // the localized fields to fill
          sourceLocale: 'en', // change if your default is different
          // targetLocales: ['de','fr','it'],       // or omit to use all configured except source
        },
      ),
    ],
  },
}

export default ActionCards
