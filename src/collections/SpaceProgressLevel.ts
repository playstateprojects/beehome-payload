import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'

export const SpaceProgressLevel: CollectionConfig = {
  slug: 'space-progress-levels',
  orderable: true,
  labels: {
    singular: 'Space Progress Level',
    plural: 'Space Progress Levels',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['slug', 'order', 'nameEn', 'nameDe'],
    group: 'Reference Data',
  },
  access: {
    read: () => true, // public read
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: false,
              admin: {
                description: 'The Title',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              localized: false,
              admin: {
                description: 'Auto-filled fromTitle if left blank (e.g., mini-wildbienen-oase)',
              },
            },
            {
              name: 'order',
              type: 'number',
              required: true,
              localized: false,
              admin: {
                description: 'Display order of this level',
              },
            },
            {
              name: 'color',
              type: 'text',
              required: true,
              localized: false,
              admin: {
                description: 'Hex color code (e.g., #80B873)',
              },
              validate: (value: string) => {
                if (!value) return 'Color is required'
                // Validate hex color format
                const hexColorRegex = /^#[0-9A-Fa-f]{6}$/
                if (!hexColorRegex.test(value)) {
                  return 'Please enter a valid hex color code (e.g., #80B873)'
                }
                return true
              },
            },
            {
              name: 'highlightColor',
              type: 'text',
              required: true,
              localized: false,
              admin: {
                description: 'Hex color code for the lighter color (e.g., #80B873)',
              },
              validate: (value: string) => {
                if (!value) return 'Color is required'
                // Validate hex color format
                const hexColorRegex = /^#[0-9A-Fa-f]{6}$/
                if (!hexColorRegex.test(value)) {
                  return 'Please enter a valid hex color code (e.g., #80B873)'
                }
                return true
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              localized: false,
              admin: {
                description: 'A shortDescription',
              },
            },
            {
              name: 'actionButtonLabel',
              type: 'text',
              localized: true,
              admin: {
                description: 'Label for the action button (localized)',
              },
            },
            {
              name: 'actionButtonLink',
              type: 'text',
              localized: false,
              admin: {
                description: 'URL or link for the action button',
              },
            },
            {
              name: 'requirements',
              type: 'group',
              fields: [
                {
                  name: 'minActiveCategories',
                  type: 'number',
                  required: true,
                  defaultValue: 0,
                  admin: {
                    description: 'Minimum number of active categories required',
                  },
                },
                {
                  name: 'categoryRequirements',
                  type: 'array',
                  fields: [
                    {
                      name: 'parentSlug',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'The parent category slug (e.g., no_pesticides, rckzugsorte)',
                      },
                    },
                    {
                      name: 'required',
                      type: 'number',
                      required: true,
                      defaultValue: 1,
                      admin: {
                        description: 'Number of actions required from this category',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Success Page',
          fields: [
            {
              name: 'successPage',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  admin: {
                    description: 'Title for the success page',
                  },
                },
                {
                  name: 'image',
                  label: 'Image',
                  type: 'upload',
                  relationTo: 'media',
                  localized: false,
                  admin: {
                    description: 'Image to display on the success page',
                  },
                },
                {
                  name: 'mainText',
                  type: 'textarea',
                  localized: true,
                  admin: {
                    description: 'Main text content',
                  },
                },
                {
                  name: 'subText',
                  type: 'textarea',
                  localized: true,
                  admin: {
                    description: 'Secondary text content',
                  },
                },
                {
                  name: 'actionButtonLabel',
                  type: 'text',
                  localized: true,
                  admin: {
                    description: 'Label for the action button',
                  },
                },
                {
                  name: 'actionButtonLink',
                  type: 'text',
                  localized: false,
                  admin: {
                    description: 'URL or link for the action button',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return
        if (!data.slug || String(data.slug).trim() === '') {
          // Try to use nameEn first, fall back to nameDe
          const name = data.nameEn || data.nameDe || ''
          if (name) data.slug = slugify(name)
        } else {
          data.slug = slugify(String(data.slug))
        }
      },
    ],
  },
}

export default SpaceProgressLevel
