import * as migration_20251010_085528_initial from './20251010_085528_initial';

export const migrations = [
  {
    up: migration_20251010_085528_initial.up,
    down: migration_20251010_085528_initial.down,
    name: '20251010_085528_initial'
  },
];
