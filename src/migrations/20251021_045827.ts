import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_commitments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`emoji\` text,
  	\`impact_score\` numeric DEFAULT 1,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_commitments\`("id", "slug", "emoji", "impact_score", "updated_at", "created_at") SELECT "id", "slug", "emoji", "impact_score", "updated_at", "created_at" FROM \`commitments\`;`)
  await db.run(sql`DROP TABLE \`commitments\`;`)
  await db.run(sql`ALTER TABLE \`__new_commitments\` RENAME TO \`commitments\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`commitments_slug_idx\` ON \`commitments\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`commitments_updated_at_idx\` ON \`commitments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`commitments_created_at_idx\` ON \`commitments\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_commitments\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`stable_id\` text,
  	\`key\` text NOT NULL,
  	\`emoji\` text,
  	\`category\` text,
  	\`impact_score\` numeric,
  	\`seasonal_start_month\` numeric,
  	\`seasonal_end_month\` numeric,
  	\`repeat_interval_days\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_commitments\`("id", "stable_id", "key", "emoji", "category", "impact_score", "seasonal_start_month", "seasonal_end_month", "repeat_interval_days", "updated_at", "created_at") SELECT "id", "stable_id", "key", "emoji", "category", "impact_score", "seasonal_start_month", "seasonal_end_month", "repeat_interval_days", "updated_at", "created_at" FROM \`commitments\`;`)
  await db.run(sql`DROP TABLE \`commitments\`;`)
  await db.run(sql`ALTER TABLE \`__new_commitments\` RENAME TO \`commitments\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`commitments_stable_id_idx\` ON \`commitments\` (\`stable_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`commitments_key_idx\` ON \`commitments\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`commitments_updated_at_idx\` ON \`commitments\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`commitments_created_at_idx\` ON \`commitments\` (\`created_at\`);`)
}
