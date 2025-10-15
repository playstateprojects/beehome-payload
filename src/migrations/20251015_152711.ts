import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`questionnaire_locales\` RENAME COLUMN "title" TO "name";`)
  await db.run(sql`ALTER TABLE \`questionnaire_locales\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire\` ADD \`note\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`questionnaire_locales\` RENAME COLUMN "name" TO "title";`)
  await db.run(sql`ALTER TABLE \`questionnaire_locales\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`questionnaire\` DROP COLUMN \`note\`;`)
}
