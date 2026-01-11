import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`bee_info_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_image_id\` integer,
  	FOREIGN KEY (\`section_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`bee_info\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`bee_info_sections_order_idx\` ON \`bee_info_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`bee_info_sections_parent_id_idx\` ON \`bee_info_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`bee_info_sections_section_image_idx\` ON \`bee_info_sections\` (\`section_image_id\`);`)
  await db.run(sql`CREATE TABLE \`bee_info_sections_locales\` (
  	\`section_title\` text,
  	\`section_body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`bee_info_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`bee_info_sections_locales_locale_parent_id_unique\` ON \`bee_info_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`bee_info\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`scientific_name\` text,
  	\`hero_image_id\` integer,
  	\`status\` text,
  	\`publish_date\` text,
  	\`author\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`bee_info_slug_idx\` ON \`bee_info\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`bee_info_hero_image_idx\` ON \`bee_info\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`bee_info_updated_at_idx\` ON \`bee_info\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`bee_info_created_at_idx\` ON \`bee_info\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`bee_info__status_idx\` ON \`bee_info\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`bee_info_locales\` (
  	\`species_name\` text,
  	\`common_tagline\` text,
  	\`size\` text,
  	\`flight_time\` text,
  	\`distribution\` text,
  	\`habitat\` text,
  	\`special_trait\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`bee_info\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`bee_info_locales_locale_parent_id_unique\` ON \`bee_info_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`bee_info_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`articles_id\` integer,
  	\`bee_info_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`bee_info\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bee_info_id\`) REFERENCES \`bee_info\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`bee_info_rels_order_idx\` ON \`bee_info_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`bee_info_rels_parent_idx\` ON \`bee_info_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`bee_info_rels_path_idx\` ON \`bee_info_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`bee_info_rels_articles_id_idx\` ON \`bee_info_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`bee_info_rels_bee_info_id_idx\` ON \`bee_info_rels\` (\`bee_info_id\`);`)
  await db.run(sql`CREATE TABLE \`_bee_info_v_version_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`section_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_bee_info_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_bee_info_v_version_sections_order_idx\` ON \`_bee_info_v_version_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_version_sections_parent_id_idx\` ON \`_bee_info_v_version_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_version_sections_section_image_idx\` ON \`_bee_info_v_version_sections\` (\`section_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_bee_info_v_version_sections_locales\` (
  	\`section_title\` text,
  	\`section_body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_bee_info_v_version_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_bee_info_v_version_sections_locales_locale_parent_id_unique\` ON \`_bee_info_v_version_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_bee_info_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_scientific_name\` text,
  	\`version_hero_image_id\` integer,
  	\`version_status\` text,
  	\`version_publish_date\` text,
  	\`version_author\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`bee_info\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_bee_info_v_parent_idx\` ON \`_bee_info_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_version_version_slug_idx\` ON \`_bee_info_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_version_version_hero_image_idx\` ON \`_bee_info_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_version_version_updated_at_idx\` ON \`_bee_info_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_version_version_created_at_idx\` ON \`_bee_info_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_version_version__status_idx\` ON \`_bee_info_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_created_at_idx\` ON \`_bee_info_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_updated_at_idx\` ON \`_bee_info_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_snapshot_idx\` ON \`_bee_info_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_published_locale_idx\` ON \`_bee_info_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_latest_idx\` ON \`_bee_info_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_bee_info_v_locales\` (
  	\`version_species_name\` text,
  	\`version_common_tagline\` text,
  	\`version_size\` text,
  	\`version_flight_time\` text,
  	\`version_distribution\` text,
  	\`version_habitat\` text,
  	\`version_special_trait\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_bee_info_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_bee_info_v_locales_locale_parent_id_unique\` ON \`_bee_info_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_bee_info_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`articles_id\` integer,
  	\`bee_info_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_bee_info_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bee_info_id\`) REFERENCES \`bee_info\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_bee_info_v_rels_order_idx\` ON \`_bee_info_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_rels_parent_idx\` ON \`_bee_info_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_rels_path_idx\` ON \`_bee_info_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_rels_articles_id_idx\` ON \`_bee_info_v_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`_bee_info_v_rels_bee_info_id_idx\` ON \`_bee_info_v_rels\` (\`bee_info_id\`);`)
  await db.run(sql`ALTER TABLE \`space_actions\` ADD \`_order\` text;`)
  await db.run(sql`ALTER TABLE \`space_actions\` ADD \`link\` text;`)
  await db.run(sql`CREATE INDEX \`space_actions__order_idx\` ON \`space_actions\` (\`_order\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`bee_info_id\` integer REFERENCES bee_info(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bee_info_id_idx\` ON \`payload_locked_documents_rels\` (\`bee_info_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`bee_info_sections\`;`)
  await db.run(sql`DROP TABLE \`bee_info_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`bee_info\`;`)
  await db.run(sql`DROP TABLE \`bee_info_locales\`;`)
  await db.run(sql`DROP TABLE \`bee_info_rels\`;`)
  await db.run(sql`DROP TABLE \`_bee_info_v_version_sections\`;`)
  await db.run(sql`DROP TABLE \`_bee_info_v_version_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`_bee_info_v\`;`)
  await db.run(sql`DROP TABLE \`_bee_info_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_bee_info_v_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`articles_id\` integer,
  	\`in_app_notifications_id\` integer,
  	\`action_cards_id\` integer,
  	\`questionnaire_id\` integer,
  	\`badges_id\` integer,
  	\`space_actions_id\` integer,
  	\`push_notifications_id\` integer,
  	\`space_types_id\` integer,
  	\`commitments_id\` integer,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`in_app_notifications_id\`) REFERENCES \`in_app_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`action_cards_id\`) REFERENCES \`action_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`questionnaire_id\`) REFERENCES \`questionnaire\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`badges_id\`) REFERENCES \`badges\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_actions_id\`) REFERENCES \`space_actions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`push_notifications_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_types_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`commitments_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "articles_id", "in_app_notifications_id", "action_cards_id", "questionnaire_id", "badges_id", "space_actions_id", "push_notifications_id", "space_types_id", "commitments_id", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "articles_id", "in_app_notifications_id", "action_cards_id", "questionnaire_id", "badges_id", "space_actions_id", "push_notifications_id", "space_types_id", "commitments_id", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_in_app_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`in_app_notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_action_cards_id_idx\` ON \`payload_locked_documents_rels\` (\`action_cards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_questionnaire_id_idx\` ON \`payload_locked_documents_rels\` (\`questionnaire_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_badges_id_idx\` ON \`payload_locked_documents_rels\` (\`badges_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_space_actions_id_idx\` ON \`payload_locked_documents_rels\` (\`space_actions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_push_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`push_notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_space_types_id_idx\` ON \`payload_locked_documents_rels\` (\`space_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_commitments_id_idx\` ON \`payload_locked_documents_rels\` (\`commitments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`DROP INDEX \`space_actions__order_idx\`;`)
  await db.run(sql`ALTER TABLE \`space_actions\` DROP COLUMN \`_order\`;`)
  await db.run(sql`ALTER TABLE \`space_actions\` DROP COLUMN \`link\`;`)
}
