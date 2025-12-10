import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'

export const Badge: CollectionConfig = {
  slug: 'badges',
  labels: { singular: 'Badge', plural: 'Badges' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Content',
  },
  access: { read: () => true },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      localized: false,
      admin: {
        description: 'Auto-filled from Name if left blank.',
      },
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'upload',
      relationTo: 'media',
      localized: false,
    },
    {
      name: 'page',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'subtitle',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
          localized: true,
        },
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          localized: false,
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
  ],

  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return
        if (!data.slug || String(data.slug).trim() === '') {
          const localization = req.payload.config.localization
          const defaultLocale = localization ? localization.defaultLocale : 'en'
          const name =
            (typeof data.name === 'object' ? data.name?.[defaultLocale] : data.name) || ''
          if (name) data.slug = slugify(name)
        } else {
          data.slug = slugify(String(data.slug))
        }
      },
    ],
  },
}

export default Badge
