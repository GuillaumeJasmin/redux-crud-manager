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

  return {
    reducer,
    actionCreators,
    actions,
  };
};

export default createManager;
