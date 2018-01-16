import update from 'immutability-helper';
import { getMeta, setMeta, setMetadataForItems } from './meta';
import { metaKey } from './symbols';
import { throwError } from './helpers';
import { defaultMetaItems } from './defaultMeta';

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
  created: { preCreated: false },
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
 * @param {Object} defaultConfig
 * @param {Object} actionReducers
 */
export default (defaultConfig, actionReducers) => {
  /**
   * @param {Object} localConfig
   * @param {int}    localConfig.startIndex
   * @param {Object} state
   * @param {Object} data
   */
  const fetchAction = (state, items, localConfig = {}) => {
    const config = {
      ...defaultConfig,
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
        const index = state.findIndex(_item => _item[config.idKey] === item[config.idKey]);

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

  const createAction = (state, items, localConfig = {}) => {
    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    items.forEach(dataItem => {
      if (state.find(item => item[config.idKey] === dataItem[config.idKey])) {
        throwError(`item with ${config.idKey} ${dataItem[config.idKey]} already exist`);
      }
    });

    const newState = update(state, { $push: items });
    newState[metaKey] = state[metaKey];

    return newState;
  };

  const updateAction = (state, items, localConfig = {}) => {
    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const itemsToUpdate = {};

    items.forEach((item) => {
      const id = item[config.idKey];
      const { localId, localIdReplaceNeeded } = item[metaKey];
      let index;
      let newItem = item;

      if (localIdReplaceNeeded) {
        index = state.findIndex((_item) => _item[config.idKey] === localId);
        if (index === -1) {
          throwError(`item with localId '${localId}' is undefined`);
        }
        newItem = update(
          item,
          {
            [metaKey]: { $unset: ['localIdReplaceNeeded'] },
            [config.idKey]: { $set: id },
          },
        );
      } else {
        index = state.findIndex(_item => _item[config.idKey] === id);
        if (index === -1) {
          throwError(`item with id '${id}' is undefined`);
        }
      }

      if (config.merge) {
        itemsToUpdate[index] = {
          $set: {
            ...state[index],
            ...newItem,
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
        if (!item[defaultConfig.idKey]) {
          throwError('Delete params not valid');
        }
        return _state.findIndex(_item => _item[defaultConfig.idKey] === item[defaultConfig.idKey]);
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
      return setMeta(item, { lastVersion });
    })
  );

  const defaultState = [];

  defaultState[metaKey] = defaultMetaItems;

  const caseKeys = {};

  Object.entries(actionReducers).forEach(([key, value]) => {
    caseKeys[value] = key;
  });

  return (state = defaultState, action) => {
    if (action.scopeType !== defaultConfig.scopeType) return state;

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

    const listNeedSetMeta = ['fetched', 'preCreate', 'created', 'preUpdate', 'updating', 'preDelete', 'deleting', 'deleted'];
    const listNeddUpdateVersion = ['fetched', 'created', 'updated'];

    if (listNeedSetMeta.includes(actionReducersKey)) {
      items = setMetadataForItems(items, itemsMetas[actionReducersKey]);
    }

    if (listNeddUpdateVersion.includes(actionReducersKey)) {
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
        const newState = fetchAction(state, items, action.config);
        return setStateMeta(newState, nextStateMeta);
      }

      /**
       * _____________________________________________________________________________
       *
       *                                CREATE
       * _____________________________________________________________________________
       */
      case actionReducers.preCreate: {
        const newState = createAction(state, items, action.config);
        return setStateMeta(newState, nextStateMeta);
      }

      case actionReducers.created: {
        const newState = createAction(state, items, action.config);
        return setStateMeta(newState, nextStateMeta);
      }

      /**
       * _____________________________________________________________________________
       *
       *                                UPDATE
       *  ____________________________________________________________________________
       */
      case actionReducers.preUpdate: {
        const newState = updateAction(state, items, action.config);
        return setStateMeta(newState, nextStateMeta);
      }

      case actionReducers.updating: {
        const newState = updateAction(state, items, action.config);
        return setStateMeta(newState, nextStateMeta);
      }

      case actionReducers.updated: {
        const newState = updateAction(state, items, action.config);
        return setStateMeta(newState, nextStateMeta);
      }

      /**
       * _____________________________________________________________________________
       *
       *                                    DELETE
       * _____________________________________________________________________________
       */
      case actionReducers.preDelete: {
        const newState = updateAction(state, items, action.config);
        return setStateMeta(newState, nextStateMeta);
      }

      case actionReducers.deleting: {
        const newState = updateAction(state, items, action.config);
        return setStateMeta(newState, nextStateMeta);
      }

      case actionReducers.deleted: {
        const newState = deleteAction(state, items, action.config);
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

        outputState = updateAction(outputState, itemsToCreate, action.config);
        outputState = updateAction(outputState, itemsToUpdate, action.config);
        outputState = updateAction(outputState, itemsToDelete, action.config);

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
        outputState = updateAction(outputState, itemsCreated, action.config);
        outputState = updateAction(outputState, itemsUpdated, action.config);
        outputState = deleteAction(outputState, itemsDeleted, action.config);

        return setStateMeta(outputState, nextStateMeta);
      }

      case actionReducers.clear: {
        return defaultState;
      }

      case actionReducers.clearChanges: {
        const itemsToClear = items
          ? state.filter(_item => items.find(item => _item[defaultConfig.idKey] === item[defaultConfig.idKey]))
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

        let newState = updateAction(state, setMetadataForItems(itemsToUpdate, itemsMetas.clearChanges), action.config);
        newState = deleteAction(newState, setMetadataForItems(itemsToDelete, itemsMetas.clearChanges), action.config);
        return setStateMeta(newState, nextStateMeta);
      }

      default:

        return state;
    }
  };
};
