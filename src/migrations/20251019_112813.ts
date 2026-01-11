import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Check if column already exists
  const tableInfo = await db.run(sql`PRAGMA table_info(in_app_notifications_locales);`)
  const columns = tableInfo.results as Array<{ name: string }>
  const columnExists = columns.some(col => col.name === 'action_button_link')

  if (columnExists) {
    console.log('Column action_button_link already exists, skipping migration...')
    return
  }

  await db.run(sql`ALTER TABLE \`in_app_notifications_locales\` ADD \`action_button_link\` text DEFAULT 'OK';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`in_app_notifications_locales\` DROP COLUMN \`action_button_link\`;`)
}
