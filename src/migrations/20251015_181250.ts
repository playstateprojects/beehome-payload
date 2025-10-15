import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`questionnaire_option_groups_options\` RENAME TO \`questionnaire_question_cards_options\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_option_groups_options_locales\` RENAME TO \`questionnaire_question_cards_options_locales\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_option_groups\` RENAME TO \`questionnaire_question_cards\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_option_groups_locales\` RENAME TO \`questionnaire_question_cards_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_question_cards_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'checkbox' NOT NULL,
  	\`uuid\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire_question_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_question_cards_options\`("_order", "_parent_id", "id", "type", "uuid") SELECT "_order", "_parent_id", "id", "type", "uuid" FROM \`questionnaire_question_cards_options\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_question_cards_options\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_question_cards_options\` RENAME TO \`questionnaire_question_cards_options\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`questionnaire_question_cards_options_order_idx\` ON \`questionnaire_question_cards_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`questionnaire_question_cards_options_parent_id_idx\` ON \`questionnaire_question_cards_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_question_cards_options_locales\` (
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire_question_cards_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_question_cards_options_locales\`("description", "id", "_locale", "_parent_id") SELECT "description", "id", "_locale", "_parent_id" FROM \`questionnaire_question_cards_options_locales\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_question_cards_options_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_question_cards_options_locales\` RENAME TO \`questionnaire_question_cards_options_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`questionnaire_question_cards_options_locales_locale_parent_id_unique\` ON \`questionnaire_question_cards_options_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_question_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`allow_multiple\` integer DEFAULT true,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_question_cards\`("_order", "_parent_id", "id", "allow_multiple") SELECT "_order", "_parent_id", "id", "allow_multiple" FROM \`questionnaire_question_cards\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_question_cards\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_question_cards\` RENAME TO \`questionnaire_question_cards\`;`)
  await db.run(sql`CREATE INDEX \`questionnaire_question_cards_order_idx\` ON \`questionnaire_question_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`questionnaire_question_cards_parent_id_idx\` ON \`questionnaire_question_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_questionnaire_question_cards_locales\` (
  	\`title\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`questionnaire_question_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_questionnaire_question_cards_locales\`("title", "description", "id", "_locale", "_parent_id") SELECT "title", "description", "id", "_locale", "_parent_id" FROM \`questionnaire_question_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`questionnaire_question_cards_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_questionnaire_question_cards_locales\` RENAME TO \`questionnaire_question_cards_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`questionnaire_question_cards_locales_locale_parent_id_unique\` ON \`questionnaire_question_cards_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`questionnaire_question_cards_options\` RENAME TO \`questionnaire_option_groups_options\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_question_cards_options_locales\` RENAME TO \`questionnaire_option_groups_options_locales\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_question_cards\` RENAME TO \`questionnaire_option_groups\`;`)
  await db.run(sql`ALTER TABLE \`questionnaire_question_cards_locales\` RENAME TO \`questionnaire_option_groups_locales\`;`)
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
}
