import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`space_actions_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`space_actions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`space_actions_valid_months_order_idx\` ON \`space_actions_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_valid_months_parent_idx\` ON \`space_actions_valid_months\` (\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`space_actions\` ADD \`publish_date\` text;`)
  await db.run(sql`ALTER TABLE \`space_actions\` ADD \`end_date\` text;`)
  await db.run(sql`ALTER TABLE \`space_actions\` ADD \`schedule\` numeric DEFAULT 365;`)
  await db.run(sql`ALTER TABLE \`space_actions\` ADD \`limmit\` numeric DEFAULT 999;`)
  await db.run(sql`ALTER TABLE \`space_actions\` ADD \`author\` text;`)
  await db.run(sql`ALTER TABLE \`space_actions\` ADD \`review_status\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`space_actions_valid_months\`;`)
  await db.run(sql`ALTER TABLE \`space_actions\` DROP COLUMN \`publish_date\`;`)
  await db.run(sql`ALTER TABLE \`space_actions\` DROP COLUMN \`end_date\`;`)
  await db.run(sql`ALTER TABLE \`space_actions\` DROP COLUMN \`schedule\`;`)
  await db.run(sql`ALTER TABLE \`space_actions\` DROP COLUMN \`limmit\`;`)
  await db.run(sql`ALTER TABLE \`space_actions\` DROP COLUMN \`author\`;`)
  await db.run(sql`ALTER TABLE \`space_actions\` DROP COLUMN \`review_status\`;`)
}
