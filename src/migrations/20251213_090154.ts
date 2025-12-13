import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bee_info\` ADD \`_order\` text;`)
  await db.run(sql`CREATE INDEX \`bee_info__order_idx\` ON \`bee_info\` (\`_order\`);`)
  await db.run(sql`ALTER TABLE \`_bee_info_v\` ADD \`version__order\` text;`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_version_version__order_idx\` ON \`_bee_info_v\` (\`version__order\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`bee_info__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`bee_info\` DROP COLUMN \`_order\`;`)
  await db.run(sql`DROP INDEX \`_bee_info_v_version_version__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`_bee_info_v\` DROP COLUMN \`version__order\`;`)
}
