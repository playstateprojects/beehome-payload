import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Check if column "key" exists before renaming
  const tableInfo = await db.run(sql`PRAGMA table_info(push_notifications);`)
  const columns = tableInfo.results as Array<{ name: string }>
  const keyExists = columns.some(col => col.name === 'key')
  const slugExists = columns.some(col => col.name === 'slug')

  if (slugExists && !keyExists) {
    console.log('Column already renamed from "key" to "slug", skipping migration...')
    return
  }

  if (keyExists) {
    await db.run(sql`ALTER TABLE \`push_notifications\` RENAME COLUMN "key" TO "slug";`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`push_notifications\` RENAME COLUMN "slug" TO "key";`)
}
