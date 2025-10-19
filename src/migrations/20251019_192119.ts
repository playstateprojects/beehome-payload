import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`space_types_stable_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`space_types\` DROP COLUMN \`stable_id\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
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
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`in_app_notifications_locales_locale_parent_id_unique\` ON \`in_app_notifications_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_in_app_notifications_locales\` (
  	\`title\` text NOT NULL,
  	\`message\` text NOT NULL,
  	\`action_button_text\` text DEFAULT 'OK',
  	\`action_button_link\` text DEFAULT 'OK',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`in_app_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_in_app_notifications_locales\`("title", "message", "action_button_text", "action_button_link", "id", "_locale", "_parent_id") SELECT "title", "message", "action_button_text", "action_button_link", "id", "_locale", "_parent_id" FROM \`in_app_notifications_locales\`;`)
  await db.run(sql`DROP TABLE \`in_app_notifications_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_in_app_notifications_locales\` RENAME TO \`in_app_notifications_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`in_app_notifications_locales_locale_parent_id_unique\` ON \`in_app_notifications_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`space_types\` ADD \`stable_id\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_types_stable_id_idx\` ON \`space_types\` (\`stable_id\`);`)
}
