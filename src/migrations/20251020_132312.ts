import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Check if column already exists
  const tableInfo = await db.run(sql`PRAGMA table_info(push_notifications);`)
  const columns = tableInfo.results as Array<{ name: string }>
  const columnExists = columns.some(col => col.name === 'all_users')

  if (columnExists) {
    console.log('Column all_users already exists, skipping migration...')
    return
  }

  await db.run(sql`ALTER TABLE \`push_notifications\` ADD \`all_users\` integer;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`push_notifications\` DROP COLUMN \`all_users\`;`)
}
