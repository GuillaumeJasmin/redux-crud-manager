import uniqid from 'uniqid';
import PubSub from 'pubsub-js';
import { getIn, asArray, throwError, consoleError } from './helpers';
import { metaKey, getMeta, getChanges } from './meta';
import events from './events';

const filterKeysOne = (properties, include, exclude) => {
  const outputItem = {
    [metaKey]: properties[metaKey],
  };

  if (include && include.length) {
    include.forEach((key) => {
      outputItem[key] = properties[key];
    });
  } else if (exclude && exclude.length) {
    Object.keys(properties)
      .filter(key => !exclude.includes(key))
      .forEach((key) => {
        outputItem[key] = properties[key];
      });
  } else {
    return properties;
  }

  return outputItem;
};

const filterKeys = (items, include, exclude) => (
  Array.isArray(items)
    ? items.map(item => filterKeysOne(item, include, exclude))
    : filterKeysOne(items, include, exclude)
);

/**
 * @param {Object} publicConfig
 * @param {Object} privateConfig
 * @param {Object} actions
 */
export default (publicConfig, privateConfig, actions) => {
  const { remoteActions, reducerPath, idKey } = publicConfig;
  const publish = (eventName, data) => {
    PubSub.publish(`${privateConfig.eventKey}.${eventName}`, data);
  };

  const dispatchMissing = (methodName) => {
    throwError(`dispatch is undefined in ${methodName}(). You may forget to dispatch(${methodName}()) in customActions ?`);
  };

  const fetchAll = (items, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('fetchAll');
    }

    const config = {
      ...publicConfig,
      ...localConfig,
      state: getState(),
    };

    publish(events.willFetchAll, { dispatch, getState });

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
      .then(fetchedItems => {
        const dispatchedAction = dispatch(actions.fetched(fetchedItems, config));
        publish(events.didFetchAll, { dispatch, getState, data: fetchedItems });
        return dispatchedAction;
      });
  };

  const fetchOne = (itemId, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('fetchOne');
    }

    const config = {
      ...publicConfig,
      ...localConfig,
      state: getState(),
    };

    const state = getIn(getState(), reducerPath);

    publish(events.willFetchOne, { dispatch, getState, data: itemId });

    if (getMeta(state).fetching) return Promise.resolve(null);

    const item = state.find(_item => _item[idKey] === itemId);

    const enableCache = config.cache === true || (typeof config.cache === 'function' && config.cache(item) === true);

    if (enableCache && item) {
      return Promise.resolve(item);
    }

    dispatch(actions.fetching());

    return remoteActions
      .fetchOne(itemId, config)
      .then(fetchedItem => {
        const dispatchedAction = dispatch(actions.fetched([fetchedItem], config));
        publish(events.didFetchOne, { dispatch, getState, data: fetchedItem });
        return dispatchedAction;
      });
  };

  /**
   *________________________________________________________________________________
   *
   *                              CREATE
   *________________________________________________________________________________
   */
  const preCreate = (data, localConfig) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('preCreate');
    }

    const config = {
      ...publicConfig,
      ...localConfig,
    };

    const items = asArray(data);

    const itemsWithLocalId = items.map(item => {
      if (item[idKey]) {
        throwError(`key '${idKey}' is not allowed in preCreate(). Remove it or use preUpdate()`);
      }

      const localId = uniqid(publicConfig.prefixLocalId);

      return {
        ...item,
        [idKey]: localId,
        [metaKey]: { localId },
      };
    });

    publish(events.willPreCreate, { dispatch, getState, data: items });
    const dispatchedAction = dispatch(actions.preCreate(itemsWithLocalId, config));
    publish(events.didPreCreate, { dispatch, getState, data: itemsWithLocalId });

    return dispatchedAction;
  };

  const create = (data, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('create');
    }

    const config = {
      ...publicConfig,
      ...localConfig,
    };

    const items = asArray(data);

    if (!config.remote) {
      items.forEach((item) => {
        if (!item[idKey]) {
          throwError(`'${idKey}' is required on the following object.
            \nIf you want to create a local item, use preCreate() instead of create().
            \n${JSON.stringify(item, null, 4)}
          `);
        }
      });

      publish(events.willCreate, { dispatch, getState, data: items });

      const promise = Promise.resolve(dispatch(actions.created(items, config)));
      publish(events.didCreate, { dispatch, getState, data: items });
      return promise;
    }

    dispatch(actions.creating());

    const itemsPropertiesFiltered = filterKeys(
      items,
      config.includeProperties,
      config.excludeProperties,
    );

    publish(events.willCreate, { dispatch, getState, data: items });

    return remoteActions
      .create(itemsPropertiesFiltered, config)
      .then(itemsCreated => {
        const dispatchedAction = dispatch(actions.created(itemsCreated, config));
        publish(events.didCreate, { dispatch, getState, data: itemsCreated });
        return dispatchedAction;
      });
  };


  /**
   *________________________________________________________________________________
   *
   *                              UPDATE
   *________________________________________________________________________________
   */
  const preUpdate = (data, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('preUpdate');
    }

    const config = {
      ...publicConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish(events.willPreUpdate, { dispatch, getState, data: items });

    const dispatchedAction = dispatch(actions.preUpdate(items, config));
    publish(events.didPreUpdate, { dispatch, getState, data: items });
    return dispatchedAction;
  };

  const update = (data, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('update');
    }

    const config = {
      ...publicConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish(events.willUpdate, { dispatch, getState, data: items });

    if (!config.remote) {
      const promise = Promise.resolve(dispatch(actions.updated(items, config)));
      publish(events.didUpdate, { dispatch, getState, data: items });
      return promise;
    }

    if (config.showUpdatingProgress) {
      dispatch(actions.updating(items, config));
      // if (config.updateLocalBeforeRemote) {
      //   dispatch(actions.updating(items, config));
      // } else {
      //   // const itemsWithOnlyId = items.map(item => ({ [idKey]: item[idKey] }));
      //   dispatch(actions.updating(items, config));
      // }
    }

    const itemsPropertiesFiltered = filterKeys(
      items,
      config.includeProperties,
      config.excludeProperties,
    );

    items.forEach(item => {
      const state = getIn(getState(), reducerPath);
      const itemFromState = state.find(_item => _item[idKey] === item[idKey]);
      if (item[idKey] === itemFromState[metaKey].localId) {
        throwError('update item on remote server is not allowed because item wasn\'t created');
      }
    });

    return remoteActions
      .update(itemsPropertiesFiltered, config)
      .then(itemsUpdated => {
        const dispatchedAction = dispatch(actions.updated(itemsUpdated, config));
        publish(events.didUpdate, { dispatch, getState, data: itemsUpdated });
        return dispatchedAction;
      });
  };

  const createFromItem = (data, localConfig = {}) => (dispatch) => {
    if (!dispatch) {
      dispatchMissing('createOrUpdate');
    }

    const config = {
      ...publicConfig,
      ...localConfig,
    };

    const items = asArray(data);

    items.forEach((item) => {
      if (!item[idKey]) {
        throwError(`item.${idKey} is undefined`);
      }

      if (item[idKey] !== item[metaKey].localId) {
        throwError(`item with ${idKey} '${item[idKey]}' is already created`);
      }
    });

    dispatch(actions.updating(items, config));

    return remoteActions.create(items.map(item => ({ ...item, [idKey]: undefined })))
      .then(itemsCreated => itemsCreated.map((itemCreated, index) => ({
        ...itemCreated,
        [metaKey]: {
          localId: items[index][metaKey].localId,
          localIdReplaceNeeded: true,
        },
      })))
      .then(itemsCreated => {
        dispatch(actions.updated(itemsCreated, config));
      });
  };


  /**
   *________________________________________________________________________________
   *
   *                              DELETE
   *________________________________________________________________________________
   */
  const preDelete = (data, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('preDelete');
    }

    const config = {
      ...publicConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish(events.willPreDelete, { dispatch, getState, data: items });

    const dispatchedAction = dispatch(actions.preDelete(items, config));
    publish(events.didPreDelete, { dispatch, getState, data: items });
    return dispatchedAction;
  };

  // unable to named 'delete' because it's a reserved word
  const deleteMethod = (data, localConfig = {}) => (dispatch, getState) => {
    if (!dispatch) {
      dispatchMissing('delete');
    }

    const config = {
      ...publicConfig,
      ...localConfig,
    };

    const items = asArray(data);

    publish(events.willDelete, { dispatch, getState, data: items });

    if (!config.remote) {
      const dispatchedAction = Promise.resolve(dispatch(actions.deleted(items, config)));
      publish(events.willDelete, { dispatch, getState, data: items });
      return dispatchedAction;
    }

    return remoteActions
      .delete(items, config)
      .then(() => {
        const dispatchedAction = dispatch(actions.deleted(items, config));
        publish(events.didDelete, { dispatch, getState, data: items });
        return dispatchedAction;
      });
  };

  const sync = (localConfig = {}) => (dispatch, getState) => {
    const config = {
      ...publicConfig,
      ...localConfig,
    };

    const state = getIn(getState(), reducerPath);

    // items to create
    const itemsToCreate = state
      .filter(item => {
        const { preCreated, preDeleted } = getMeta(item);
        return preCreated && !preDeleted;
      })
      .map(item => filterKeysOne(item, config.includeProperties, config.excludeProperties));

    // items to update
    const itemsToUpdate = state
      .filter(item => {
        const { preCreated, preUpdated, preDeleted } = getMeta(item);
        return !preCreated && preUpdated && !preDeleted;
      })
      .map(item => filterKeysOne(item, [idKey, ...getChanges(item)]))
      .map(item => filterKeysOne(item, config.includeProperties, config.excludeProperties));

    // items to delete
    const itemsToDelete = state
      .filter(item => {
        const { preCreated, preDeleted } = getMeta(item);
        return !preCreated && preDeleted;
      });

    dispatch(actions.syncing({
      itemsToCreate,
      itemsToUpdate,
      itemsToDelete,
    }));

    let createPromise;

    publish(events.willSync, { dispatch, getState, data: { itemsToCreate, itemsToUpdate, itemsToDelete } });

    if (itemsToCreate.length) {
      const itemsWithoutId = itemsToCreate.map(item => ({ ...item, [idKey]: undefined }));
      createPromise = remoteActions
        .create(itemsWithoutId, config)
        .then(items => (
          items.map((itemCreated, index) => {
            const prevItem = itemsToCreate[index];
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

    const updatePromise = itemsToUpdate.length
      ? remoteActions.update(itemsToUpdate, config)
      : Promise.resolve([]);

    const deletePromise = itemsToDelete.length
      ? remoteActions.delete(itemsToDelete, config).then(() => itemsToDelete)
      : Promise.resolve([]);

    return Promise
      .all([createPromise, updatePromise, deletePromise])
      .then(([itemsCreated, itemsUpdated, itemsDeleted]) => {
        const syncSuccessActions = { itemsCreated, itemsUpdated, itemsDeleted };
        const dispatchedAction = dispatch(actions.synced(syncSuccessActions, config));
        publish(events.didSync, { dispatch, getState, data: syncSuccessActions });
        return dispatchedAction;
      });
  };

  const clearChanges = (data) => (dispatch, getState) => {
    const items = data ? asArray(data) : null;
    publish(events.willClearChanges, { dispatch, getState });
    const dispatchedAction = dispatch(actions.clearChanges(items));
    publish(events.didClearChanges, { dispatch, getState });
    return dispatchedAction;
  };

  const clear = () => (dispatch, getState) => {
    publish(events.willClear, { dispatch, getState });
    const dispatchedAction = dispatch(actions.clear());
    publish(events.didClear, { dispatch, getState });
    return dispatchedAction;
  };

  const outputActions = {
    fetchAll,
    fetchOne,
    preCreate,
    create,
    creating: actions.creating,
    createFromItem,
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

  if (publicConfig.customActions) {
    const customActionsObj = publicConfig.customActions(outputActions, actions);
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
