import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`space_progress_levels_requirements_category_requirements\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`parent_slug\` text NOT NULL,
  	\`required\` numeric DEFAULT 1 NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`space_progress_levels\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`space_progress_levels_requirements_category_requirements_order_idx\` ON \`space_progress_levels_requirements_category_requirements\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`space_progress_levels_requirements_category_requirements_parent_id_idx\` ON \`space_progress_levels_requirements_category_requirements\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`space_progress_levels\` (
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`order\` numeric NOT NULL,
  	\`color\` text NOT NULL,
  	\`name_en\` text NOT NULL,
  	\`name_de\` text NOT NULL,
  	\`description_en\` text NOT NULL,
  	\`description_de\` text NOT NULL,
  	\`action_button_link\` text,
  	\`requirements_min_active_categories\` numeric DEFAULT 0 NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`space_progress_levels__order_idx\` ON \`space_progress_levels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`space_progress_levels_updated_at_idx\` ON \`space_progress_levels\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`space_progress_levels_created_at_idx\` ON \`space_progress_levels\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`space_progress_levels_locales\` (
  	\`action_button_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`space_progress_levels\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`space_progress_levels_locales_locale_parent_id_unique\` ON \`space_progress_levels_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`space_progress_levels_id\` text REFERENCES space_progress_levels(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_space_progress_levels_id_idx\` ON \`payload_locked_documents_rels\` (\`space_progress_levels_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`space_progress_levels_requirements_category_requirements\`;`)
  await db.run(sql`DROP TABLE \`space_progress_levels\`;`)
  await db.run(sql`DROP TABLE \`space_progress_levels_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`articles_id\` integer,
  	\`bee_info_id\` integer,
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
  	FOREIGN KEY (\`bee_info_id\`) REFERENCES \`bee_info\`(\`id\`) ON UPDATE no action ON DELETE cascade,
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "articles_id", "bee_info_id", "in_app_notifications_id", "action_cards_id", "questionnaire_id", "badges_id", "space_actions_id", "push_notifications_id", "space_types_id", "commitments_id", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "articles_id", "bee_info_id", "in_app_notifications_id", "action_cards_id", "questionnaire_id", "badges_id", "space_actions_id", "push_notifications_id", "space_types_id", "commitments_id", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bee_info_id_idx\` ON \`payload_locked_documents_rels\` (\`bee_info_id\`);`)
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
