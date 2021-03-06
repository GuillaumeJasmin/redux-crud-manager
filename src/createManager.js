import PubSub from 'pubsub-js';
import createActions from './createActions';
import createActionCreators from './createActionCreators';
import createReducer from './createReducer';
import defaultConfig from './defaultConfig';

/**
 * Create Manager
 *
 * @param {Object}   config
 * @param {Object}   config.remoteActions
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
const createManager = (_config) => {
  const config = {
    ...defaultConfig,
    ..._config,
  };

  const { actionCreators, actionReducers } = createActionCreators(config);

  const reducer = createReducer(config, actionReducers);

  const actions = createActions(config, actionCreators);

  const subscribe = (eventName, cb) => {
    PubSub.subscribe(`${defaultConfig.eventKey}.${eventName}`, (msg, data) => cb(data));
  };

  const unsubscribe = (eventName) => {
    if (eventName) {
      PubSub.unsubscribe(`${defaultConfig.eventKey}.${eventName}`);
    } else {
      PubSub.unsubscribe(defaultConfig.eventKey);
    }
  };


  return {
    reducer,
    actionCreators,
    actions,
    subscribe,
    unsubscribe,
  };
};

export default createManager;
