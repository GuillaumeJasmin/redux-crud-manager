import { metaKey } from './symbols';
import { defaultMetaItems, defaultMetaItem } from './defaultMeta';
import { asArray } from './helpers';

export const getMeta = data => data[metaKey];

export const meta = (data) => {
  console.warn('ReduxCRUDManager meta() is deprecated. Use getMeta() instead');
  return getMeta(data);
};

export const setMeta = (_data, metaIncoming) => {
  const data = _data;
  const oldMeta = data[metaKey] || {};
  const newMeta = { ...oldMeta, ...metaIncoming };
  data[metaKey] = newMeta;
  return data;
};

export const setCustomMeta = (data, metaIncoming) => {
  const defaultMeta = Array.isArray(data) ? defaultMetaItems : defaultMetaItem;
  const nextMeta = {};
  Object.entries(metaIncoming).forEach(([key, value]) => {
    if (defaultMeta[key] !== undefined) {
      console.error(`ReduxCRUDManager: meta '${key}' is a reserved property. Use another key`);
    } else {
      nextMeta[key] = value;
    }
  });
  return setMeta(data, nextMeta);
};

export const setMetadataForItems = (items, _meta) =>
  asArray(items).map(item => ({
    ...item,
    ...setMeta(item, _meta),
  }));

export const isSyncing = (data) => {
  const { creating, updating, deleting } = getMeta(data);
  return creating || updating || deleting;
};

export const isSynced = (data) => {
  const { preCreated, preUpdated, preDeleted } = getMeta(data);
  return !preCreated && !preUpdated && !preDeleted;
};

export const getChanges = (item) => {
  const { lastVersion } = item[metaKey];
  const changes = [];
  Object.keys(item).forEach((key) => {
    if (item[key] !== lastVersion[key]) {
      changes.push(key);
    }
  });

  Object.keys(lastVersion).forEach((key) => {
    if (item[key] !== lastVersion[key]) {
      if (!changes.find(_key => _key === key)) {
        changes.push(key);
      }
    }
  });

  return changes;
};

export const isCreatedOnRemote = (item) => item.id !== getMeta(item).localId;
