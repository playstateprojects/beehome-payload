import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Check if _order column exists in articles
  const articlesInfo = await db.run(sql`PRAGMA table_info(articles);`)
  const articlesColumns = articlesInfo.results as Array<{ name: string }>
  const orderExists = articlesColumns.some(col => col.name === '_order')

  if (!orderExists) {
    await db.run(sql`ALTER TABLE \`articles\` ADD \`_order\` text;`)
    await db.run(sql`CREATE INDEX \`articles__order_idx\` ON \`articles\` (\`_order\`);`)
  }

  // Check if version__order column exists in _articles_v
  const articlesVInfo = await db.run(sql`PRAGMA table_info(_articles_v);`)
  const articlesVColumns = articlesVInfo.results as Array<{ name: string }>
  const versionOrderExists = articlesVColumns.some(col => col.name === 'version__order')

  if (!versionOrderExists) {
    await db.run(sql`ALTER TABLE \`_articles_v\` ADD \`version__order\` text;`)
    await db.run(sql`CREATE INDEX \`_articles_v_version_version__order_idx\` ON \`_articles_v\` (\`version__order\`);`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`articles__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`articles\` DROP COLUMN \`_order\`;`)
  await db.run(sql`DROP INDEX \`_articles_v_version_version__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`_articles_v\` DROP COLUMN \`version__order\`;`)
}
