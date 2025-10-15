import * as migration_20251015_130702 from './20251015_130702';
import * as migration_20251015_145826 from './20251015_145826';

export const migrations = [
  {
    up: migration_20251015_130702.up,
    down: migration_20251015_130702.down,
    name: '20251015_130702',
  },
  {
    up: migration_20251015_145826.up,
    down: migration_20251015_145826.down,
    name: '20251015_145826'
  },
];
