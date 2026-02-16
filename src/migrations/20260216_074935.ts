import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_action_cards_v_version_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_action_cards_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_action_cards_v_version_valid_months_order_idx\` ON \`_action_cards_v_version_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_version_valid_months_parent_idx\` ON \`_action_cards_v_version_valid_months\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_action_cards_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__order\` text,
  	\`version_slug\` text,
  	\`version_link\` text,
  	\`version_image_id\` integer,
  	\`version_display_to_all_users\` integer,
  	\`version_publish_date\` text,
  	\`version_end_date\` text,
  	\`version_schedule\` numeric DEFAULT 365,
  	\`version_limmit\` numeric DEFAULT 999,
  	\`version_author\` text,
  	\`version_review_status\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`action_cards\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_action_cards_v_parent_idx\` ON \`_action_cards_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_version_version__order_idx\` ON \`_action_cards_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_version_version_image_idx\` ON \`_action_cards_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_version_version_updated_at_idx\` ON \`_action_cards_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_version_version_created_at_idx\` ON \`_action_cards_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_version_version__status_idx\` ON \`_action_cards_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_created_at_idx\` ON \`_action_cards_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_updated_at_idx\` ON \`_action_cards_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_snapshot_idx\` ON \`_action_cards_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_published_locale_idx\` ON \`_action_cards_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_action_cards_v_latest_idx\` ON \`_action_cards_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_action_cards_v_locales\` (
  	\`version_title\` text,
  	\`version_topic\` text,
  	\`version_tag\` text,
  	\`version_body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_action_cards_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_action_cards_v_locales_locale_parent_id_unique\` ON \`_action_cards_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_action_cards\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`slug\` text,
  	\`link\` text,
  	\`image_id\` integer,
  	\`display_to_all_users\` integer,
  	\`publish_date\` text,
  	\`end_date\` text,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 999,
  	\`author\` text,
  	\`review_status\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_action_cards\`("id", "_order", "slug", "link", "image_id", "display_to_all_users", "publish_date", "end_date", "schedule", "limmit", "author", "review_status", "updated_at", "created_at", "_status") SELECT "id", "_order", "slug", "link", "image_id", "display_to_all_users", "publish_date", "end_date", "schedule", "limmit", "author", "review_status", "updated_at", "created_at", "_status" FROM \`action_cards\`;`)
  await db.run(sql`DROP TABLE \`action_cards\`;`)
  await db.run(sql`ALTER TABLE \`__new_action_cards\` RENAME TO \`action_cards\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`action_cards__order_idx\` ON \`action_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`action_cards_image_idx\` ON \`action_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`action_cards_updated_at_idx\` ON \`action_cards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`action_cards_created_at_idx\` ON \`action_cards\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`action_cards__status_idx\` ON \`action_cards\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_action_cards_locales\` (
  	\`title\` text,
  	\`topic\` text,
  	\`tag\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`action_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_action_cards_locales\`("title", "topic", "tag", "body", "id", "_locale", "_parent_id") SELECT "title", "topic", "tag", "body", "id", "_locale", "_parent_id" FROM \`action_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`action_cards_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_action_cards_locales\` RENAME TO \`action_cards_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`action_cards_locales_locale_parent_id_unique\` ON \`action_cards_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_action_cards_v_version_valid_months\`;`)
  await db.run(sql`DROP TABLE \`_action_cards_v\`;`)
  await db.run(sql`DROP TABLE \`_action_cards_v_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_action_cards\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`link\` text,
  	\`image_id\` integer,
  	\`display_to_all_users\` integer,
  	\`publish_date\` text,
  	\`end_date\` text,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 999,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_action_cards\`("id", "slug", "link", "image_id", "display_to_all_users", "publish_date", "end_date", "schedule", "limmit", "updated_at", "created_at") SELECT "id", "slug", "link", "image_id", "display_to_all_users", "publish_date", "end_date", "schedule", "limmit", "updated_at", "created_at" FROM \`action_cards\`;`)
  await db.run(sql`DROP TABLE \`action_cards\`;`)
  await db.run(sql`ALTER TABLE \`__new_action_cards\` RENAME TO \`action_cards\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`action_cards_image_idx\` ON \`action_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`action_cards_updated_at_idx\` ON \`action_cards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`action_cards_created_at_idx\` ON \`action_cards\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_action_cards_locales\` (
  	\`title\` text NOT NULL,
  	\`topic\` text NOT NULL,
  	\`tag\` text NOT NULL,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`action_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_action_cards_locales\`("title", "topic", "tag", "body", "id", "_locale", "_parent_id") SELECT "title", "topic", "tag", "body", "id", "_locale", "_parent_id" FROM \`action_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`action_cards_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_action_cards_locales\` RENAME TO \`action_cards_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`action_cards_locales_locale_parent_id_unique\` ON \`action_cards_locales\` (\`_locale\`,\`_parent_id\`);`)
}
