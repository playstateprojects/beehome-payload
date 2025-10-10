-- Manual migration to fix production database schema for push_notifications and in_app_notifications
-- Run this directly on the production D1 database

-- Fix push_notifications table
-- Add missing columns
ALTER TABLE push_notifications ADD COLUMN image_id integer REFERENCES media(id);
ALTER TABLE push_notifications ADD COLUMN key text NOT NULL DEFAULT '';

-- Fix push_notifications_locales table
-- Rename name to title (preserving data)
ALTER TABLE push_notifications_locales RENAME COLUMN name TO title;
-- Add message column
ALTER TABLE push_notifications_locales ADD COLUMN message text NOT NULL DEFAULT '';

-- Fix in_app_notifications table
-- Drop the incorrect name column from main table if it exists
-- Note: SQLite doesn't support DROP COLUMN directly in older versions, so we may need to check
-- Add missing columns
ALTER TABLE in_app_notifications ADD COLUMN image_id integer REFERENCES media(id);
ALTER TABLE in_app_notifications ADD COLUMN key text NOT NULL DEFAULT '';

-- Fix in_app_notifications_locales table
-- Add title column
ALTER TABLE in_app_notifications_locales ADD COLUMN title text NOT NULL DEFAULT '';
-- message column already exists

-- Clean up: After running this, you should manually clean the migration tracking table
-- DELETE FROM payload_migrations WHERE name IN ('20250929_111647', '20251010_041607', '20251010_071607');
