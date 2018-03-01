const actions = [
  // fetch
  'fetching',
  'fetched',
  // create
  'preCreate',
  'creating',
  'created',
  // update
  'preUpdate',
  'updating',
  'updated',
  // delete
  'preDelete',
  'deleting',
  'deleted',
  // sync
  'syncing',
  'synced',
  'clear',
  'clearChanges',
  'clearPendingActions',
];

export default (privateConfig) => {
  const actionCreators = {};
  const actionReducers = {};

  actions.forEach((action) => {
    const type = Symbol(`${privateConfig.prefixReducer}___${action}`);
    actionReducers[action] = type;
    actionCreators[action] = (data, config) => ({
      type,
      scopeType: privateConfig.scopeType,
      data,
      config,
    });
  });

  return {
    actionCreators,
    actionReducers,
  };
};

