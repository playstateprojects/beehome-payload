import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_reviews\` ADD \`total_commitments\` numeric;`)
  await db.run(sql`ALTER TABLE \`space_types\` ADD \`default_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`space_types_default_image_idx\` ON \`space_types\` (\`default_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_space_types\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`sort\` numeric DEFAULT 0,
  	\`active\` integer DEFAULT true,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_space_types\`("id", "sort", "active", "slug", "updated_at", "created_at") SELECT "id", "sort", "active", "slug", "updated_at", "created_at" FROM \`space_types\`;`)
  await db.run(sql`DROP TABLE \`space_types\`;`)
  await db.run(sql`ALTER TABLE \`__new_space_types\` RENAME TO \`space_types\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_types_slug_idx\` ON \`space_types\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`space_types_updated_at_idx\` ON \`space_types\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`space_types_created_at_idx\` ON \`space_types\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`space_reviews\` DROP COLUMN \`total_commitments\`;`)
}
