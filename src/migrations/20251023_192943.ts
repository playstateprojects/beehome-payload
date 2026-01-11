import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Check if emoji column already exists
  const tableInfo = await db.run(sql`PRAGMA table_info(space_types);`)
  const columns = tableInfo.results as Array<{ name: string }>
  const emojiExists = columns.some(col => col.name === 'emoji')

  if (emojiExists) {
    console.log('Column emoji already exists, skipping migration...')
    return
  }

  await db.run(sql`ALTER TABLE \`space_types\` ADD \`emoji\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_types\` DROP COLUMN \`emoji\`;`)
}
