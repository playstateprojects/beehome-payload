import * as migration_20251015_130702 from './20251015_130702';
import * as migration_20251015_145826 from './20251015_145826';
import * as migration_20251015_152711 from './20251015_152711';
import * as migration_20251015_181250 from './20251015_181250';
import * as migration_20251015_202823 from './20251015_202823';
import * as migration_20251015_204807 from './20251015_204807';
import * as migration_20251017_102224 from './20251017_102224';

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
    name: '20251015_181250',
  },
  {
    up: migration_20251015_202823.up,
    down: migration_20251015_202823.down,
    name: '20251015_202823',
  },
  {
    up: migration_20251015_204807.up,
    down: migration_20251015_204807.down,
    name: '20251015_204807',
  },
  {
    up: migration_20251017_102224.up,
    down: migration_20251017_102224.down,
    name: '20251017_102224'
  },
];
