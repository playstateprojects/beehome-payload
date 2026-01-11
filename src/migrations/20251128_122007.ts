import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`commitments\` ADD \`parent_id\` integer REFERENCES commitments(id);`)
  await db.run(sql`CREATE INDEX \`commitments_parent_idx\` ON \`commitments\` (\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` ADD \`call_to_action\` text;`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` ADD \`detail_title\` text;`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` ADD \`detail_subtitle\` text;`)
  await db.run(sql`ALTER TABLE \`commitments_rels\` ADD \`articles_id\` integer REFERENCES articles(id);`)
  await db.run(sql`ALTER TABLE \`commitments_rels\` ADD \`badges_id\` integer REFERENCES badges(id);`)
  await db.run(sql`CREATE INDEX \`commitments_rels_articles_id_idx\` ON \`commitments_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`commitments_rels_badges_id_idx\` ON \`commitments_rels\` (\`badges_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_commitments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`emoji\` text,
  	\`impact_score\` numeric DEFAULT 1,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_commitments\`("id", "emoji", "impact_score", "slug", "updated_at", "created_at") SELECT "id", "emoji", "impact_score", "slug", "updated_at", "created_at" FROM \`commitments\`;`)
  await db.run(sql`DROP TABLE \`commitments\`;`)
  await db.run(sql`ALTER TABLE \`__new_commitments\` RENAME TO \`commitments\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`commitments_slug_idx\` ON \`commitments\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`commitments_updated_at_idx\` ON \`commitments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`commitments_created_at_idx\` ON \`commitments\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_commitments_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`space_types_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`space_types_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_commitments_rels\`("id", "order", "parent_id", "path", "space_types_id") SELECT "id", "order", "parent_id", "path", "space_types_id" FROM \`commitments_rels\`;`)
  await db.run(sql`DROP TABLE \`commitments_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_commitments_rels\` RENAME TO \`commitments_rels\`;`)
  await db.run(sql`CREATE INDEX \`commitments_rels_order_idx\` ON \`commitments_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`commitments_rels_parent_idx\` ON \`commitments_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`commitments_rels_path_idx\` ON \`commitments_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`commitments_rels_space_types_id_idx\` ON \`commitments_rels\` (\`space_types_id\`);`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` DROP COLUMN \`call_to_action\`;`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` DROP COLUMN \`detail_title\`;`)
  await db.run(sql`ALTER TABLE \`commitments_locales\` DROP COLUMN \`detail_subtitle\`;`)
}
