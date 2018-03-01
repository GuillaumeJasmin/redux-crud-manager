import update from 'immutability-helper';
import { metaKey, getMeta, setMeta, setMetadataForItems } from './meta';
import { throwError } from './helpers';
import { defaultMetaList } from './defaultMeta';

const setStateMeta = (state, meta) => setMeta(state.slice(), meta);

const itemsMetas = {
  fetched: {},
  preCreate: { preCreated: true },
  created: { preCreated: false },
  preUpdate: { preUpdated: true },
  updating: { updating: true },
  updated: { updating: false, preUpdated: false },
  preDelete: { preDeleted: true },
  deleting: { deleting: true },
  deleted: { deleting: false, preDeleted: false },
  synced: {
    preCreated: false,
    creating: false,
    preUpdated: false,
    updating: false,
    preDeleted: false,
    deleting: false,
  },
  clearChanges: {
    preCreated: false,
    preUpdated: false,
    preDeleted: false,
  },
};

const stateMetas = {
  fetching: { fetching: true },
  fetched: { fetching: false, fetched: true },
  preCreate: { preCreated: true },
  creating: { creating: true },
  created: { preCreated: false, creating: false },
  preUpdate: { preUpdated: true },
  updating: { updating: true },
  updated: { updating: false, preUpdated: false },
  preDelete: { preDeleted: true },
  deleting: { deleting: true },
  deleted: { deleting: false, preDeleted: false },
  syncing: { }, // defined in the case block
  synced: {
    preCreated: false,
    creating: false,
    preUpdated: false,
    updating: false,
    preDeleted: false,
    deleting: false,
  },
  clearChanges: {
    preCreated: false,
    preUpdated: false,
    preDeleted: false,
  },
};

/**
 * @param {Object} publicConfig
 * @param {Object} privateConfig
 * @param {Object} actionReducers
 */
