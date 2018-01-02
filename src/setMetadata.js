import symbols from './symbols';
import { asArray } from './helpers';

export const setMetadata = (item, dataState) => ({
  [symbols.metadataKey]: {
    syncing: false,
    synced: false,
    nextSync: (item[symbols.metadataKey] && item[symbols.metadataKey].nextSync) || null,
    lastLocalUpdate: null,
    lastRemoteUpdate: null,
    localId: item[symbols.metadataKey] && item[symbols.metadataKey].localId,
    ...dataState,
  },
});

export const setMetadataForItems = (items, data) =>
  asArray(items).map(item => ({
    ...item,
    ...setMetadata(item, data),
  }));
