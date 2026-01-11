import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`DROP INDEX \`in_app_notifications_texts_order_parent_idx\`;`)
  await db.run(sql`CREATE INDEX \`in_app_notifications_texts_order_parent\` ON \`in_app_notifications_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`DROP INDEX \`questionnaire_question_cards_options_locales_locale_parent_id_unique\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`questionnaire_question_cards_options_locales_locale_parent_i\` ON \`questionnaire_question_cards_options_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`DROP INDEX \`push_notifications_texts_order_parent_idx\`;`)
  await db.run(sql`CREATE INDEX \`push_notifications_texts_order_parent\` ON \`push_notifications_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`in_app_notifications\` ADD \`all_users\` integer;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP INDEX \`in_app_notifications_texts_order_parent\`;`)
  await db.run(sql`CREATE INDEX \`in_app_notifications_texts_order_parent_idx\` ON \`in_app_notifications_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`DROP INDEX \`questionnaire_question_cards_options_locales_locale_parent_i\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`questionnaire_question_cards_options_locales_locale_parent_id_unique\` ON \`questionnaire_question_cards_options_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`DROP INDEX \`push_notifications_texts_order_parent\`;`)
  await db.run(sql`CREATE INDEX \`push_notifications_texts_order_parent_idx\` ON \`push_notifications_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`in_app_notifications\` DROP COLUMN \`all_users\`;`)
}
