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
];

export default (config) => {
  const actionCreators = {};
  const actionReducers = {};

  actions.forEach((action) => {
    const type = Symbol(`${config.prefixReducer}___${action}`);
    actionReducers[action] = type;
    actionCreators[action] = (data, localConfig) => ({
      type,
      scopeType: config.scopeType,
      data,
      config: localConfig,
    });
  });

  return {
    actionCreators,
    actionReducers,
  };
};

