import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_hero_image_id\` integer,
  	\`version_action_button_link\` text,
  	\`version_publish_date\` text,
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
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_parent_idx\` ON \`_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_slug_idx\` ON \`_articles_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_hero_image_idx\` ON \`_articles_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_updated_at_idx\` ON \`_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_created_at_idx\` ON \`_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__status_idx\` ON \`_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_created_at_idx\` ON \`_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_updated_at_idx\` ON \`_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_snapshot_idx\` ON \`_articles_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_published_locale_idx\` ON \`_articles_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_latest_idx\` ON \`_articles_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_locales\` (
  	\`version_title\` text,
  	\`version_intro\` text,
  	\`version_body\` text,
  	\`version_action_button\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_articles_v_locales_locale_parent_id_unique\` ON \`_articles_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_articles_locales\` (
  	\`title\` text,
  	\`intro\` text,
  	\`body\` text,
  	\`action_button\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_articles_locales\`("title", "intro", "body", "action_button", "id", "_locale", "_parent_id") SELECT "title", "intro", "body", "action_button", "id", "_locale", "_parent_id" FROM \`articles_locales\`;`)
  await db.run(sql`DROP TABLE \`articles_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_articles_locales\` RENAME TO \`articles_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`articles_locales_locale_parent_id_unique\` ON \`articles_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`articles\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`articles__status_idx\` ON \`articles\` (\`_status\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_articles_v\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_locales\`;`)
  await db.run(sql`DROP INDEX \`articles__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`articles\` DROP COLUMN \`_status\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_articles_locales\` (
  	\`title\` text NOT NULL,
  	\`intro\` text,
  	\`body\` text,
  	\`action_button\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_articles_locales\`("title", "intro", "body", "action_button", "id", "_locale", "_parent_id") SELECT "title", "intro", "body", "action_button", "id", "_locale", "_parent_id" FROM \`articles_locales\`;`)
  await db.run(sql`DROP TABLE \`articles_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_articles_locales\` RENAME TO \`articles_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`articles_locales_locale_parent_id_unique\` ON \`articles_locales\` (\`_locale\`,\`_parent_id\`);`)
}
