import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_space_actions_v_version_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_space_actions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_space_actions_v_version_valid_months_order_idx\` ON \`_space_actions_v_version_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_version_valid_months_parent_idx\` ON \`_space_actions_v_version_valid_months\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_space_actions_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__order\` text,
  	\`version_slug\` text,
  	\`version_link\` text,
  	\`version_active\` integer DEFAULT true,
  	\`version_min_commitments\` numeric,
  	\`version_max_commitments\` numeric,
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
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`space_actions\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_space_actions_v_parent_idx\` ON \`_space_actions_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_version_version__order_idx\` ON \`_space_actions_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_version_version_slug_idx\` ON \`_space_actions_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_version_version_updated_at_idx\` ON \`_space_actions_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_version_version_created_at_idx\` ON \`_space_actions_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_version_version__status_idx\` ON \`_space_actions_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_created_at_idx\` ON \`_space_actions_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_updated_at_idx\` ON \`_space_actions_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_snapshot_idx\` ON \`_space_actions_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_published_locale_idx\` ON \`_space_actions_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_latest_idx\` ON \`_space_actions_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_space_actions_v_locales\` (
  	\`version_label\` text,
  	\`version_description\` text,
  	\`version_tagline\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_space_actions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_space_actions_v_locales_locale_parent_id_unique\` ON \`_space_actions_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_space_actions_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`space_types_id\` integer,
  	\`commitments_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_space_actions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_types_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`commitments_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_space_actions_v_rels_order_idx\` ON \`_space_actions_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_rels_parent_idx\` ON \`_space_actions_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_rels_path_idx\` ON \`_space_actions_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_rels_space_types_id_idx\` ON \`_space_actions_v_rels\` (\`space_types_id\`);`)
  await db.run(sql`CREATE INDEX \`_space_actions_v_rels_commitments_id_idx\` ON \`_space_actions_v_rels\` (\`commitments_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_space_actions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`slug\` text,
  	\`link\` text,
  	\`active\` integer DEFAULT true,
  	\`min_commitments\` numeric,
  	\`max_commitments\` numeric,
  	\`publish_date\` text,
  	\`end_date\` text,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 999,
  	\`author\` text,
  	\`review_status\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`INSERT INTO \`__new_space_actions\`("id", "_order", "slug", "link", "active", "min_commitments", "max_commitments", "publish_date", "end_date", "schedule", "limmit", "author", "review_status", "updated_at", "created_at", "_status") SELECT "id", "_order", "slug", "link", "active", "min_commitments", "max_commitments", "publish_date", "end_date", "schedule", "limmit", "author", "review_status", "updated_at", "created_at", "_status" FROM \`space_actions\`;`)
  await db.run(sql`DROP TABLE \`space_actions\`;`)
  await db.run(sql`ALTER TABLE \`__new_space_actions\` RENAME TO \`space_actions\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`space_actions__order_idx\` ON \`space_actions\` (\`_order\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_actions_slug_idx\` ON \`space_actions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_updated_at_idx\` ON \`space_actions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_created_at_idx\` ON \`space_actions\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`space_actions__status_idx\` ON \`space_actions\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_space_actions_locales\` (
  	\`label\` text,
  	\`description\` text,
  	\`tagline\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`space_actions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_space_actions_locales\`("label", "description", "tagline", "id", "_locale", "_parent_id") SELECT "label", "description", "tagline", "id", "_locale", "_parent_id" FROM \`space_actions_locales\`;`)
  await db.run(sql`DROP TABLE \`space_actions_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_space_actions_locales\` RENAME TO \`space_actions_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_actions_locales_locale_parent_id_unique\` ON \`space_actions_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_space_actions_v_version_valid_months\`;`)
  await db.run(sql`DROP TABLE \`_space_actions_v\`;`)
  await db.run(sql`DROP TABLE \`_space_actions_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_space_actions_v_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_space_actions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`slug\` text NOT NULL,
  	\`link\` text,
  	\`active\` integer DEFAULT true,
  	\`min_commitments\` numeric,
  	\`max_commitments\` numeric,
  	\`publish_date\` text,
  	\`end_date\` text,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 999,
  	\`author\` text,
  	\`review_status\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_space_actions\`("id", "_order", "slug", "link", "active", "min_commitments", "max_commitments", "publish_date", "end_date", "schedule", "limmit", "author", "review_status", "updated_at", "created_at") SELECT "id", "_order", "slug", "link", "active", "min_commitments", "max_commitments", "publish_date", "end_date", "schedule", "limmit", "author", "review_status", "updated_at", "created_at" FROM \`space_actions\`;`)
  await db.run(sql`DROP TABLE \`space_actions\`;`)
  await db.run(sql`ALTER TABLE \`__new_space_actions\` RENAME TO \`space_actions\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`space_actions__order_idx\` ON \`space_actions\` (\`_order\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_actions_slug_idx\` ON \`space_actions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_updated_at_idx\` ON \`space_actions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`space_actions_created_at_idx\` ON \`space_actions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_space_actions_locales\` (
  	\`label\` text NOT NULL,
  	\`description\` text,
  	\`tagline\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`space_actions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_space_actions_locales\`("label", "description", "tagline", "id", "_locale", "_parent_id") SELECT "label", "description", "tagline", "id", "_locale", "_parent_id" FROM \`space_actions_locales\`;`)
  await db.run(sql`DROP TABLE \`space_actions_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_space_actions_locales\` RENAME TO \`space_actions_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_actions_locales_locale_parent_id_unique\` ON \`space_actions_locales\` (\`_locale\`,\`_parent_id\`);`)
}
