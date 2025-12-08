import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`commitments\` ADD \`_order\` text;`)
  await db.run(sql`CREATE INDEX \`commitments__order_idx\` ON \`commitments\` (\`_order\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`commitments__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`commitments\` DROP COLUMN \`_order\`;`)
}
