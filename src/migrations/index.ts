import * as migration_20251015_130702 from './20251015_130702';

export const migrations = [
  {
    up: migration_20251015_130702.up,
    down: migration_20251015_130702.down,
    name: '20251015_130702'
  },
];
