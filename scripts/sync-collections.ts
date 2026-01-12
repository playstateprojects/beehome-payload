import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { config as dotenvConfig } from 'dotenv'

// Load .env file
dotenvConfig()

interface SyncOptions {
  collections?: string[]
  exportDir?: string
  mode: 'export' | 'import'
  overwrite?: boolean
}

const DEFAULT_EXPORT_DIR = './db/exports'

async function syncCollections(options: SyncOptions) {
  const payload = await getPayload({ config })

  const exportDir = options.exportDir || DEFAULT_EXPORT_DIR
  const collections = options.collections || [
    'articles',
    'bee-info',
    'in-app-notifications',
    'action-cards',
    'questionnaire',
    'badge',
    'space-actions',
    'push-notifications',
    'space-types',
    'space-progress-level',
    'commitments',
    // 'users', // Uncomment if you want to sync users
    // 'media', // Uncomment if you want to sync media (note: files need separate handling)
  ]

  if (options.mode === 'export') {
    console.log('🔄 Exporting collections from current environment...')
    await exportCollections(payload, collections, exportDir)
  } else {
    console.log('🔄 Importing collections to current environment...')
    await importCollections(payload, collections, exportDir, options.overwrite || false)
  }

  console.log('✅ Sync complete!')
  process.exit(0)
}

async function exportCollections(payload: any, collections: string[], exportDir: string) {
  // Ensure export directory exists
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]

  for (const collectionSlug of collections) {
    try {
      console.log(`📦 Exporting ${collectionSlug}...`)

      const result = await payload.find({
        collection: collectionSlug,
        limit: 1000, // Adjust if you have more than 1000 items
        depth: 2, // Adjust depth to include relationships
      })

      const filename = path.join(exportDir, `${collectionSlug}-${timestamp}.json`)
      fs.writeFileSync(filename, JSON.stringify(result.docs, null, 2))

      console.log(`  ✓ Exported ${result.docs.length} items to ${filename}`)
    } catch (error) {
      console.error(`  ✗ Failed to export ${collectionSlug}:`, error.message)
    }
  }
}

async function importCollections(
  payload: any,
  collections: string[],
  exportDir: string,
  overwrite: boolean,
) {
  for (const collectionSlug of collections) {
    try {
      // Find the most recent export file for this collection
      const files = fs
        .readdirSync(exportDir)
        .filter((f) => f.startsWith(collectionSlug) && f.endsWith('.json'))
        .sort()
        .reverse()

      if (files.length === 0) {
        console.log(`  ⚠️  No export file found for ${collectionSlug}, skipping...`)
        continue
      }

      const filename = path.join(exportDir, files[0])
      console.log(`📥 Importing ${collectionSlug} from ${files[0]}...`)

      const data = JSON.parse(fs.readFileSync(filename, 'utf-8'))

      let successCount = 0
      let skipCount = 0
      let errorCount = 0

      for (const doc of data) {
        try {
          // Remove auto-generated fields
          const { id, createdAt, updatedAt, ...docData } = doc

          if (overwrite && id) {
            // Try to update existing document
            try {
              await payload.update({
                collection: collectionSlug,
                id,
                data: docData,
              })
              successCount++
              console.log(`  ✓ Updated ${collectionSlug} #${id}`)
            } catch (updateError) {
              // If update fails, try to create
              await payload.create({
                collection: collectionSlug,
                data: { ...docData, id },
              })
              successCount++
              console.log(`  ✓ Created ${collectionSlug} #${id}`)
            }
          } else {
            // Check if document exists
            const existing = id
              ? await payload
                  .find({
                    collection: collectionSlug,
                    where: { id: { equals: id } },
                    limit: 1,
                  })
                  .catch(() => null)
              : null

            if (existing && existing.docs.length > 0) {
              skipCount++
              console.log(`  ⊘ Skipped ${collectionSlug} #${id} (already exists)`)
            } else {
              // Create new document
              await payload.create({
                collection: collectionSlug,
                data: id ? { ...docData, id } : docData,
              })
              successCount++
              console.log(`  ✓ Created ${collectionSlug} #${id || 'new'}`)
            }
          }
        } catch (error) {
          errorCount++
          console.error(`  ✗ Failed to import item:`, error.message)
        }
      }

      console.log(
        `  📊 Summary: ${successCount} imported, ${skipCount} skipped, ${errorCount} errors`,
      )
    } catch (error) {
      console.error(`  ✗ Failed to import ${collectionSlug}:`, error.message)
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const mode = args.includes('--export') ? 'export' : args.includes('--import') ? 'import' : null
const overwrite = args.includes('--overwrite')
const collectionsArg = args.find((arg) => arg.startsWith('--collections='))
const collections = collectionsArg
  ? collectionsArg.split('=')[1].split(',').map((c) => c.trim())
  : undefined
const exportDirArg = args.find((arg) => arg.startsWith('--dir='))
const exportDir = exportDirArg ? exportDirArg.split('=')[1] : undefined

if (!mode) {
  console.error(`
Usage:
  Export: pnpm sync:export [options]
  Import: pnpm sync:import [options]

Options:
  --collections=col1,col2  Specify which collections to sync (comma-separated)
  --dir=./path             Custom export/import directory (default: ./db/exports)
  --overwrite              Overwrite existing documents during import (default: skip)

Examples:
  # Export all collections from production
  CLOUDFLARE_ENV=production pnpm sync:export

  # Export specific collections
  pnpm sync:export --collections=articles,action-cards

  # Import to development
  CLOUDFLARE_ENV=preview pnpm sync:import

  # Import and overwrite existing data
  pnpm sync:import --overwrite
  `)
  process.exit(1)
}

syncCollections({ mode, collections, exportDir, overwrite })
