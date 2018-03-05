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
  nestedManagers: null,
  batchDispatch: (dispatch, actions) => actions.map(action => dispatch(action)),
  params: {}, // reserved key for user params. Do never user it as internal params
};
