// import { enumProxyFromArray } from './helpers';

const prefixs = ['will', 'did'];
const actions = [
  'FetchAll',
  'FetchOne',
  'PreCreate',
  'Create',
  'PreUpdate',
  'Update',
  'PreDelete',
  'Delete',
  'Sync',
  'ClearChanges',
  'Clear',
];

const events = [];

prefixs.forEach(prefix => {
  actions.forEach(action => {
    events.push(`${prefix}${action}`);
  });
});

// export default enumProxyFromArray(events);
const eventObj = {};

events.forEach((item) => {
  eventObj[item] = item;
});

export default eventObj;
