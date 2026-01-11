import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

type TableInfoRow = {
  name?: string
}

const hasDeepLinkColumn = (rows: TableInfoRow[] | undefined) =>
  Array.isArray(rows) && rows.some(({ name }) => name === 'deep_link')

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const result = (await db.run(sql`PRAGMA table_info('push_notifications');`)) as unknown as {
    rows: TableInfoRow[]
  }

  if (!hasDeepLinkColumn(result.rows)) {
    await db.run(sql`ALTER TABLE \`push_notifications\` ADD \`deep_link\` text;`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const result = (await db.run(sql`PRAGMA table_info('push_notifications');`)) as unknown as {
    rows: TableInfoRow[]
  }

  if (hasDeepLinkColumn(result.rows)) {
    await db.run(sql`ALTER TABLE \`push_notifications\` DROP COLUMN \`deep_link\`;`)
  }
}
