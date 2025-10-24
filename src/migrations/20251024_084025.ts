import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_reviews\` ADD \`min_commitments\` numeric;`)
  await db.run(sql`ALTER TABLE \`space_reviews\` ADD \`max_commitments\` numeric;`)
  await db.run(sql`ALTER TABLE \`space_reviews\` DROP COLUMN \`total_commitments\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_reviews\` ADD \`total_commitments\` numeric;`)
  await db.run(sql`ALTER TABLE \`space_reviews\` DROP COLUMN \`min_commitments\`;`)
  await db.run(sql`ALTER TABLE \`space_reviews\` DROP COLUMN \`max_commitments\`;`)
}
