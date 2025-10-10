-- Drop all tables to reset the database
-- Run this before applying fresh migrations

PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS users_sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS push_notifications_locales;
DROP TABLE IF EXISTS push_notifications;
DROP TABLE IF EXISTS space_types_locales;
DROP TABLE IF EXISTS space_types;
DROP TABLE IF EXISTS commitments_locales;
DROP TABLE IF EXISTS commitments_rels;
DROP TABLE IF EXISTS commitments;
DROP TABLE IF EXISTS articles_locales;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS in_app_notifications_locales;
DROP TABLE IF EXISTS in_app_notifications;
DROP TABLE IF EXISTS payload_locked_documents_rels;
DROP TABLE IF EXISTS payload_locked_documents;
DROP TABLE IF EXISTS payload_preferences_rels;
DROP TABLE IF EXISTS payload_preferences;
DROP TABLE IF EXISTS payload_migrations;

PRAGMA foreign_keys=ON;
