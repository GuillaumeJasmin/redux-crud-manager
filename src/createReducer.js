import update from 'immutability-helper';
import { setMeta, setMetadataForItems } from './meta';
import symbols from './symbols';
import { asArray } from './helpers';

const setMetadataState = (state, meta) => setMeta(state.slice(), meta);

const localActions = { synced: false, syncing: false, fetching: false };
const pendingActions = { synced: false, syncing: true, fetching: false };
const successActions = { synced: true, syncing: false, fetching: false };

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

  const createAction = (state, data, localConfig = {}) => {
    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const items = asArray(data);

    items.forEach(dataItem => {
      if (state.find(item => item[config.idKey] === dataItem[config.idKey])) {
        throw new Error(`ReduxCRUDSync: item with id ${dataItem[config.idKey]} already exist`);
      }
    });

    const newState = update(state, { $push: items });
    newState[symbols.metadataKey] = state[symbols.metadataKey];

    return newState;
  };

  const updateAction = (state, data, localConfig = {}) => {
    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const items = asArray(data);

    const itemsToUpdate = {};

    items.forEach((item) => {
      const id = item[config.idKey];
      const { localId } = item[symbols.metadataKey];
      let index;
      let newItem = item;

      if (localId) {
        index = state.findIndex(_item => _item[symbols.metadataKey].localId === localId);
        if (index === -1) {
          throw new Error(`Redux Crud Manager: item with localId '${localId}' is undefined`);
        }
        newItem = update(
          item,
          {
            [symbols.metadataKey]: { localId: { $set: null } },
            [config.idKey]: { $set: id },
          },
        );
      } else {
        index = state.findIndex(_item => _item[config.idKey] === id);
        if (index === -1) {
          throw new Error(`Redux Crud Manager: item with id '${id}' is undefined`);
        }
      }

      if (config.merge) {
        itemsToUpdate[index] = { $set: { ...state[index], ...newItem } };
      } else {
        itemsToUpdate[index] = { $set: newItem };
      }
    });

    return update(state, itemsToUpdate);
  };

  const deleteAction = (_state, data) => {
    const incomeItems = asArray(data);

    const indexes = incomeItems
      .map(item => (
        _state.findIndex(_item => _item[defaultConfig.idKey] === item[defaultConfig.idKey])
      )).sort((a, b) => {
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

  const defaultState = [];

  defaultState[symbols.metadataKey] = {
    fetching: false,
    fetched: false,
    syncing: false,
    synced: false,
  };

  return (state = defaultState, action) => {
    const oldMeta = state[symbols.metadataKey];
    const newMeta = (action.data && action.data[symbols.metadataKey]) || {};
    let stateMeta = { ...oldMeta, ...newMeta };
    switch (action.type) {
      /**
       * FETCH
       */
      case actionReducers.fetching: {
        return setMetadataState(state, { fetching: true });
      }

      case actionReducers.fetched: {
        const itemsMeta = { ...successActions, nextSync: null };
        const items = setMetadataForItems(action.data, itemsMeta);
        const newState = fetchAction(state, items, action.config);
        stateMeta = { ...stateMeta, ...successActions, fetched: true };
        return setMetadataState(newState, stateMeta);
      }

      /**
       * CREATE
       */
      case actionReducers.createLocal: {
        const itemsMeta = { ...localActions, nextSync: 'create' };
        const items = setMetadataForItems(action.data, itemsMeta);
        const newState = createAction(state, items, action.config);
        stateMeta = { ...stateMeta, ...localActions };
        return setMetadataState(newState, stateMeta);
      }

      case actionReducers.created: {
        const itemsMeta = { ...successActions, nextSync: null };
        const items = setMetadataForItems(action.data, itemsMeta);
        const newState = createAction(state, items, action.config);
        stateMeta = { ...stateMeta, ...successActions };
        return setMetadataState(newState, stateMeta);
      }

      /**
       * UPDATE
       */
      case actionReducers.updateLocal: {
        const itemsMeta = { ...localActions, nextSync: 'update' };
        const items = setMetadataForItems(action.data, itemsMeta);
        const newState = updateAction(state, items, action.config);
        stateMeta = { ...stateMeta, ...localActions };
        return setMetadataState(newState, stateMeta);
      }

      case actionReducers.updating: {
        const itemsforKeys = asArray(action.data);
        const keys = itemsforKeys
          .map(item => Object.keys(item).filter(key => key !== defaultConfig.idKey))
          .reduce((a, b) => [...a, ...b]);
        const keysUnique = Array.unique(keys);

        const itemsMeta = { ...pendingActions, nextSync: 'update', keys: keysUnique };
        const items = setMetadataForItems(action.data, itemsMeta);
        const newState = updateAction(state, items, action.config);
        stateMeta = { ...stateMeta, ...pendingActions };
        return setMetadataState(newState, stateMeta);
      }

      case actionReducers.updated: {
        const itemsMeta = { ...successActions, nextSync: null, keys: null };
        const items = setMetadataForItems(action.data, itemsMeta);
        const newState = updateAction(state, items, action.config);
        stateMeta = { ...stateMeta, ...successActions };
        return setMetadataState(newState, stateMeta);
      }

      /**
       * DELETE
       */
      case actionReducers.deleteLocal: {
        const itemsMeta = { ...localActions, nextSync: 'delete', deleted: true };
        const items = setMetadataForItems(action.data, itemsMeta);
        const newState = updateAction(state, items, action.config);
        stateMeta = { ...stateMeta, ...localActions };
        return setMetadataState(newState, stateMeta);
      }

      case actionReducers.deleting: {
        const itemsMeta = { ...pendingActions, nextSync: 'delete', deleted: true };
        const items = setMetadataForItems(action.data, itemsMeta);
        const newState = updateAction(state, items, action.config);
        stateMeta = { ...stateMeta, ...pendingActions };
        return setMetadataState(newState, stateMeta);
      }

      case actionReducers.deleted: {
        const itemsMeta = { ...successActions, nextSync: null };
        const items = setMetadataForItems(action.data, itemsMeta);
        const newState = deleteAction(state, items, action.config);
        stateMeta = { ...stateMeta, ...successActions };
        return setMetadataState(newState, stateMeta);
      }

      /**
       * SYNC
       */
      case actionReducers.syncing: {
        const itemsToCreate = setMetadataForItems(
          action.data.itemsToCreate,
          { ...pendingActions, nextSync: 'create' },
        );

        const itemsToUpdate = setMetadataForItems(
          action.data.itemsToUpdate,
          { ...pendingActions, nextSync: 'update' },
        );

        const itemsToDelete = setMetadataForItems(
          action.data.itemsToDelete,
          { ...pendingActions, deleted: true, nextSync: 'delete' },
        );

        let outputState = state;

        outputState = updateAction(outputState, itemsToCreate, action.config);
        outputState = updateAction(outputState, itemsToUpdate, action.config);
        outputState = updateAction(outputState, itemsToDelete, action.config);

        return setMetadataState(outputState, pendingActions);
      }

      case actionReducers.synced: {
        const itemsCreated = setMetadataForItems(
          action.data.itemsCreated,
          { ...successActions, nextSync: null },
        );

        const itemsUpdated = setMetadataForItems(
          action.data.itemsUpdated,
          { ...successActions, nextSync: null },
        );

        const itemsDeleted = setMetadataForItems(
          action.data.itemsDeleted,
          { ...successActions, deleted: true, nextSync: null },
        );

        let outputState = state;

        outputState = updateAction(outputState, itemsCreated, action.config);
        outputState = updateAction(outputState, itemsUpdated, action.config);
        outputState = deleteAction(outputState, itemsDeleted, action.config);

        stateMeta = { ...stateMeta, ...successActions };

        return setMetadataState(outputState, stateMeta);
      }

      default:

        return state;
    }
  };
};

