import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Remove corrupt test record (id=1) where _order='_order' and _status='_status'
  // This invalid _order value breaks Payload's fractional ordering on every new ActionCard create
  await db.run(sql`DELETE FROM \`action_cards\` WHERE \`id\` = 1 AND \`_order\` = '_order'`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // No meaningful rollback — the record was corrupt test data
}
