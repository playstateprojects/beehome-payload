import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'
import { aiLocalizeCollection } from '../hooks/aiLocalize'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { BlocksFeature } from '@payloadcms/richtext-lexical'
import { ProductRecommendations } from '../blocks/ProductRecommendations'

export const BeeInfo: CollectionConfig = {
  slug: 'bee-info',
  labels: { singular: 'Bee Info', plural: 'Bee Info' },
  versions: { drafts: true },
  admin: {
    useAsTitle: 'speciesName',
    defaultColumns: ['speciesName', 'scientificName', 'status', 'publishDate', 'updatedAt'],
    group: 'Content',
  },
  access: { read: () => true },

  fields: [
    // ========================================
    // META TAB
    // ========================================
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Meta',
          fields: [
            {
              name: 'speciesName',
              label: 'Species Name',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Common name of the bee species (localized).',
              },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true as any,
              localized: false,
              admin: {
                description: 'Auto-generated from Species Name if left blank.',
              },
            },
            {
              name: 'scientificName',
              label: 'Scientific Name',
              type: 'text',
              required: true,
              localized: false,
              admin: {
                description: 'Latin scientific name (e.g., Apis mellifera).',
              },
            },
            {
              name: 'commonTagline',
              label: 'Common Tagline',
              type: 'text',
              localized: true,
              admin: {
                description: 'A short tagline that appears at the top of the bee info page.',
              },
            },
            {
              name: 'heroImage',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
              localized: false,
              admin: {
                description: 'Main header image for this bee species.',
              },
            },
          ],
        },

        // ========================================
        // QUICK FACTS TAB
        // ========================================
        {
          label: 'Quick Facts',
          fields: [
            {
              name: 'size',
              label: 'Size',
              type: 'text',
              localized: true,
              admin: {
                description: 'Size description (e.g., "8-12mm").',
              },
            },
            {
              name: 'flightTime',
              label: 'Flight Time',
              type: 'text',
              localized: true,
              admin: {
                description: 'When this bee is active (e.g., "March - September").',
              },
            },
            {
              name: 'distribution',
              label: 'Distribution',
              type: 'text',
              localized: true,
              admin: {
                description: 'Geographic distribution of the species.',
              },
            },
            {
              name: 'habitat',
              label: 'Habitat',
              type: 'text',
              localized: true,
              admin: {
                description: 'Preferred habitat types.',
              },
            },
            {
              name: 'status',
              label: 'Conservation Status',
              type: 'select',
              localized: false,
              options: [
                { label: 'Common', value: 'common' },
                { label: 'Stable', value: 'stable' },
                { label: 'Declining', value: 'declining' },
                { label: 'Threatened', value: 'threatened' },
                { label: 'Endangered', value: 'endangered' },
                { label: 'Unknown', value: 'unknown' },
              ],
              admin: {
                description: 'Conservation status of the species.',
              },
            },
            {
              name: 'specialTrait',
              label: 'Special Trait',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Notable characteristics or behaviors of this bee species.',
              },
            },
          ],
        },

        // ========================================
        // BODY SECTIONS TAB
        // ========================================
        {
          label: 'Body Sections',
          fields: [
            {
              name: 'sections',
              label: 'Sections',
              type: 'array',
              localized: false,
              admin: {
                description:
                  'Add multiple content sections with titles, rich text, and optional images.',
              },
              fields: [
                {
                  name: 'sectionTitle',
                  label: 'Section Title',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                {
                  name: 'sectionBody',
                  label: 'Section Body',
                  type: 'richText',
                  required: true,
                  localized: true,
                  editor: lexicalEditor({
                    features: ({ defaultFeatures }) => [
                      ...defaultFeatures.filter(
                        (feature) =>
                          feature.key !== 'toolbarInline' &&
                          feature.key !== 'floatingSelectToolbar',
                      ),
                      FixedToolbarFeature(),
                      BlocksFeature({
                        blocks: [ProductRecommendations],
                      }),
                    ],
                  }),
                },
                {
                  name: 'sectionImage',
                  label: 'Section Image',
                  type: 'upload',
                  relationTo: 'media',
                  localized: false,
                  admin: {
                    description: 'Optional image for this section.',
                  },
                },
              ],
            },
          ],
        },

        // ========================================
        // RELATED CONTENT TAB
        // ========================================
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
              },
            },
          ],
        },

        // ========================================
        // METADATA TAB
        // ========================================
        {
          label: 'Metadata',
          fields: [
            {
              name: 'publishDate',
              label: 'Publish Date',
              type: 'date',
              defaultValue: () => new Date().toISOString(),
              admin: { date: { pickerAppearance: 'dayAndTime' } },
              localized: false,
            },
            {
              name: 'author',
              label: 'Author',
              type: 'text',
              defaultValue: ({ user }) => user?.name ?? 'Nadine',
              localized: false,
            },
          ],
        },
      ],
    },
  ],

  hooks: {
    // Auto-generate slug from default-locale speciesName if missing
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return
        if (!data.slug || String(data.slug).trim() === '') {
          const localization = req.payload.config.localization
          const defaultLocale = localization ? localization.defaultLocale : 'en'
          const speciesName =
            (typeof data.speciesName === 'object'
              ? data.speciesName?.[defaultLocale]
              : data.speciesName) || ''
          if (speciesName) data.slug = slugify(speciesName)
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
          maxTokens: 1500,
        },
        {
          fields: [
            'speciesName',
            'commonTagline',
            'size',
            'flightTime',
            'distribution',
            'habitat',
            'specialTrait',
            'sections.sectionTitle',
            'sections.sectionBody',
          ],
          sourceLocale: 'de', // matches your default locale
        },
      ),
    ],
  },
}

export default BeeInfo
