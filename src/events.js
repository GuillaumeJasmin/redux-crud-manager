import { enumProxyFromArray } from './helpers';

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
];

const events = [];

prefixs.forEach(prefix => {
  actions.forEach(action => {
    events.push(`${prefix}${action}`);
  });
});

export default enumProxyFromArray(events);
