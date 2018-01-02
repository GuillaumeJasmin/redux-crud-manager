import symbols from './symbols';

export const isFetching = items => items[symbols.metadataKey].fetching;

// use for list or item
export const isSyncing = items => items[symbols.metadataKey].syncing;

// use for list or item
export const isSynced = items => items[symbols.metadataKey].synced;

// use for item
export const isCreated = (items) => {
  const meta = items[symbols.metadataKey];
  return meta.nextSync !== 'create';
};

// use for item
export const isUpdated = (items) => {
  const meta = items[symbols.metadataKey];
  return meta.nextSync !== 'update';
};

// use for item
export const isDeleted = (items) => {
  const meta = items[symbols.metadataKey];
  return !meta.synced && meta.nextSync === 'delete';
};
