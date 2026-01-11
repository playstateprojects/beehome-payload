import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Check if columns exist before adding/dropping
  const tableInfo = await db.run(sql`PRAGMA table_info(space_reviews);`)
  const columns = tableInfo.results as Array<{ name: string }>

  const minCommitmentsExists = columns.some(col => col.name === 'min_commitments')
  const maxCommitmentsExists = columns.some(col => col.name === 'max_commitments')
  const totalCommitmentsExists = columns.some(col => col.name === 'total_commitments')

  if (!minCommitmentsExists) {
    await db.run(sql`ALTER TABLE \`space_reviews\` ADD \`min_commitments\` numeric;`)
  }

  if (!maxCommitmentsExists) {
    await db.run(sql`ALTER TABLE \`space_reviews\` ADD \`max_commitments\` numeric;`)
  }

  if (totalCommitmentsExists) {
    await db.run(sql`ALTER TABLE \`space_reviews\` DROP COLUMN \`total_commitments\`;`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`space_reviews\` ADD \`total_commitments\` numeric;`)
  await db.run(sql`ALTER TABLE \`space_reviews\` DROP COLUMN \`min_commitments\`;`)
  await db.run(sql`ALTER TABLE \`space_reviews\` DROP COLUMN \`max_commitments\`;`)
}
