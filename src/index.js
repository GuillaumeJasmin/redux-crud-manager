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
  syncingKeys,
} from './meta';
import events from './events';
import getReducers from './injectLinkedManagers';

export {
  createManager,
  meta, // deprecated
  setMeta,
  getMeta,
  isSyncing,
  isSynced,
  getChanges,
  isCreatedOnRemote,
  syncingKeys,
  stateSanitizer,
  events,
  getReducers,
};
