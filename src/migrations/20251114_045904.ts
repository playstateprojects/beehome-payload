import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_reviews\` RENAME TO \`space_actions\`;`)
  await db.run(sql`ALTER TABLE \`space_reviews_locales\` RENAME TO \`space_actions_locales\`;`)
  await db.run(sql`ALTER TABLE \`space_reviews_rels\` RENAME TO \`space_actions_rels\`;`)
  await db.run(sql`DROP INDEX \`space_reviews_slug_idx\`;`)
  await db.run(sql`DROP INDEX \`space_reviews_updated_at_idx\`;`)
  await db.run(sql`DROP INDEX \`space_reviews_created_at_idx\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_actions_slug_idx\` ON \`space_actions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_updated_at_idx\` ON \`space_actions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_created_at_idx\` ON \`space_actions\` (\`created_at\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_space_actions_locales\` (
  	\`label\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`space_actions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_space_actions_locales\`("label", "description", "id", "_locale", "_parent_id") SELECT "label", "description", "id", "_locale", "_parent_id" FROM \`space_actions_locales\`;`)
  await db.run(sql`DROP TABLE \`space_actions_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_space_actions_locales\` RENAME TO \`space_actions_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_actions_locales_locale_parent_id_unique\` ON \`space_actions_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_space_actions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`space_types_id\` integer,
  	\`commitments_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`space_actions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_types_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`commitments_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_space_actions_rels\`("id", "order", "parent_id", "path", "space_types_id", "commitments_id") SELECT "id", "order", "parent_id", "path", "space_types_id", "commitments_id" FROM \`space_actions_rels\`;`)
  await db.run(sql`DROP TABLE \`space_actions_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_space_actions_rels\` RENAME TO \`space_actions_rels\`;`)
  await db.run(sql`CREATE INDEX \`space_actions_rels_order_idx\` ON \`space_actions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_rels_parent_idx\` ON \`space_actions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_rels_path_idx\` ON \`space_actions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_rels_space_types_id_idx\` ON \`space_actions_rels\` (\`space_types_id\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_rels_commitments_id_idx\` ON \`space_actions_rels\` (\`commitments_id\`);`)
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
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_actions\` RENAME TO \`space_reviews\`;`)
  await db.run(sql`ALTER TABLE \`space_actions_locales\` RENAME TO \`space_reviews_locales\`;`)
  await db.run(sql`ALTER TABLE \`space_actions_rels\` RENAME TO \`space_reviews_rels\`;`)
  await db.run(sql`DROP INDEX \`space_actions_slug_idx\`;`)
  await db.run(sql`DROP INDEX \`space_actions_updated_at_idx\`;`)
  await db.run(sql`DROP INDEX \`space_actions_created_at_idx\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_reviews_slug_idx\` ON \`space_reviews\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`space_reviews_updated_at_idx\` ON \`space_reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`space_reviews_created_at_idx\` ON \`space_reviews\` (\`created_at\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_space_reviews_locales\` (
  	\`label\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`space_reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_space_reviews_locales\`("label", "description", "id", "_locale", "_parent_id") SELECT "label", "description", "id", "_locale", "_parent_id" FROM \`space_reviews_locales\`;`)
  await db.run(sql`DROP TABLE \`space_reviews_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_space_reviews_locales\` RENAME TO \`space_reviews_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_reviews_locales_locale_parent_id_unique\` ON \`space_reviews_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_space_reviews_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`space_types_id\` integer,
  	\`commitments_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`space_reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_types_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`commitments_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_space_reviews_rels\`("id", "order", "parent_id", "path", "space_types_id", "commitments_id") SELECT "id", "order", "parent_id", "path", "space_types_id", "commitments_id" FROM \`space_reviews_rels\`;`)
  await db.run(sql`DROP TABLE \`space_reviews_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_space_reviews_rels\` RENAME TO \`space_reviews_rels\`;`)
  await db.run(sql`CREATE INDEX \`space_reviews_rels_order_idx\` ON \`space_reviews_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`space_reviews_rels_parent_idx\` ON \`space_reviews_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`space_reviews_rels_path_idx\` ON \`space_reviews_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`space_reviews_rels_space_types_id_idx\` ON \`space_reviews_rels\` (\`space_types_id\`);`)
  await db.run(sql`CREATE INDEX \`space_reviews_rels_commitments_id_idx\` ON \`space_reviews_rels\` (\`commitments_id\`);`)
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
  	\`space_reviews_id\` integer,
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
  	FOREIGN KEY (\`space_reviews_id\`) REFERENCES \`space_reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`push_notifications_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_types_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`commitments_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "articles_id", "in_app_notifications_id", "action_cards_id", "questionnaire_id", "badges_id", "space_reviews_id", "push_notifications_id", "space_types_id", "commitments_id", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "articles_id", "in_app_notifications_id", "action_cards_id", "questionnaire_id", "badges_id", "space_reviews_id", "push_notifications_id", "space_types_id", "commitments_id", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_in_app_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`in_app_notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_action_cards_id_idx\` ON \`payload_locked_documents_rels\` (\`action_cards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_questionnaire_id_idx\` ON \`payload_locked_documents_rels\` (\`questionnaire_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_badges_id_idx\` ON \`payload_locked_documents_rels\` (\`badges_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_space_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`space_reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_push_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`push_notifications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_space_types_id_idx\` ON \`payload_locked_documents_rels\` (\`space_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_commitments_id_idx\` ON \`payload_locked_documents_rels\` (\`commitments_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
}
