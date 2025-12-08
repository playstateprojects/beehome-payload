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
    useAsTitle: 'nameEn',
    defaultColumns: ['id', 'order', 'nameEn', 'nameDe'],
    group: 'Reference Data',
  },
  access: {
    read: () => true, // public read
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      unique: true,
      localized: false,
      admin: {
        description: 'Unique identifier (e.g., mini-wildbienen-oase)',
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
      name: 'nameEn',
      type: 'text',
      required: true,
      localized: false,
      admin: {
        description: 'Name in English',
      },
    },
    {
      name: 'nameDe',
      type: 'text',
      required: true,
      localized: false,
      admin: {
        description: 'Name in German',
      },
    },
    {
      name: 'descriptionEn',
      type: 'textarea',
      required: true,
      localized: false,
      admin: {
        description: 'Description in English',
      },
    },
    {
      name: 'descriptionDe',
      type: 'textarea',
      required: true,
      localized: false,
      admin: {
        description: 'Description in German',
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

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return
        // Slugify the id field if provided
        if (data.id) {
          data.id = slugify(String(data.id))
        }
      },
    ],
  },
}

export default SpaceProgressLevel
