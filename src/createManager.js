import PubSub from 'pubsub-js';
import uniqid from 'uniqid';
import createActions from './createActions';
import createActionCreators from './createActionCreators';
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
    ...defaultConfig,
    ...config,
    prefixReducer,
    scopeType,
  };

  const privateConfig = {
    prefixReducer,
    scopeType,
    eventKey: uniqid(),
  };

  const { actionCreators, actionReducers } = createActionCreators(privateConfig);

  const reducer = createReducer(finalConfig, privateConfig, actionReducers);
  const actions = createActions(finalConfig, privateConfig, actionCreators);

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
    // actionCreators,
    actions,
    subscribe,
    unsubscribe,
  };
};

export default createManager;
