import * as migration_20251013_161137_initial_from_prod from './20251013_161137_initial_from_prod';

export const migrations = [
  {
    up: migration_20251013_161137_initial_from_prod.up,
    down: migration_20251013_161137_initial_from_prod.down,
    name: '20251013_161137_initial_from_prod'
  },
];
