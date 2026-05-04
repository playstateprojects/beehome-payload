import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`action_cards_available_in_countries\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`action_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`action_cards_available_in_countries_order_idx\` ON \`action_cards_available_in_countries\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`action_cards_available_in_countries_parent_idx\` ON \`action_cards_available_in_countries\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_action_cards_v_version_available_in_countries\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_action_cards_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_action_cards_v_version_available_in_countries_order_idx\` ON \`_action_cards_v_version_available_in_countries\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_version_available_in_countries_parent_idx\` ON \`_action_cards_v_version_available_in_countries\` (\`parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`action_cards_available_in_countries\`;`)
  await db.run(sql`DROP TABLE \`_action_cards_v_version_available_in_countries\`;`)
}
