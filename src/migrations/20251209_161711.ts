import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`commitments_space_type_article_overrides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`space_type_id\` integer NOT NULL,
  	\`info_article_id\` integer NOT NULL,
  	FOREIGN KEY (\`space_type_id\`) REFERENCES \`space_types\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`info_article_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`commitments_space_type_article_overrides_order_idx\` ON \`commitments_space_type_article_overrides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`commitments_space_type_article_overrides_parent_id_idx\` ON \`commitments_space_type_article_overrides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`commitments_space_type_article_overrides_space_type_idx\` ON \`commitments_space_type_article_overrides\` (\`space_type_id\`);`)
  await db.run(sql`CREATE INDEX \`commitments_space_type_article_overrides_info_article_idx\` ON \`commitments_space_type_article_overrides\` (\`info_article_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`commitments_space_type_article_overrides\`;`)
}
