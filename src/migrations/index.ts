import * as migration_20251015_130702 from './20251015_130702';
import * as migration_20251015_145826 from './20251015_145826';
import * as migration_20251015_152711 from './20251015_152711';
import * as migration_20251015_181250 from './20251015_181250';

export const migrations = [
  {
    up: migration_20251015_130702.up,
    down: migration_20251015_130702.down,
    name: '20251015_130702',
  },
  {
    up: migration_20251015_145826.up,
    down: migration_20251015_145826.down,
    name: '20251015_145826',
  },
  {
    up: migration_20251015_152711.up,
    down: migration_20251015_152711.down,
    name: '20251015_152711',
  },
  {
    up: migration_20251015_181250.up,
    down: migration_20251015_181250.down,
    name: '20251015_181250'
  },
];
