import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`in_app_notifications_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`in_app_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`in_app_notifications_valid_months_order_idx\` ON \`in_app_notifications_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`in_app_notifications_valid_months_parent_idx\` ON \`in_app_notifications_valid_months\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`in_app_notifications_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`in_app_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`in_app_notifications_texts_order_parent_idx\` ON \`in_app_notifications_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`push_notifications_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`push_notifications_valid_months_order_idx\` ON \`push_notifications_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications_valid_months_parent_idx\` ON \`push_notifications_valid_months\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`push_notifications_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`push_notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`push_notifications_texts_order_parent_idx\` ON \`push_notifications_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_push_notifications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`condition_notes\` text,
  	\`publish_date\` text,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 1,
  	\`all_users\` integer,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_push_notifications\`("id", "image_id", "condition_notes", "publish_date", "schedule", "limmit", "all_users", "slug", "updated_at", "created_at") SELECT "id", "image_id", "condition_notes", "publish_date", "schedule", "limmit", "all_users", "slug", "updated_at", "created_at" FROM \`push_notifications\`;`)
  await db.run(sql`DROP TABLE \`push_notifications\`;`)
  await db.run(sql`ALTER TABLE \`__new_push_notifications\` RENAME TO \`push_notifications\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`push_notifications_image_idx\` ON \`push_notifications\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications_updated_at_idx\` ON \`push_notifications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications_created_at_idx\` ON \`push_notifications\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`in_app_notifications\` ADD \`condition_notes\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`in_app_notifications_valid_months\`;`)
  await db.run(sql`DROP TABLE \`in_app_notifications_texts\`;`)
  await db.run(sql`DROP TABLE \`push_notifications_valid_months\`;`)
  await db.run(sql`DROP TABLE \`push_notifications_texts\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_push_notifications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`publish_date\` text,
  	\`schedule\` numeric DEFAULT 365,
  	\`limmit\` numeric DEFAULT 999,
  	\`slug\` text NOT NULL,
  	\`all_users\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_push_notifications\`("id", "image_id", "publish_date", "schedule", "limmit", "slug", "all_users", "updated_at", "created_at") SELECT "id", "image_id", "publish_date", "schedule", "limmit", "slug", "all_users", "updated_at", "created_at" FROM \`push_notifications\`;`)
  await db.run(sql`DROP TABLE \`push_notifications\`;`)
  await db.run(sql`ALTER TABLE \`__new_push_notifications\` RENAME TO \`push_notifications\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`push_notifications_image_idx\` ON \`push_notifications\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications_updated_at_idx\` ON \`push_notifications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`push_notifications_created_at_idx\` ON \`push_notifications\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`in_app_notifications\` DROP COLUMN \`condition_notes\`;`)
}
