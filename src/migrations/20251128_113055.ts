import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`articles_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_valid_months_order_idx\` ON \`articles_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`articles_valid_months_parent_idx\` ON \`articles_valid_months\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`commitments_id\` integer,
  	\`articles_id\` integer,
  	\`bee_info_id\` integer,
  	\`questionnaire_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`commitments_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bee_info_id\`) REFERENCES \`bee_info\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`questionnaire_id\`) REFERENCES \`questionnaire\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_rels_order_idx\` ON \`articles_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_parent_idx\` ON \`articles_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_path_idx\` ON \`articles_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_commitments_id_idx\` ON \`articles_rels\` (\`commitments_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_articles_id_idx\` ON \`articles_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_bee_info_id_idx\` ON \`articles_rels\` (\`bee_info_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_questionnaire_id_idx\` ON \`articles_rels\` (\`questionnaire_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_version_valid_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_version_valid_months_order_idx\` ON \`_articles_v_version_valid_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_valid_months_parent_idx\` ON \`_articles_v_version_valid_months\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`commitments_id\` integer,
  	\`articles_id\` integer,
  	\`bee_info_id\` integer,
  	\`questionnaire_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`commitments_id\`) REFERENCES \`commitments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bee_info_id\`) REFERENCES \`bee_info\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`questionnaire_id\`) REFERENCES \`questionnaire\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_order_idx\` ON \`_articles_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_parent_idx\` ON \`_articles_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_path_idx\` ON \`_articles_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_commitments_id_idx\` ON \`_articles_v_rels\` (\`commitments_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_articles_id_idx\` ON \`_articles_v_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_bee_info_id_idx\` ON \`_articles_v_rels\` (\`bee_info_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_questionnaire_id_idx\` ON \`_articles_v_rels\` (\`questionnaire_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`articles_valid_months\`;`)
  await db.run(sql`DROP TABLE \`articles_rels\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_version_valid_months\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_rels\`;`)
}
