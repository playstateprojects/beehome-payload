import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_types\` RENAME COLUMN "key" TO "slug";`)
  await db.run(sql`DROP INDEX \`space_types_key_idx\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_types_slug_idx\` ON \`space_types\` (\`slug\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_types\` RENAME COLUMN "slug" TO "key";`)
  await db.run(sql`DROP INDEX \`space_types_slug_idx\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`space_types_key_idx\` ON \`space_types\` (\`key\`);`)
}
