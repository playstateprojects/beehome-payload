import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`articles\` ADD \`action_button_link\` text;`)
  await db.run(sql`ALTER TABLE \`articles_locales\` ADD \`action_button\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`articles\` DROP COLUMN \`action_button_link\`;`)
  await db.run(sql`ALTER TABLE \`articles_locales\` DROP COLUMN \`action_button\`;`)
}
