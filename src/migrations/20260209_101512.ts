import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_in_app_notifications_v_version_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_in_app_notifications_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_version_valid_months_order_idx\` ON \`_in_app_notifications_v_version_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_version_valid_months_parent_idx\` ON \`_in_app_notifications_v_version_valid_months\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_in_app_notifications_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_image_id\` integer,
  	\`version_condition_notes\` text,
  	\`version_publish_date\` text,
  	\`version_end_date\` text,
  	\`version_all_users\` integer,
  	\`version_schedule\` numeric DEFAULT 365,
  	\`version_limmit\` numeric DEFAULT 999,
  	\`version_key\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`in_app_notifications\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_parent_idx\` ON \`_in_app_notifications_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_version_version_image_idx\` ON \`_in_app_notifications_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_version_version_updated_at_idx\` ON \`_in_app_notifications_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_version_version_created_at_idx\` ON \`_in_app_notifications_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_version_version__status_idx\` ON \`_in_app_notifications_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_created_at_idx\` ON \`_in_app_notifications_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_updated_at_idx\` ON \`_in_app_notifications_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_snapshot_idx\` ON \`_in_app_notifications_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_published_locale_idx\` ON \`_in_app_notifications_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_latest_idx\` ON \`_in_app_notifications_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_in_app_notifications_v_locales\` (
  	\`version_title\` text,
  	\`version_message\` text,
  	\`version_action_button_text\` text DEFAULT 'OK',
  	\`version_action_button_link\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_in_app_notifications_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_in_app_notifications_v_locales_locale_parent_id_unique\` ON \`_in_app_notifications_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_in_app_notifications_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_in_app_notifications_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_in_app_notifications_v_texts_order_parent\` ON \`_in_app_notifications_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_push_notifications_v_version_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_push_notifications_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_version_valid_months_order_idx\` ON \`_push_notifications_v_version_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_version_valid_months_parent_idx\` ON \`_push_notifications_v_version_valid_months\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_push_notifications_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_deep_link\` text,
  	\`version_image_id\` integer,
  	\`version_condition_notes\` text,
  	\`version_publish_date\` text,
  	\`version_all_users\` integer,
  	\`version_schedule\` numeric DEFAULT 365,
  	\`version_limmit\` numeric DEFAULT 1,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_parent_idx\` ON \`_push_notifications_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_version_version_image_idx\` ON \`_push_notifications_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_version_version_updated_at_idx\` ON \`_push_notifications_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_version_version_created_at_idx\` ON \`_push_notifications_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_version_version__status_idx\` ON \`_push_notifications_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_created_at_idx\` ON \`_push_notifications_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_updated_at_idx\` ON \`_push_notifications_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_snapshot_idx\` ON \`_push_notifications_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_published_locale_idx\` ON \`_push_notifications_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_latest_idx\` ON \`_push_notifications_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_push_notifications_v_locales\` (
  	\`version_title\` text,
  	\`version_message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_push_notifications_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_push_notifications_v_locales_locale_parent_id_unique\` ON \`_push_notifications_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_push_notifications_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_push_notifications_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_push_notifications_v_texts_order_parent\` ON \`_push_notifications_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_in_app_notifications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`condition_notes\` text,
  	\`publish_date\` text,
  	\`end_date\` text,
  	\`all_users\` integer,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 999,
  	\`key\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_in_app_notifications\`("id", "image_id", "condition_notes", "publish_date", "end_date", "all_users", "schedule", "limmit", "key", "updated_at", "created_at", "_status") SELECT "id", "image_id", "condition_notes", "publish_date", "end_date", "all_users", "schedule", "limmit", "key", "updated_at", "created_at", "_status" FROM \`in_app_notifications\`;`)
  await db.run(sql`DROP TABLE \`in_app_notifications\`;`)
  await db.run(sql`ALTER TABLE \`__new_in_app_notifications\` RENAME TO \`in_app_notifications\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`in_app_notifications_image_idx\` ON \`in_app_notifications\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`in_app_notifications_updated_at_idx\` ON \`in_app_notifications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`in_app_notifications_created_at_idx\` ON \`in_app_notifications\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`in_app_notifications__status_idx\` ON \`in_app_notifications\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_in_app_notifications_locales\` (
  	\`title\` text,
  	\`message\` text,
  	\`action_button_text\` text DEFAULT 'OK',
  	\`action_button_link\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`in_app_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_in_app_notifications_locales\`("title", "message", "action_button_text", "action_button_link", "id", "_locale", "_parent_id") SELECT "title", "message", "action_button_text", "action_button_link", "id", "_locale", "_parent_id" FROM \`in_app_notifications_locales\`;`)
  await db.run(sql`DROP TABLE \`in_app_notifications_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_in_app_notifications_locales\` RENAME TO \`in_app_notifications_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`in_app_notifications_locales_locale_parent_id_unique\` ON \`in_app_notifications_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_push_notifications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`deep_link\` text,
  	\`image_id\` integer,
  	\`condition_notes\` text,
  	\`publish_date\` text,
  	\`all_users\` integer,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 1,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_push_notifications\`("id", "deep_link", "image_id", "condition_notes", "publish_date", "all_users", "schedule", "limmit", "slug", "updated_at", "created_at", "_status") SELECT "id", "deep_link", "image_id", "condition_notes", "publish_date", "all_users", "schedule", "limmit", "slug", "updated_at", "created_at", "_status" FROM \`push_notifications\`;`)
  await db.run(sql`DROP TABLE \`push_notifications\`;`)
  await db.run(sql`ALTER TABLE \`__new_push_notifications\` RENAME TO \`push_notifications\`;`)
  await db.run(sql`CREATE INDEX \`push_notifications_image_idx\` ON \`push_notifications\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications_updated_at_idx\` ON \`push_notifications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications_created_at_idx\` ON \`push_notifications\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications__status_idx\` ON \`push_notifications\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_push_notifications_locales\` (
  	\`title\` text,
  	\`message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_push_notifications_locales\`("title", "message", "id", "_locale", "_parent_id") SELECT "title", "message", "id", "_locale", "_parent_id" FROM \`push_notifications_locales\`;`)
  await db.run(sql`DROP TABLE \`push_notifications_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_push_notifications_locales\` RENAME TO \`push_notifications_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`push_notifications_locales_locale_parent_id_unique\` ON \`push_notifications_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_in_app_notifications_v_version_valid_months\`;`)
  await db.run(sql`DROP TABLE \`_in_app_notifications_v\`;`)
  await db.run(sql`DROP TABLE \`_in_app_notifications_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_in_app_notifications_v_texts\`;`)
  await db.run(sql`DROP TABLE \`_push_notifications_v_version_valid_months\`;`)
  await db.run(sql`DROP TABLE \`_push_notifications_v\`;`)
  await db.run(sql`DROP TABLE \`_push_notifications_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_push_notifications_v_texts\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_in_app_notifications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`condition_notes\` text,
  	\`publish_date\` text,
  	\`end_date\` text,
  	\`all_users\` integer,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 999,
  	\`key\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_in_app_notifications\`("id", "image_id", "condition_notes", "publish_date", "end_date", "all_users", "schedule", "limmit", "key", "updated_at", "created_at") SELECT "id", "image_id", "condition_notes", "publish_date", "end_date", "all_users", "schedule", "limmit", "key", "updated_at", "created_at" FROM \`in_app_notifications\`;`)
  await db.run(sql`DROP TABLE \`in_app_notifications\`;`)
  await db.run(sql`ALTER TABLE \`__new_in_app_notifications\` RENAME TO \`in_app_notifications\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`in_app_notifications_image_idx\` ON \`in_app_notifications\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`in_app_notifications_updated_at_idx\` ON \`in_app_notifications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`in_app_notifications_created_at_idx\` ON \`in_app_notifications\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_push_notifications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`deep_link\` text,
  	\`image_id\` integer,
  	\`condition_notes\` text,
  	\`publish_date\` text,
  	\`all_users\` integer,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 1,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_push_notifications\`("id", "deep_link", "image_id", "condition_notes", "publish_date", "all_users", "schedule", "limmit", "slug", "updated_at", "created_at") SELECT "id", "deep_link", "image_id", "condition_notes", "publish_date", "all_users", "schedule", "limmit", "slug", "updated_at", "created_at" FROM \`push_notifications\`;`)
  await db.run(sql`DROP TABLE \`push_notifications\`;`)
  await db.run(sql`ALTER TABLE \`__new_push_notifications\` RENAME TO \`push_notifications\`;`)
  await db.run(sql`CREATE INDEX \`push_notifications_image_idx\` ON \`push_notifications\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications_updated_at_idx\` ON \`push_notifications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications_created_at_idx\` ON \`push_notifications\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_in_app_notifications_locales\` (
  	\`title\` text NOT NULL,
  	\`message\` text NOT NULL,
  	\`action_button_text\` text DEFAULT 'OK',
  	\`action_button_link\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`in_app_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_in_app_notifications_locales\`("title", "message", "action_button_text", "action_button_link", "id", "_locale", "_parent_id") SELECT "title", "message", "action_button_text", "action_button_link", "id", "_locale", "_parent_id" FROM \`in_app_notifications_locales\`;`)
  await db.run(sql`DROP TABLE \`in_app_notifications_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_in_app_notifications_locales\` RENAME TO \`in_app_notifications_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`in_app_notifications_locales_locale_parent_id_unique\` ON \`in_app_notifications_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_push_notifications_locales\` (
  	\`title\` text NOT NULL,
  	\`message\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_push_notifications_locales\`("title", "message", "id", "_locale", "_parent_id") SELECT "title", "message", "id", "_locale", "_parent_id" FROM \`push_notifications_locales\`;`)
  await db.run(sql`DROP TABLE \`push_notifications_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_push_notifications_locales\` RENAME TO \`push_notifications_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`push_notifications_locales_locale_parent_id_unique\` ON \`push_notifications_locales\` (\`_locale\`,\`_parent_id\`);`)
}
