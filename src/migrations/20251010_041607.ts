import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`push_notifications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`push_notifications_updated_at_idx\` ON \`push_notifications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`push_notifications_created_at_idx\` ON \`push_notifications\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`push_notifications_locales\` (
  	\`name\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`push_notifications_locales_locale_parent_id_unique\` ON \`push_notifications_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`space_types\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`stable_id\` text,
  	\`key\` text NOT NULL,
  	\`sort\` numeric DEFAULT 0,
  	\`active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`space_types_stable_id_idx\` ON \`space_types\` (\`stable_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`space_types_key_idx\` ON \`space_types\` (\`key\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`space_types_updated_at_idx\` ON \`space_types\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`space_types_created_at_idx\` ON \`space_types\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`space_types_locales\` (
  	\`label\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`space_types_locales_locale_parent_id_unique\` ON \`space_types_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`commitments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`stable_id\` text,
  	\`key\` text NOT NULL,
  	\`emoji\` text,
  	\`category\` text,
  	\`impact_score\` numeric,
  	\`seasonal_start_month\` numeric,
  	\`seasonal_end_month\` numeric,
  	\`repeat_interval_days\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`commitments_stable_id_idx\` ON \`commitments\` (\`stable_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`commitments_key_idx\` ON \`commitments\` (\`key\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`commitments_updated_at_idx\` ON \`commitments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`commitments_created_at_idx\` ON \`commitments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`commitments_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`commitments_locales_locale_parent_id_unique\` ON \`commitments_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`commitments_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`space_types_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_types_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`commitments_rels_order_idx\` ON \`commitments_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`commitments_rels_parent_idx\` ON \`commitments_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`commitments_rels_path_idx\` ON \`commitments_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`commitments_rels_space_types_id_idx\` ON \`commitments_rels\` (\`space_types_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`hero_image_id\` integer,
  	\`publish_date\` text,
  	\`author\` text,
  	\`review_status\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_hero_image_idx\` ON \`articles\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles_locales\` (
  	\`title\` text NOT NULL,
  	\`intro\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`articles_locales_locale_parent_id_unique\` ON \`articles_locales\` (\`_locale\`,\`_parent_id\`);`)
  try { await db.run(sql`ALTER TABLE \`users\` ADD \`name\` text NOT NULL;`) } catch (_e) { /* Column may already exist */ }
  try { await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`push_notifications_id\` integer REFERENCES push_notifications(id);`) } catch (_e) { /* Column may already exist */ }
  try { await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`space_types_id\` integer REFERENCES space_types(id);`) } catch (_e) { /* Column may already exist */ }
  try { await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`commitments_id\` integer REFERENCES commitments(id);`) } catch (_e) { /* Column may already exist */ }
  try { await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`articles_id\` integer REFERENCES articles(id);`) } catch (_e) { /* Column may already exist */ }
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_push_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`push_notifications_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_space_types_id_idx\` ON \`payload_locked_documents_rels\` (\`space_types_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_commitments_id_idx\` ON \`payload_locked_documents_rels\` (\`commitments_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`push_notifications\`;`)
  await db.run(sql`DROP TABLE \`push_notifications_locales\`;`)
  await db.run(sql`DROP TABLE \`space_types\`;`)
  await db.run(sql`DROP TABLE \`space_types_locales\`;`)
  await db.run(sql`DROP TABLE \`commitments\`;`)
  await db.run(sql`DROP TABLE \`commitments_locales\`;`)
  await db.run(sql`DROP TABLE \`commitments_rels\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`DROP TABLE \`articles_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`name\`;`)
}
