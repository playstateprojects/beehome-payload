import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bee_info_locales\` RENAME COLUMN "species_name" TO "common_name";`)
  await db.run(sql`ALTER TABLE \`bee_info_locales\` RENAME COLUMN "common_tagline" TO "tagline";`)
  await db.run(sql`ALTER TABLE \`_bee_info_v_locales\` RENAME COLUMN "version_species_name" TO "version_common_name";`)
  await db.run(sql`ALTER TABLE \`_bee_info_v_locales\` RENAME COLUMN "version_common_tagline" TO "version_tagline";`)
  await db.run(sql`ALTER TABLE \`bee_info_locales\` ADD \`intro\` text;`)
  await db.run(sql`ALTER TABLE \`_bee_info_v_locales\` ADD \`version_intro\` text;`)
  await db.run(sql`ALTER TABLE \`bee_info\` ADD \`gbif_link\` text;`)
  await db.run(sql`ALTER TABLE \`bee_info\` ADD \`inaturalist_link\` text;`)
  await db.run(sql`ALTER TABLE \`_bee_info_v\` ADD \`version_gbif_link\` text;`)
  await db.run(sql`ALTER TABLE \`_bee_info_v\` ADD \`version_inaturalist_link\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`bee_info_locales\` RENAME COLUMN "common_name" TO "species_name";`)
  await db.run(sql`ALTER TABLE \`bee_info_locales\` RENAME COLUMN "tagline" TO "common_tagline";`)
  await db.run(sql`ALTER TABLE \`_bee_info_v_locales\` RENAME COLUMN "version_common_name" TO "version_species_name";`)
  await db.run(sql`ALTER TABLE \`_bee_info_v_locales\` RENAME COLUMN "version_tagline" TO "version_common_tagline";`)
  await db.run(sql`ALTER TABLE \`bee_info_locales\` DROP COLUMN \`intro\`;`)
  await db.run(sql`ALTER TABLE \`_bee_info_v_locales\` DROP COLUMN \`version_intro\`;`)
  await db.run(sql`ALTER TABLE \`bee_info\` DROP COLUMN \`gbif_link\`;`)
  await db.run(sql`ALTER TABLE \`bee_info\` DROP COLUMN \`inaturalist_link\`;`)
  await db.run(sql`ALTER TABLE \`_bee_info_v\` DROP COLUMN \`version_gbif_link\`;`)
  await db.run(sql`ALTER TABLE \`_bee_info_v\` DROP COLUMN \`version_inaturalist_link\`;`)
}
