import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`articles_locales\` ADD \`tagline\` text;`)
  await db.run(sql`ALTER TABLE \`_articles_v_locales\` ADD \`version_tagline\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`articles_locales\` DROP COLUMN \`tagline\`;`)
  await db.run(sql`ALTER TABLE \`_articles_v_locales\` DROP COLUMN \`version_tagline\`;`)
}
