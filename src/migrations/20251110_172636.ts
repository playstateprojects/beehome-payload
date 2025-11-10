import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`action_cards_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`action_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`action_cards_valid_months_order_idx\` ON \`action_cards_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`action_cards_valid_months_parent_idx\` ON \`action_cards_valid_months\` (\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`action_cards\` ADD \`schedule\` numeric DEFAULT 365;`)
  await db.run(sql`ALTER TABLE \`action_cards\` ADD \`limmit\` numeric DEFAULT 999;`)
  await db.run(sql`ALTER TABLE \`action_cards\` DROP COLUMN \`multiple_views\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`action_cards_valid_months\`;`)
  await db.run(sql`ALTER TABLE \`action_cards\` ADD \`multiple_views\` integer;`)
  await db.run(sql`ALTER TABLE \`action_cards\` DROP COLUMN \`schedule\`;`)
  await db.run(sql`ALTER TABLE \`action_cards\` DROP COLUMN \`limmit\`;`)
}
