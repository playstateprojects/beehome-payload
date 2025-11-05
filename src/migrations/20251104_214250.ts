import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

type TableInfoRow = {
  name?: string
}

const hasDeepLinkColumn = (rows: TableInfoRow[] | undefined) =>
  Array.isArray(rows) && rows.some(({ name }) => name === 'deep_link')

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const { rows } = await db.run<TableInfoRow>(sql`PRAGMA table_info('push_notifications');`)

  if (!hasDeepLinkColumn(rows)) {
    await db.run(sql`ALTER TABLE \`push_notifications\` ADD \`deep_link\` text;`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const { rows } = await db.run<TableInfoRow>(sql`PRAGMA table_info('push_notifications');`)

  if (hasDeepLinkColumn(rows)) {
    await db.run(sql`ALTER TABLE \`push_notifications\` DROP COLUMN \`deep_link\`;`)
  }
}
