import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`commitments_examples\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`example\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`commitments_examples_order_idx\` ON \`commitments_examples\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`commitments_examples_parent_id_idx\` ON \`commitments_examples\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`commitments_examples_locale_idx\` ON \`commitments_examples\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`commitments\` ADD \`hero_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`commitments_hero_image_idx\` ON \`commitments\` (\`hero_image_id\`);`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` ADD \`full_text\` text;`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` ADD \`tip\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`commitments_examples\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_commitments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`emoji\` text,
  	\`impact_score\` numeric DEFAULT 1,
  	\`slug\` text NOT NULL,
  	\`parent_id\` integer,
  	\`info_article_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`info_article_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_commitments\`("id", "_order", "emoji", "impact_score", "slug", "parent_id", "info_article_id", "updated_at", "created_at") SELECT "id", "_order", "emoji", "impact_score", "slug", "parent_id", "info_article_id", "updated_at", "created_at" FROM \`commitments\`;`)
  await db.run(sql`DROP TABLE \`commitments\`;`)
  await db.run(sql`ALTER TABLE \`__new_commitments\` RENAME TO \`commitments\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`commitments__order_idx\` ON \`commitments\` (\`_order\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`commitments_slug_idx\` ON \`commitments\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`commitments_parent_idx\` ON \`commitments\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`commitments_info_article_idx\` ON \`commitments\` (\`info_article_id\`);`)
  await db.run(sql`CREATE INDEX \`commitments_updated_at_idx\` ON \`commitments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`commitments_created_at_idx\` ON \`commitments\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` DROP COLUMN \`full_text\`;`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` DROP COLUMN \`tip\`;`)
}
