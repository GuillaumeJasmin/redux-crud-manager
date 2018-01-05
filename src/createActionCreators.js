const actions = [
  // fetch
  'fetching',
  'fetched',
  // create
  'createLocal',
  'created',
  // update
  'updateLocal',
  'updating',
  'updated',
  // delete
  'deleteLocal',
  'deleting',
  'deleted',
  // sync
  'syncing',
  'synced',
  'clearMeta',
];

export default (globalConfig) => {
  const reducerKey = globalConfig.reducerPath.map(item => item.toUpperCase()).join('_');
  const prefixReducer = `REDUX_CRUD_MANAGER_${reducerKey}`;
  const actionCreators = {};
  const actionReducers = {};

  actions.forEach((action) => {
    const type = Symbol(`${prefixReducer}_${action}`);
    actionReducers[action] = type;
    actionCreators[action] = (data, config) => ({
      type,
      data,
      config,
    });
  });

  return {
    actionCreators,
    actionReducers,
  };
};

