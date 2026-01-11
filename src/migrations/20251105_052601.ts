import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Check if tagline column exists in articles_locales
  const articlesLocalesInfo = await db.run(sql`PRAGMA table_info(articles_locales);`)
  const articlesLocalesColumns = articlesLocalesInfo.results as Array<{ name: string }>
  const taglineExists = articlesLocalesColumns.some(col => col.name === 'tagline')

  if (!taglineExists) {
    await db.run(sql`ALTER TABLE \`articles_locales\` ADD \`tagline\` text;`)
  }

  // Check if version_tagline column exists in _articles_v_locales
  const articlesVLocalesInfo = await db.run(sql`PRAGMA table_info(_articles_v_locales);`)
  const articlesVLocalesColumns = articlesVLocalesInfo.results as Array<{ name: string }>
  const versionTaglineExists = articlesVLocalesColumns.some(col => col.name === 'version_tagline')

  if (!versionTaglineExists) {
    await db.run(sql`ALTER TABLE \`_articles_v_locales\` ADD \`version_tagline\` text;`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`articles_locales\` DROP COLUMN \`tagline\`;`)
  await db.run(sql`ALTER TABLE \`_articles_v_locales\` DROP COLUMN \`version_tagline\`;`)
}
