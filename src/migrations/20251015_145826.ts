import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`checklist_option_groups_options\` RENAME TO \`questionnaire_option_groups_options\`;`)
  await db.run(sql`ALTER TABLE \`checklist_option_groups_options_locales\` RENAME TO \`questionnaire_option_groups_options_locales\`;`)
  await db.run(sql`ALTER TABLE \`checklist_option_groups\` RENAME TO \`questionnaire_option_groups\`;`)
  await db.run(sql`ALTER TABLE \`checklist_option_groups_locales\` RENAME TO \`questionnaire_option_groups_locales\`;`)
  await db.run(sql`ALTER TABLE \`checklist_end_screens\` RENAME TO \`questionnaire_end_screens\`;`)
  await db.run(sql`ALTER TABLE \`checklist_end_screens_locales\` RENAME TO \`questionnaire_end_screens_locales\`;`)
  await db.run(sql`ALTER TABLE \`checklist\` RENAME TO \`questionnaire\`;`)
  await db.run(sql`ALTER TABLE \`checklist_locales\` RENAME TO \`questionnaire_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_option_groups_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'checkbox' NOT NULL,
  	\`uuid\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire_option_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_option_groups_options\`("_order", "_parent_id", "id", "type", "uuid") SELECT "_order", "_parent_id", "id", "type", "uuid" FROM \`questionnaire_option_groups_options\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_option_groups_options\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_option_groups_options\` RENAME TO \`questionnaire_option_groups_options\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`questionnaire_option_groups_options_order_idx\` ON \`questionnaire_option_groups_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`questionnaire_option_groups_options_parent_id_idx\` ON \`questionnaire_option_groups_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_option_groups_options_locales\` (
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire_option_groups_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_option_groups_options_locales\`("description", "id", "_locale", "_parent_id") SELECT "description", "id", "_locale", "_parent_id" FROM \`questionnaire_option_groups_options_locales\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_option_groups_options_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_option_groups_options_locales\` RENAME TO \`questionnaire_option_groups_options_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`questionnaire_option_groups_options_locales_locale_parent_id_unique\` ON \`questionnaire_option_groups_options_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_option_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_option_groups\`("_order", "_parent_id", "id") SELECT "_order", "_parent_id", "id" FROM \`questionnaire_option_groups\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_option_groups\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_option_groups\` RENAME TO \`questionnaire_option_groups\`;`)
  await db.run(sql`CREATE INDEX \`questionnaire_option_groups_order_idx\` ON \`questionnaire_option_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`questionnaire_option_groups_parent_id_idx\` ON \`questionnaire_option_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_option_groups_locales\` (
  	\`title\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire_option_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_option_groups_locales\`("title", "description", "id", "_locale", "_parent_id") SELECT "title", "description", "id", "_locale", "_parent_id" FROM \`questionnaire_option_groups_locales\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_option_groups_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_option_groups_locales\` RENAME TO \`questionnaire_option_groups_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`questionnaire_option_groups_locales_locale_parent_id_unique\` ON \`questionnaire_option_groups_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_end_screens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`uuid\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_end_screens\`("_order", "_parent_id", "id", "image_id", "uuid") SELECT "_order", "_parent_id", "id", "image_id", "uuid" FROM \`questionnaire_end_screens\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_end_screens\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_end_screens\` RENAME TO \`questionnaire_end_screens\`;`)
  await db.run(sql`CREATE INDEX \`questionnaire_end_screens_order_idx\` ON \`questionnaire_end_screens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`questionnaire_end_screens_parent_id_idx\` ON \`questionnaire_end_screens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`questionnaire_end_screens_image_idx\` ON \`questionnaire_end_screens\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_end_screens_locales\` (
  	\`title\` text NOT NULL,
  	\`action_button\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire_end_screens\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_end_screens_locales\`("title", "action_button", "body", "id", "_locale", "_parent_id") SELECT "title", "action_button", "body", "id", "_locale", "_parent_id" FROM \`questionnaire_end_screens_locales\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_end_screens_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_end_screens_locales\` RENAME TO \`questionnaire_end_screens_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`questionnaire_end_screens_locales_locale_parent_id_unique\` ON \`questionnaire_end_screens_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`DROP INDEX \`checklist_slug_idx\`;`)
  await db.run(sql`DROP INDEX \`checklist_updated_at_idx\`;`)
  await db.run(sql`DROP INDEX \`checklist_created_at_idx\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`questionnaire_slug_idx\` ON \`questionnaire\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`questionnaire_updated_at_idx\` ON \`questionnaire\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`questionnaire_created_at_idx\` ON \`questionnaire\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_locales\`("title", "description", "id", "_locale", "_parent_id") SELECT "title", "description", "id", "_locale", "_parent_id" FROM \`questionnaire_locales\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_locales\` RENAME TO \`questionnaire_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`questionnaire_locales_locale_parent_id_unique\` ON \`questionnaire_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`push_notifications_id\` integer,
  	\`space_types_id\` integer,
  	\`commitments_id\` integer,
  	\`articles_id\` integer,
  	\`in_app_notifications_id\` integer,
  	\`action_cards_id\` integer,
  	\`questionnaire_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`push_notifications_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_types_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`commitments_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`in_app_notifications_id\`) REFERENCES \`in_app_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`action_cards_id\`) REFERENCES \`action_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`questionnaire_id\`) REFERENCES \`questionnaire\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "push_notifications_id", "space_types_id", "commitments_id", "articles_id", "in_app_notifications_id", "action_cards_id", "questionnaire_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "push_notifications_id", "space_types_id", "commitments_id", "articles_id", "in_app_notifications_id", "action_cards_id", "questionnaire_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_push_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`push_notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_space_types_id_idx\` ON \`payload_locked_documents_rels\` (\`space_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_commitments_id_idx\` ON \`payload_locked_documents_rels\` (\`commitments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_in_app_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`in_app_notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_action_cards_id_idx\` ON \`payload_locked_documents_rels\` (\`action_cards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_questionnaire_id_idx\` ON \`payload_locked_documents_rels\` (\`questionnaire_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`questionnaire_option_groups_options\` RENAME TO \`checklist_option_groups_options\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_option_groups_options_locales\` RENAME TO \`checklist_option_groups_options_locales\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_option_groups\` RENAME TO \`checklist_option_groups\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_option_groups_locales\` RENAME TO \`checklist_option_groups_locales\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_end_screens\` RENAME TO \`checklist_end_screens\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_end_screens_locales\` RENAME TO \`checklist_end_screens_locales\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire\` RENAME TO \`checklist\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_locales\` RENAME TO \`checklist_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_checklist_option_groups_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'checkbox' NOT NULL,
  	\`uuid\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`checklist_option_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_checklist_option_groups_options\`("_order", "_parent_id", "id", "type", "uuid") SELECT "_order", "_parent_id", "id", "type", "uuid" FROM \`checklist_option_groups_options\`;`)
  await db.run(sql`DROP TABLE \`checklist_option_groups_options\`;`)
  await db.run(sql`ALTER TABLE \`__new_checklist_option_groups_options\` RENAME TO \`checklist_option_groups_options\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`checklist_option_groups_options_order_idx\` ON \`checklist_option_groups_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`checklist_option_groups_options_parent_id_idx\` ON \`checklist_option_groups_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_checklist_option_groups_options_locales\` (
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`checklist_option_groups_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_checklist_option_groups_options_locales\`("description", "id", "_locale", "_parent_id") SELECT "description", "id", "_locale", "_parent_id" FROM \`checklist_option_groups_options_locales\`;`)
  await db.run(sql`DROP TABLE \`checklist_option_groups_options_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_checklist_option_groups_options_locales\` RENAME TO \`checklist_option_groups_options_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`checklist_option_groups_options_locales_locale_parent_id_unique\` ON \`checklist_option_groups_options_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_checklist_option_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`checklist\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_checklist_option_groups\`("_order", "_parent_id", "id") SELECT "_order", "_parent_id", "id" FROM \`checklist_option_groups\`;`)
  await db.run(sql`DROP TABLE \`checklist_option_groups\`;`)
  await db.run(sql`ALTER TABLE \`__new_checklist_option_groups\` RENAME TO \`checklist_option_groups\`;`)
  await db.run(sql`CREATE INDEX \`checklist_option_groups_order_idx\` ON \`checklist_option_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`checklist_option_groups_parent_id_idx\` ON \`checklist_option_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_checklist_option_groups_locales\` (
  	\`title\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`checklist_option_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_checklist_option_groups_locales\`("title", "description", "id", "_locale", "_parent_id") SELECT "title", "description", "id", "_locale", "_parent_id" FROM \`checklist_option_groups_locales\`;`)
  await db.run(sql`DROP TABLE \`checklist_option_groups_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_checklist_option_groups_locales\` RENAME TO \`checklist_option_groups_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`checklist_option_groups_locales_locale_parent_id_unique\` ON \`checklist_option_groups_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_checklist_end_screens\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`uuid\` text NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`checklist\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_checklist_end_screens\`("_order", "_parent_id", "id", "image_id", "uuid") SELECT "_order", "_parent_id", "id", "image_id", "uuid" FROM \`checklist_end_screens\`;`)
  await db.run(sql`DROP TABLE \`checklist_end_screens\`;`)
  await db.run(sql`ALTER TABLE \`__new_checklist_end_screens\` RENAME TO \`checklist_end_screens\`;`)
  await db.run(sql`CREATE INDEX \`checklist_end_screens_order_idx\` ON \`checklist_end_screens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`checklist_end_screens_parent_id_idx\` ON \`checklist_end_screens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`checklist_end_screens_image_idx\` ON \`checklist_end_screens\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_checklist_end_screens_locales\` (
  	\`title\` text NOT NULL,
  	\`action_button\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`checklist_end_screens\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_checklist_end_screens_locales\`("title", "action_button", "body", "id", "_locale", "_parent_id") SELECT "title", "action_button", "body", "id", "_locale", "_parent_id" FROM \`checklist_end_screens_locales\`;`)
  await db.run(sql`DROP TABLE \`checklist_end_screens_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_checklist_end_screens_locales\` RENAME TO \`checklist_end_screens_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`checklist_end_screens_locales_locale_parent_id_unique\` ON \`checklist_end_screens_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`DROP INDEX \`questionnaire_slug_idx\`;`)
  await db.run(sql`DROP INDEX \`questionnaire_updated_at_idx\`;`)
  await db.run(sql`DROP INDEX \`questionnaire_created_at_idx\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`checklist_slug_idx\` ON \`checklist\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`checklist_updated_at_idx\` ON \`checklist\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`checklist_created_at_idx\` ON \`checklist\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_checklist_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`checklist\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_checklist_locales\`("title", "description", "id", "_locale", "_parent_id") SELECT "title", "description", "id", "_locale", "_parent_id" FROM \`checklist_locales\`;`)
  await db.run(sql`DROP TABLE \`checklist_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_checklist_locales\` RENAME TO \`checklist_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`checklist_locales_locale_parent_id_unique\` ON \`checklist_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`push_notifications_id\` integer,
  	\`space_types_id\` integer,
  	\`commitments_id\` integer,
  	\`articles_id\` integer,
  	\`in_app_notifications_id\` integer,
  	\`action_cards_id\` integer,
  	\`checklist_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`push_notifications_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_types_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`commitments_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`in_app_notifications_id\`) REFERENCES \`in_app_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`action_cards_id\`) REFERENCES \`action_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`checklist_id\`) REFERENCES \`checklist\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "push_notifications_id", "space_types_id", "commitments_id", "articles_id", "in_app_notifications_id", "action_cards_id", "checklist_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "push_notifications_id", "space_types_id", "commitments_id", "articles_id", "in_app_notifications_id", "action_cards_id", "checklist_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_push_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`push_notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_space_types_id_idx\` ON \`payload_locked_documents_rels\` (\`space_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_commitments_id_idx\` ON \`payload_locked_documents_rels\` (\`commitments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_in_app_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`in_app_notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_action_cards_id_idx\` ON \`payload_locked_documents_rels\` (\`action_cards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_checklist_id_idx\` ON \`payload_locked_documents_rels\` (\`checklist_id\`);`)
}
