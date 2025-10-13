-- Add action_cards tables to production
CREATE TABLE `action_cards` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`slug` text NOT NULL,
  	`link` text,
  	`image_id` integer,
  	`publish_date` text,
  	`end_date` text,
  	`multiple_views` integer,
  	`display_to_all_users` integer,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);

CREATE INDEX `action_cards_image_idx` ON `action_cards` (`image_id`);
CREATE INDEX `action_cards_updated_at_idx` ON `action_cards` (`updated_at`);
CREATE INDEX `action_cards_created_at_idx` ON `action_cards` (`created_at`);

CREATE TABLE `action_cards_locales` (
  	`title` text NOT NULL,
  	`topic` text NOT NULL,
  	`tag` text NOT NULL,
  	`body` text,
  	`id` integer PRIMARY KEY NOT NULL,
  	`_locale` text NOT NULL,
  	`_parent_id` integer NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `action_cards`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE UNIQUE INDEX `action_cards_locales_locale_parent_id_unique` ON `action_cards_locales` (`_locale`,`_parent_id`);

-- Add action_cards to payload_locked_documents_rels if not already there
ALTER TABLE `payload_locked_documents_rels` ADD COLUMN `action_cards_id` integer REFERENCES action_cards(id);
CREATE INDEX `payload_locked_documents_rels_action_cards_id_idx` ON `payload_locked_documents_rels` (`action_cards_id`);