export default (publicConfig, privateConfig, actionReducers) => {
  const { idKey } = publicConfig;

  /**
   * @param {Object} localConfig
   * @param {int}    localConfig.startIndex
   * @param {Object} state
   * @param {Object} data
   */
  const fetchAction = (state, items, localConfig = {}) => {
    const config = {
      ...publicConfig,
      ...localConfig,
    };

    if (config.replace) {
      return items;
    }

    let newState;

    if (typeof config.startIndex === 'number') {
      const itemsToUpdate = {};
      items.forEach((item, index) => {
        const nextIndex = config.startIndex + index;
        itemsToUpdate[nextIndex] = { $set: item };
      });

      newState = update(state, itemsToUpdate);
    } else {
      const itemsToUpdate = {};
      const itemToAdd = [];

      items.forEach((item) => {
        const index = state.findIndex(_item => _item[idKey] === item[idKey]);

        if (index !== -1) {
          itemsToUpdate[index] = { $set: item };
        } else {
          itemToAdd.push(item);
        }
      });

      newState = update(state, { $push: itemToAdd });
      newState = update(newState, itemsToUpdate);
    }

    return newState;
  };

  const createAction = (state, items) => {
    items.forEach(dataItem => {
      if (state.find(item => item[idKey] === dataItem[idKey])) {
        throwError(`item with ${idKey} ${dataItem[idKey]} already exist`);
      }
    });

    const newState = update(state, { $push: items });
    newState[metaKey] = state[metaKey];

    return newState;
  };

  const updateAction = (state, items, localConfig = {}) => {
    const config = {
      ...publicConfig,
      ...localConfig,
    };

    const itemsToUpdate = {};

    items.forEach((item) => {
      const id = item[idKey];
      const { localId, localIdReplaceNeeded } = item[metaKey];
      let index;
      let newItem = item;

      if (localIdReplaceNeeded) {
        index = state.findIndex((_item) => _item[idKey] === localId);
        if (index === -1) {
          throwError(`item with localId '${localId}' is undefined`);
        }
        newItem = update(
          item,
          {
            [metaKey]: { $unset: ['localIdReplaceNeeded'] },
            [idKey]: { $set: id },
          },
        );
      } else {
        index = state.findIndex(_item => _item[idKey] === id);
        if (index === -1) {
          throwError(`item with id '${id}' is undefined`);
        }
      }

      if (config.merge) {
        const deepKeys = {};
        if (config.deepMerge) {
          config.deepMerge.forEach((key) => {
            deepKeys[key] = {
              ...state[index][key],
              ...newItem[key],
            };
          });
        }

        itemsToUpdate[index] = {
          $set: {
            ...state[index],
            ...newItem,
            ...deepKeys,
            [metaKey]: {
              ...state[index][metaKey],
              ...newItem[metaKey],
            },
          },
        };
      } else {
        itemsToUpdate[index] = { $set: newItem };
      }
    });

    return update(state, itemsToUpdate);
  };

  const deleteAction = (_state, items) => {
    const indexes = items
      .map(item => {
        if (!item[idKey]) {
          throwError('Delete params not valid');
        }
        return _state.findIndex(_item => _item[idKey] === item[idKey]);
      }).sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

    let state = _state;

    for (let i = indexes.length - 1; i >= 0; i -= 1) {
      state = update(state, { $splice: [[indexes[i], 1]] });
    }

    return state;
  };

  const updateLastVersion = (items) => (
    items.map((item) => {
      const lastVersion = update(item, { $unset: [metaKey] });
      return setMeta(item, { lastVersion, syncingVersion: null });
    })
  );

  const updateSyncingVersion = (state, syncingItems, config) => {
    if (config.updateLocalBeforeRemote) {
      return syncingItems.map((syncingItem) => {
        const syncingVersion = update(syncingItem, { $unset: [metaKey] });
        return setMeta(syncingItem, { ...syncingItem[metaKey], syncingVersion });
      });
    }

    return syncingItems.map((syncingItem) => {
      const defaultItem = state.find(item => item[idKey] === syncingItem[idKey]);
      const syncingVersion = update(syncingItem, { $unset: [metaKey] });
      return setMeta(defaultItem, { ...syncingItem[metaKey], syncingVersion });
    });
  };

  const defaultState = [];
  defaultState[metaKey] = defaultMetaList;

  const caseKeys = {};

  Object.entries(actionReducers).forEach(([key, value]) => {
    caseKeys[value] = key;
  });

  return (state = defaultState, action) => {
    if (action.scopeType !== publicConfig.scopeType) return state;

    const actionConfig = action.config || {};

    // fetching, fetched, preCreate...
    const actionReducersKey = caseKeys[action.type];
    let items = action.data;

    if (!['syncing', 'synced'].includes(actionReducersKey)) {
      if (items && !Array.isArray(items)) {
        throwError('action.data in reducer must be an array');
      }
    }

    // make possible to customize meta
    const oldMeta = state[metaKey];
    const newMeta = (action.data && action.data[metaKey]) || {};
    const nextStateMeta = { ...oldMeta, ...newMeta, ...stateMetas[actionReducersKey] };

    const listNeedSetMeta = ['fetched', 'preCreate', 'created', 'preUpdate', 'updating', 'updated', 'preDelete', 'deleting', 'deleted'];
    const listNeedUpdateVersion = ['fetched', 'created', 'updated'];

    if (listNeedSetMeta.includes(actionReducersKey)) {
      items = setMetadataForItems(items, itemsMetas[actionReducersKey]);
    }

    if (listNeedUpdateVersion.includes(actionReducersKey)) {
      items = updateLastVersion(items);
    }

    switch (action.type) {
      /**
       * _____________________________________________________________________________
       *
       *                                FETCH
       * _____________________________________________________________________________
       */
      case actionReducers.fetching: {
        return setStateMeta(state, nextStateMeta);
      }

      case actionReducers.fetched: {
        const newState = fetchAction(state, items, actionConfig);
        return setStateMeta(newState, nextStateMeta);
      }

      /**
       * _____________________________________________________________________________
       *
       *                                CREATE
       * _____________________________________________________________________________
       */

      case actionReducers.creating: {
        return setStateMeta(state, nextStateMeta);
      }

      case actionReducers.preCreate:
      case actionReducers.created: {
        const newState = createAction(state, items, actionConfig);
        return setStateMeta(newState, nextStateMeta);
      }

      /**
       * _____________________________________________________________________________
       *
       *                                UPDATE
       *  ____________________________________________________________________________
       */
      case actionReducers.updating: {
        items = updateSyncingVersion(state, items, actionConfig);
        const newState = updateAction(state, items, actionConfig);
        return setStateMeta(newState, nextStateMeta);
      }

      case actionReducers.preUpdate:
      case actionReducers.updated:
      case actionReducers.preDelete:
      case actionReducers.deleting: {
        const newState = updateAction(state, items, actionConfig);
        return setStateMeta(newState, nextStateMeta);
      }

      case actionReducers.deleted: {
        const newState = deleteAction(state, items, actionConfig);
        return setStateMeta(newState, nextStateMeta);
      }

      /**
       * _____________________________________________________________________________
       *
       *                                    SYNC
       * _____________________________________________________________________________
       */
      case actionReducers.syncing: {
        let { itemsToCreate, itemsToUpdate, itemsToDelete } = action.data;
        itemsToCreate = setMetadataForItems(itemsToCreate, { creating: true });
        itemsToUpdate = setMetadataForItems(itemsToUpdate, { updating: true });
        itemsToDelete = setMetadataForItems(itemsToDelete, { deleting: true });

        let outputState = state;

        outputState = updateAction(outputState, itemsToCreate, actionConfig);
        outputState = updateAction(outputState, itemsToUpdate, actionConfig);
        outputState = updateAction(outputState, itemsToDelete, actionConfig);

        const syncingStateMeta = {
          ...nextStateMeta,
          creating: !!itemsToCreate.length,
          updating: !!itemsToUpdate.length,
          deleting: !!itemsToDelete.length,
        };

        return setStateMeta(outputState, syncingStateMeta);
      }

      case actionReducers.synced: {
        let { itemsCreated, itemsUpdated, itemsDeleted } = action.data;
        itemsCreated = setMetadataForItems(itemsCreated, itemsMetas.synced);
        itemsUpdated = setMetadataForItems(itemsUpdated, itemsMetas.synced);
        itemsDeleted = setMetadataForItems(itemsDeleted, itemsMetas.synced);
        const itemsPreCreatedAndPreDeleted = state
          .filter(item => {
            const { preCreated, preDeleted } = getMeta(item);
            return preCreated && preDeleted;
          });
        itemsDeleted = [...itemsDeleted, ...itemsPreCreatedAndPreDeleted];

        itemsCreated = updateLastVersion(itemsCreated);
        itemsUpdated = updateLastVersion(itemsUpdated);

        let outputState = state;
        outputState = updateAction(outputState, itemsCreated, actionConfig);
        outputState = updateAction(outputState, itemsUpdated, actionConfig);
        outputState = deleteAction(outputState, itemsDeleted, actionConfig);

        return setStateMeta(outputState, nextStateMeta);
      }

      case actionReducers.clear: {
        return defaultState;
      }

      case actionReducers.clearChanges: {
        const itemsToClear = items
          ? state.filter(_item => items.find(item => _item[idKey] === item[idKey]))
          : state;

        const itemsToUpdate = itemsToClear
          .filter(item => {
            const { preCreated, preUpdated, preDeleted } = getMeta(item);
            return !preCreated && preUpdated && !preDeleted;
          })
          .map((item) => {
            const { lastVersion } = getMeta(item);
            return update(item, { $set: { ...lastVersion, [metaKey]: { localId: item[metaKey].localId } } });
          });

        const itemsToDelete = itemsToClear
          .filter(item => {
            const { preCreated } = getMeta(item);
            return preCreated;
          });

        let newState = updateAction(state, setMetadataForItems(itemsToUpdate, itemsMetas.clearChanges), actionConfig);
        newState = deleteAction(newState, setMetadataForItems(itemsToDelete, itemsMetas.clearChanges), actionConfig);
        return setStateMeta(newState, nextStateMeta);
      }

      default:
        return state;
    }
  };
};
