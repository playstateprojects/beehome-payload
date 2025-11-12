import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_types\` ADD \`_order\` text;`)
  await db.run(sql`CREATE INDEX \`space_types__order_idx\` ON \`space_types\` (\`_order\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`space_types__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`space_types\` DROP COLUMN \`_order\`;`)
}
