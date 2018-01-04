import symbols from './symbols';
import { defaultMetaItems, defaultMetaItem } from './defaultMeta';
import { asArray } from './helpers';

export const getMeta = data => data[symbols.metadataKey];

export const meta = (data) => {
  console.warn('ReduxCRUDManager meta() is deprecated. Use getMeta() instead');
  return getMeta(data);
};

export const setMeta = (_data, metaIncoming) => {
  const data = _data;
  const oldMeta = data[symbols.metadataKey] || {};
  const newMeta = { ...oldMeta, ...metaIncoming };
  data[symbols.metadataKey] = newMeta;
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
