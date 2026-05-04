import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`commitments_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text DEFAULT 'bestellen' NOT NULL,
  	\`link\` text NOT NULL,
  	\`country\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`commitments_buttons_order_idx\` ON \`commitments_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`commitments_buttons_parent_id_idx\` ON \`commitments_buttons\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`commitments_buttons\`;`)
}
