import createManager from './createManager';
import stateSanitizer from './stateSanitizer';
import {
  meta,
  getMeta,
  setCustomMeta as setMeta,
  isSyncing,
  isSynced,
  getChanges,
  isCreatedOnRemote,
} from './meta';

export {
  createManager,
  meta, // deprecated
  setMeta,
  getMeta,
  isSyncing,
  isSynced,
  getChanges,
  isCreatedOnRemote,
  stateSanitizer,
};
