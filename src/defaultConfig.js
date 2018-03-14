const defaultMiddleware = data => data;

export default {
  idKey: 'id',
  cache: false,
  merge: true,
  replace: true,
  remote: false,
  prefixLocalId: 'ID_CREATED_LOCALLY___',
  showUpdatingProgress: true,
  updateLocalBeforeRemote: false,
  forceDelete: true,
  includeProperties: null,
  excludeProperties: null,
  insertDataBeforeCreateSuccess: false,
  linkedManagers: null,
  batchDispatch: (dispatch, actions) => actions.map(action => dispatch(action)),
  fetchAllMiddleware: defaultMiddleware,
  fetchOneMiddleware: defaultMiddleware,
  createMiddleware: defaultMiddleware,
  updateMiddleware: defaultMiddleware,
  deleteMiddleware: defaultMiddleware,
  params: {}, // reserved key for user params. Do never user it as internal params
};
