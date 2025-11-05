import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`articles\` ADD \`_order\` text;`)
  await db.run(sql`CREATE INDEX \`articles__order_idx\` ON \`articles\` (\`_order\`);`)
  await db.run(sql`ALTER TABLE \`_articles_v\` ADD \`version__order\` text;`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__order_idx\` ON \`_articles_v\` (\`version__order\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`articles__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`articles\` DROP COLUMN \`_order\`;`)
  await db.run(sql`DROP INDEX \`_articles_v_version_version__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`_articles_v\` DROP COLUMN \`version__order\`;`)
}
