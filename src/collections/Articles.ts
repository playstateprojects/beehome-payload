// src/payload/collections/Articles.ts
import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'
import { aiLocalizeCollection } from '../hooks/aiLocalize'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { BlocksFeature } from '@payloadcms/richtext-lexical'
import { ProductRecommendations } from '../blocks/ProductRecommendations'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },
  versions: { drafts: true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishDate', 'author', 'reviewStatus', 'updatedAt'],
    group: 'Content',
  },
  access: { read: () => true },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            // Title — localized
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },

            // Slug — NOT localized (single canonical URL)
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true as any, // supported in Prisma adapter; harmless otherwise
              localized: false,
              admin: { description: 'Auto-filled from Title if left blank.' },
            },
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'A short Tagline that will apear on the homepage and at the top of each article in a script font.',
              },
            },

            // Hero image — NOT localized
            {
              name: 'heroImage',
              label: 'Hero image',
              type: 'upload',
              relationTo: 'media', // ensure you have a Media collection with uploads enabled
              localized: false,
            },
            // Intro / Teaser — localized rich text
            {
              name: 'intro',
              label: 'Intro / Teaser',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures.filter(
                    (feature) => feature.key !== 'toolbarInline' && feature.key !== 'floatingSelectToolbar',
                  ),
                  FixedToolbarFeature(),
                  BlocksFeature({
                    blocks: [ProductRecommendations],
                  }),
                ],
              }),
            },

            // Body — localized rich text
            {
              name: 'body',
              label: 'Body',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures.filter(
                    (feature) => feature.key !== 'toolbarInline' && feature.key !== 'floatingSelectToolbar',
                  ),
                  FixedToolbarFeature(),
                  BlocksFeature({
                    blocks: [ProductRecommendations],
                  }),
                ],
              }),
            },
            {
              name: 'actionButton',
              type: 'text',
              localized: true,
            },
            {
              name: 'actionButtonLink',
              type: 'text',
              localized: false,
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            // Publish date — NOT localized
            {
              name: 'publishDate',
              label: 'Publish date',
              type: 'date',
              defaultValue: () => new Date().toISOString(),
              admin: { date: { pickerAppearance: 'dayAndTime' } },
              localized: false,
            },

            // Author — NOT localized
            {
              name: 'author',
              label: 'Author',
              type: 'text',
              defaultValue: ({ user }) => user?.name ?? 'Nadine',
              localized: false,
            },

            // Review Status — NOT localized
            {
              name: 'reviewStatus',
              label: 'Review Status',
              type: 'text',
              localized: false,
              admin: { width: '33%' },
            },
          ],
        },
        {
          label: 'Targeting',
          fields: [
            {
              name: 'spaceTypes',
              label: 'Space Types',
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
                description: 'This article will only be shown to users with these space types.',
                width: '100%',
              },
            },
            {
              name: 'includedCommitments',
              label: 'Included Commitments',
              type: 'relationship',
              relationTo: 'commitments',
              hasMany: true,
              required: false,
              localized: false,
              admin: {
                description: 'This article will only be shown to users who have these commitments.',
                width: '50%',
              },
            },
            {
              name: 'excludedCommitments',
              label: 'Excluded Commitments',
              type: 'relationship',
              relationTo: 'commitments',
              hasMany: true,
              required: false,
              localized: false,
              admin: {
                description: 'This article will only be shown to users who do not have these commitments.',
                width: '50%',
              },
            },
          ],
        },
        {
          label: 'Seasonal Display',
          fields: [
            {
              name: 'validMonths',
              label: 'Valid Months',
              type: 'select',
              hasMany: true,
              localized: false,
              defaultValue: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
              admin: {
                description: 'Select the months that this article is valid for. All months are selected by default.',
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
          ],
        },
        {
          label: 'Related Content',
          fields: [
            {
              name: 'relatedArticles',
              label: 'Related Articles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
              localized: false,
              admin: {
                description: 'Link to related articles.',
                width: '50%',
              },
            },
            {
              name: 'relatedBees',
              label: 'Related Bee Species',
              type: 'relationship',
              relationTo: 'bee-info',
              hasMany: true,
              localized: false,
              admin: {
                description: 'Link to other related bee species.',
                width: '50%',
              },
            },
            {
              name: 'relatedQuestionnaires',
              label: 'Related Questionnaires',
              type: 'relationship',
              relationTo: 'questionnaire',
              hasMany: true,
              localized: false,
              admin: {
                description: 'Link to related questionnaires.',
                width: '50%',
              },
            },
            {
              name: 'relatedCommitments',
              label: 'Related Commitments',
              type: 'relationship',
              relationTo: 'commitments',
              hasMany: true,
              localized: false,
              admin: {
                description: 'Link to related commitments.',
                width: '50%',
              },
            },
          ],
        },
      ],
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
          fields: ['body', 'intro', 'title'], // the localized fields to fill
          sourceLocale: 'en', // change if your default is different
          // targetLocales: ['de','fr','it'],       // or omit to use all configured except source
        },
      ),
    ],
  },
}

export default Articles
