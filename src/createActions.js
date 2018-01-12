import uniqid from 'uniqid';
import PubSub from 'pubsub-js';
import { getIn, asArray, throwError, consoleError } from './helpers';
import { metaKey } from './symbols';
import { getMeta } from './meta';
import { defaultMetaItem } from './defaultMeta';

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

  const dispatchMissing = (methodName) => {
    throwError(`dispatch is undefined in ${methodName}(). You may forget to dispatch(${methodName}()) in customActions ?`);
  };

  const fetchAll = (items, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('fetchAll');
    }

    const config = {
      ...defaultConfig,
      ...localConfig,
      state: getState(),
    };

    publish('willFetchAll');

    if (items) {
      return Promise.resolve(dispatch(actions.fetched(items, config)));
    }

    const state = getIn(getState(), reducerPath);

    if (getMeta(state).fetching) return null;

    const existingItems = state;

    const enableCache = config.cache === true || (typeof config.cache === 'function' && config.cache(existingItems) === true);

    if (enableCache && existingItems.length > 0) return Promise.resolve(existingItems);

    dispatch(actions.fetching());

    return remoteActions
      .fetchAll(null, config)
      .then(fetchedItems => (
        dispatch(actions.fetched(fetchedItems, config))
      ));
  };

  const fetchOne = (itemId, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('fetchOne');
    }

    const config = {
      ...defaultConfig,
      ...localConfig,
      state: getState(),
    };

    const state = getIn(getState(), config.reducerPath);

    publish('willFetchOne', itemId);

    if (getMeta(state).fetching) return Promise.resolve(null);

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
  };

  const preCreate = (data, localConfig) => dispatch => {
    if (!dispatch) {
      dispatchMissing('preCreate');
    }

    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish('willPreCreate', items);

    const itemsWithLocalId = items.map(item => {
      if (item[config.idKey]) {
        throwError(`key '${config.idKey}' is not allowed for local items`);
      }

      const localId = uniqid(config.prefixLocalId);

      return {
        ...item,
        [config.idKey]: localId,
        [metaKey]: { localId },
      };
    });

    return Promise.resolve(dispatch(actions.preCreate(itemsWithLocalId, config)));
  };

  const create = (data, localConfig = {}) => (dispatch) => {
    if (!dispatch) {
      dispatchMissing('create');
    }

    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish('willCreate', items);

    if (!config.remote) {
      items.forEach((item) => {
        if (!item[config.idKey]) {
          throwError(`'${config.idKey}' is required on the following object.
            \nIf you want to create a local item, use preCreate() instead of create().
            \n${JSON.stringify(item, null, 4)}
          `);
        }
      });

      return Promise.resolve(dispatch(actions.created(items, config)));
    }

    const itemsPropertiesFiltered = filterKeys(
      items,
      config.includeProperties,
      config.excludeProperties,
    );

    return remoteActions
      .create(itemsPropertiesFiltered, config)
      .then(itemsCreated => (
        dispatch(actions.created(itemsCreated, config))
      ));
  };

  const preUpdate = (data, localConfig = {}) => (dispatch) => {
    if (!dispatch) {
      dispatchMissing('preUpdate');
    }

    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish('willPreUpdate', items);

    return Promise.resolve(dispatch(actions.preUpdate(items, config)));
  };

  const update = (data, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('update');
    }

    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish('willUpdate', items);

    if (!config.remote) {
      return Promise.resolve(dispatch(actions.updated(items, config)));
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

    items.forEach(item => {
      const state = getIn(getState(), config.reducerPath);
      const itemFromState = state.find(_item => _item[config.idKey] === item[config.idKey]);
      if (item[config.idKey] === itemFromState[metaKey].localId) {
        throwError('update item on remote server is not allowed because item wasn\'t created');
      }
    });

    return remoteActions
      .update(itemsPropertiesFiltered, config)
      .then(itemsUpdated => (
        dispatch(actions.updated(itemsUpdated, config))
      ));
  };

  const preDelete = (data, localConfig = {}) => (dispatch) => {
    if (!dispatch) {
      dispatchMissing('preDelete');
    }

    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish('willPreDelete', items);

    return dispatch(actions.preDelete(items, config));
  };

  // unable to named 'delete' because it's a reserved word
  const deleteMethod = (data, localConfig = {}) => (dispatch) => {
    if (!dispatch) {
      dispatchMissing('delete');
    }

    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish('willDelete', items);

    if (!config.remote) {
      return dispatch(actions.deleted(items, config));
    }

    return remoteActions
      .delete(items, config)
      .then(() => (
        dispatch(actions.deleted(items, config))
      ));
  };

  const sync = (localConfig = {}) => (dispatch, getState) => {
    const config = {
      ...defaultConfig,
      ...localConfig,
    };

    const state = getIn(getState(), reducerPath);

    const itemsToCreate = state.filter(item => getMeta(item).preCreated);
    const itemsToUpdate = state.filter(item => getMeta(item).preUpdated);
    const itemsToDelete = state.filter(item => getMeta(item).preDeleted);

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
      const itemsWithoutId = itemsToCreatePropertiesFiltered.map(item => ({ ...item, [defaultConfig.idKey]: undefined }));
      createPromise = remoteActions
        .create(itemsWithoutId, config)
        .then(items => (
          items.map((itemCreated, index) => {
            const prevItem = itemsToCreatePropertiesFiltered[index];
            return {
              ...itemCreated,
              [metaKey]: {
                localId: prevItem[metaKey].localId,
                localIdReplaceNeeded: true,
              },
            };
          })
        ));
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
  };

  const clearChanges = (data) => {
    const items = data ? asArray(data) : null;
    return actions.clearChanges(items);
  };

  const clear = () => actions.clear();

  const outputActions = {
    fetchAll,
    fetchOne,
    preCreate,
    create,
    creating: actions.creating,
    preUpdate,
    updating: actions.updating,
    update,
    preDelete,
    deleting: actions.deleting,
    delete: deleteMethod,
    sync,
    clear,
    clearChanges,
  };

  if (defaultConfig.customActions) {
    const customActionsObj = defaultConfig.customActions(outputActions);
    Object.entries(customActionsObj).forEach(([actionName, action]) => {
      if (outputActions[actionName] !== undefined) {
        consoleError(`ReduxCRUDManager: custom actions '${actionName}' is not allowed, ${actionName} is a reserved actions. Change the name`);
      } else {
        outputActions[actionName] = action;
      }
    });
  }

  return outputActions;
};
