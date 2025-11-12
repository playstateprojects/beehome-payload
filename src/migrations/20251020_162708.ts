import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Check if column "key" exists before renaming
  const tableInfo = await db.run(sql`PRAGMA table_info(space_types);`)
  const columns = tableInfo.results as Array<{ name: string }>
  const keyExists = columns.some(col => col.name === 'key')
  const slugExists = columns.some(col => col.name === 'slug')

  if (slugExists && !keyExists) {
    console.log('Column already renamed from "key" to "slug", skipping migration...')

    // Check if the old index exists and drop it if needed
    const indexes = await db.run(sql`SELECT name FROM sqlite_master WHERE type='index' AND name='space_types_key_idx';`)
    if (indexes.results && indexes.results.length > 0) {
      await db.run(sql`DROP INDEX \`space_types_key_idx\`;`)
    }

    // Check if the new index exists and create it if needed
    const slugIndexes = await db.run(sql`SELECT name FROM sqlite_master WHERE type='index' AND name='space_types_slug_idx';`)
    if (!slugIndexes.results || slugIndexes.results.length === 0) {
      await db.run(sql`CREATE UNIQUE INDEX \`space_types_slug_idx\` ON \`space_types\` (\`slug\`);`)
    }
    return
  }

  if (keyExists) {
    await db.run(sql`ALTER TABLE \`space_types\` RENAME COLUMN "key" TO "slug";`)
    await db.run(sql`DROP INDEX \`space_types_key_idx\`;`)
    await db.run(sql`CREATE UNIQUE INDEX \`space_types_slug_idx\` ON \`space_types\` (\`slug\`);`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_types\` RENAME COLUMN "slug" TO "key";`)
  await db.run(sql`DROP INDEX \`space_types_slug_idx\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_types_key_idx\` ON \`space_types\` (\`key\`);`)
}
