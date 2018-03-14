import PubSub from 'pubsub-js';
import uniqid from 'uniqid';
import createActions from './createActions';
import createActionsV2 from './createActionsV2';
import createActionCreators from './createActionCreators';
import createGetActionsWithLinkedManagers from './linkedManagers';
import createReducer from './createReducer';
import defaultConfig from './defaultConfig';

/**
 * Create Manager
 *
 * @param {Object}   config
 * @param {Object}   config.remoteActions
 * @param {Object}   config.customActions
 * @param {Object}   config.listeners
 * @param {string[]} config.reducerPath
 * @param {string}   config.idKey=id
 * @param {boolean}  config.cache=false
 * @param {boolean}  config.merge=true
 * @param {boolean}  config.remote=false
 * @param {boolean}  config.showUpdatingProgress=true
 * @param {string}   config.prefixLocalId=local-
 * @param {string[]} config.includeProperties
 * @param {string[]} config.excludeProperties
 *
 */
const createManager = (config) => {
  const reducerKey = config.reducerPath.map(item => item.toUpperCase()).join('_');
  const prefixReducer = `REDUX_CRUD_MANAGER___${reducerKey}`;
  const scopeType = Symbol(prefixReducer);

  const finalConfig = {
    enableLinkedManagers: !!config.linkedManagers,
    ...defaultConfig,
    ...config,
  };

  const privateConfig = {
    prefixReducer,
    scopeType,
    eventKey: uniqid(),
  };

  const getActionsWithLinkedManagers = createGetActionsWithLinkedManagers(finalConfig);

  const { actionCreators, actionReducers } = createActionCreators(privateConfig);

  const reducer = createReducer(finalConfig, privateConfig, actionReducers);
  const actions = finalConfig.remoteActions
    ? createActions(finalConfig, privateConfig, actionCreators, getActionsWithLinkedManagers)
    : createActionsV2(finalConfig, privateConfig, actionCreators, getActionsWithLinkedManagers);

  const subscribe = (eventName, cb) => {
    const token = PubSub.subscribe(`${privateConfig.eventKey}.${eventName}`, (msg, data) => cb(data));
    return () => PubSub.unsubscribe(token);
  };

  const unsubscribe = (eventName) => {
    if (eventName) {
      PubSub.unsubscribe(`${privateConfig.eventKey}.${eventName}`);
    } else {
      PubSub.unsubscribe(privateConfig.eventKey);
    }
  };

  return {
    reducer,
    actions,
    internalsActions: actionCreators,
    subscribe,
    unsubscribe,
    config: finalConfig,
    _setManagers: (managers) => { privateConfig.managers = managers; },
  };
};

export default createManager;
