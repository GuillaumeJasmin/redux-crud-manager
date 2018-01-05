import uniqid from 'uniqid';
import PubSub from 'pubsub-js';
import { isFetching, isCreated, isUpdated, isDeleted } from './selectors';
import { getIn, asArray } from './helpers';
import symbols from './symbols';

const filterKeysOne = (properties, include, exclude) => {
  const outputItems = {};

  if (include && include.length) {
    include.forEach((key) => {
      outputItems[key] = properties[key];
    });
  } else if (exclude && exclude.length) {
    Object.keys(properties)
      .filter(key => !exclude.includes(key))
      .forEach((key) => {
        outputItems[key] = properties[key];
      });
  } else {
    return properties;
  }

  return outputItems;
};

const filterKeys = (items, include, exclude) => (
  Array.isArray(items)
    ? items.map(item => filterKeysOne(item, include, exclude))
    : filterKeysOne(items, include, exclude)
);

/**
 * @param {Object} defaultConfig
 * @param {Object} actions
 */
export default (defaultConfig, actions) => {
  const { remoteActions, reducerPath } = defaultConfig;
  const publish = (eventName, data) => {
    PubSub.publish(`${defaultConfig.eventKey}.${eventName}`, data);
  };

  const argErrors = (key) => {
    console.error(`ReduxCRuDManager: ${key} is undefined in fetchAll(). You may forget to fetchAll()(dispatch, getState) in customActions ?`);
  };

  const outputActions = {
    fetchAll: (items, localConfig = {}) => (dispatch, getState) => {
      if (!dispatch) {
        argErrors('dispatch');
      }

      if (!getState) {
        argErrors('getState');
      }

      const config = {
        ...defaultConfig,
        ...localConfig,
        state: getState(),
      };

      publish('willFetchAll', items);

      if (items) {
        publish('willFetchLocal', items);
        return Promise.resolve(dispatch(actions.fetched(items, config)));
      }

      const state = getIn(getState(), reducerPath);

      if (isFetching(state)) return null;

      const existingItems = state;

      const enableCache = config.cache === true || (typeof config.cache === 'function' && config.cache(existingItems) === true);

      if (enableCache && existingItems.length > 0) return Promise.resolve(existingItems);

      dispatch(actions.fetching());

      publish('willFetchAllRemote', items);

      return remoteActions
        .fetchAll(null, config)
        .then(fetchedItems => (
          dispatch(actions.fetched(fetchedItems, config))
        ));
    },

    fetchOne: (itemId, localConfig = {}) => (dispatch, getState) => {
      const config = {
        ...defaultConfig,
        ...localConfig,
        state: getState(),
      };

      const state = getIn(getState(), config.reducerPath);

      publish('willFetchOne', itemId);

      if (isFetching(state)) return Promise.resolve(null);

      const item = state.find(_item => _item[defaultConfig.idKey] === itemId);

      const enableCache = config.cache === true || (typeof config.cache === 'function' && config.cache(item) === true);

      if (enableCache && item) {
        publish('willFetchOneLocal', itemId);
        return Promise.resolve(item);
      }

      dispatch(actions.fetching());

      publish('willFetchOneRemote', itemId);

      return remoteActions
        .fetchOne(itemId, config)
        .then(fetchedItem => (
          dispatch(actions.fetched(fetchedItem, config))
        ));
    },

    create: (data, localConfig = {}) => (dispatch) => {
      const config = {
        ...defaultConfig,
        ...localConfig,
      };

      const items = asArray(data);

      publish('willCreate', items);

      if (!config.remote) {
        const itemsWithLocalId = items.map(item => {
          if (item[config.idKey]) {
            throw new Error(`Redux Crud Manager: key '${config.idKey}' is not allowed for local items`);
          }

          const localId = uniqid(config.prefixLocalId);

          return {
            ...item,
            [config.idKey]: localId,
            [symbols.metadataKey]: { localId },
          };
        });

        publish('willCreateLocal', items);

        return Promise.resolve(dispatch(actions.createLocal(itemsWithLocalId, config)));
      }

      const itemsPropertiesFiltered = filterKeys(
        items,
        config.includeProperties,
        config.excludeProperties,
      );

      publish('willCreateRemote', items);

      return remoteActions
        .create(itemsPropertiesFiltered, config)
        .then(itemsCreated => (
          dispatch(actions.created(itemsCreated, config))
        ));
    },

    update: (data, localConfig = {}) => (dispatch) => {
      const config = {
        ...defaultConfig,
        ...localConfig,
      };

      const items = asArray(data);

      publish('willUpdate', items);

      if (!config.remote) {
        publish('willUpdateLocal', items);
        return Promise.resolve(dispatch(actions.updateLocal(items, config)));
      }

      if (config.showUpdatingProgress) {
        if (config.updateLocalBeforeRemote) {
          dispatch(actions.updating(items, config));
        } else {
          const itemsWithOnlyId = items.map(item => ({ [config.idKey]: item[config.idKey] }));
          dispatch(actions.updating(itemsWithOnlyId, config));
        }
      }

      const itemsPropertiesFiltered = filterKeys(
        items,
        config.includeProperties,
        config.excludeProperties,
      );

      publish('willUpdateRemote', items);

      return remoteActions
        .update(itemsPropertiesFiltered, config)
        .then(itemsUpdated => (
          dispatch(actions.updated(itemsUpdated, config))
        ));
    },

    delete: (data, localConfig = {}) => (dispatch) => {
      const config = {
        ...defaultConfig,
        ...localConfig,
      };

      const items = asArray(data);

      publish('willDelete', items);

      if (!config.remote) {
        publish('willDeleteLocal', items);
        return config.forceDelete
          ? dispatch(actions.deleted(items, config))
          : dispatch(actions.deleteLocal(items, config));
      }

      publish('willDeleteRemote', items);

      return remoteActions
        .delete(items, config)
        .then(() => (
          dispatch(actions.deleted(items, config))
        ));
    },

    sync: (localConfig = {}) => (dispatch, getState) => {
      const config = {
        ...defaultConfig,
        ...localConfig,
      };

      const state = getIn(getState(), reducerPath);

      const itemsToCreate = state.filter(item => !isCreated(item));
      const itemsToUpdate = state.filter(item => !isUpdated(item));
      const itemsToDelete = state.filter(item => isDeleted(item));

      const itemsToCreatePropertiesFiltered = itemsToCreate.length
        ? filterKeys(itemsToCreate, config.includeProperties, config.excludeProperties)
        : [];

      const itemsToUpdatePropertiesFiltered = itemsToUpdate.length
        ? filterKeys(itemsToUpdate, config.includeProperties, config.excludeProperties)
        : [];

      dispatch(actions.syncing({
        itemsToCreate: itemsToCreatePropertiesFiltered,
        itemsToUpdate: itemsToUpdatePropertiesFiltered,
        itemsToDelete,
      }));

      let createPromise;

      if (itemsToCreatePropertiesFiltered.length) {
        createPromise = Promise.all(itemsToCreatePropertiesFiltered.map(item => (
          remoteActions
            .create(item, config)
            .then(itemCreated => ({
              ...itemCreated,
              [symbols.metadataKey]: item[symbols.metadataKey],
            }))
        )));
      } else {
        createPromise = Promise.resolve([]);
      }

      const updatePromise = itemsToUpdatePropertiesFiltered.length
        ? remoteActions.update(itemsToUpdatePropertiesFiltered, config)
        : Promise.resolve([]);

      const deletePromise = itemsToDelete.length
        ? remoteActions.delete(itemsToDelete, config)
        : Promise.resolve([]);

      return Promise
        .all([createPromise, updatePromise, deletePromise])
        .then(([itemsCreated, itemsUpdated, itemsDeleted]) => {
          const syncSuccessActions = { itemsCreated, itemsUpdated, itemsDeleted };
          return dispatch(actions.synced(syncSuccessActions, config));
        });
    },

    clearMeta: () => actions.clearMeta(),
  };

  if (defaultConfig.customActions) {
    const customActionsObj = defaultConfig.customActions(outputActions);
    Object.entries(customActionsObj).forEach(([actionName, action]) => {
      if (outputActions[actionName] !== undefined) {
        console.error(`ReduxCRUDManager: custom actions '${actionName}' is not allowed, ${actionName} is a reserved actions. Change the name`);
      } else {
        outputActions[actionName] = action;
      }
    });
  }

  return outputActions;
};
