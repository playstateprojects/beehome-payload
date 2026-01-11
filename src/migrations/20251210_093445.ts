import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_badges_locales\` (
  	\`name\` text NOT NULL,
  	\`page_title\` text NOT NULL,
  	\`page_subtitle\` text NOT NULL,
  	\`page_description\` text,
  	\`page_action_button\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`badges\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_badges_locales\`("name", "page_title", "page_subtitle", "page_description", "page_action_button", "id", "_locale", "_parent_id") SELECT "name", "page_title", "page_subtitle", "page_description", "page_action_button", "id", "_locale", "_parent_id" FROM \`badges_locales\`;`)
  await db.run(sql`DROP TABLE \`badges_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_badges_locales\` RENAME TO \`badges_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`badges_locales_locale_parent_id_unique\` ON \`badges_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_badges_locales\` (
  	\`name\` text NOT NULL,
  	\`page_title\` text NOT NULL,
  	\`page_subtitle\` text NOT NULL,
  	\`page_description\` text NOT NULL,
  	\`page_action_button\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`badges\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_badges_locales\`("name", "page_title", "page_subtitle", "page_description", "page_action_button", "id", "_locale", "_parent_id") SELECT "name", "page_title", "page_subtitle", "page_description", "page_action_button", "id", "_locale", "_parent_id" FROM \`badges_locales\`;`)
  await db.run(sql`DROP TABLE \`badges_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_badges_locales\` RENAME TO \`badges_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`badges_locales_locale_parent_id_unique\` ON \`badges_locales\` (\`_locale\`,\`_parent_id\`);`)
}
