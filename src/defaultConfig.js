import uniqid from 'uniqid';

export default {
  idKey: 'id',
  cache: false,
  merge: true,
  replace: false,
  remote: false,
  listeners: {},
  prefixLocalId: 'ID_CREATED_LOCALLY___',
  showUpdatingProgress: true,
  updateLocalBeforeRemote: false,
  forceDelete: true,
  includeProperties: null,
  excludeProperties: null,
  insertDataBeforeCreateSuccess: false,
  eventKey: uniqid(),
};
