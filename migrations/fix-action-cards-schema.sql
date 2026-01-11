-- Migration to fix Action Cards schema
-- Date: 2025-11-12
-- Issue: Missing columns in action_cards table causing 500 errors when saving

-- Add missing columns to action_cards table
ALTER TABLE `action_cards` ADD COLUMN `schedule` numeric DEFAULT 365;
ALTER TABLE `action_cards` ADD COLUMN `limmit` numeric DEFAULT 999;

-- Note: The action_cards_valid_months table already exists in the database
-- but verify it has the correct structure:
-- If it doesn't exist, uncomment the following:
/*
CREATE TABLE IF NOT EXISTS `action_cards_valid_months` (
  `order` integer NOT NULL,
  `parent_id` integer NOT NULL,
  `value` text,
  `id` integer PRIMARY KEY NOT NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `action_cards`(`id`) ON UPDATE no action ON DELETE cascade
);
*/

-- Verify the schema is correct
SELECT
  name,
  type
FROM pragma_table_info('action_cards')
ORDER BY cid;
