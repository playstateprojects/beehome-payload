import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`in_app_notifications_locales\` ADD \`action_button_link\` text DEFAULT 'OK';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`in_app_notifications_locales\` DROP COLUMN \`action_button_link\`;`)
}
