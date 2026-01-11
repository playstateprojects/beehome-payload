import type { Block } from 'payload'

export const ProductRecommendations: Block = {
  slug: 'productRecommendations',
  labels: {
    singular: 'Product Recommendations',
    plural: 'Product Recommendations',
  },
  fields: [
    {
      name: 'skus',
      type: 'array',
      label: 'Product SKUs',
      required: true,
      fields: [
        {
          name: 'sku',
          type: 'text',
          required: true,
          label: 'SKU',
          admin: {
            placeholder: 'Enter product SKU',
          },
        },
      ],
    },
  ],
}
