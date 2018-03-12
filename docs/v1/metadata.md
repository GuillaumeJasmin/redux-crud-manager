
Redux CRUD Manager - Metadata
===================

```js
import { getMeta, isSyncing, isSynced, getChanges } from 'redux-crud-manager';

const user = store.getState().users.find(...);

if (getMeta(user).preCreated) {
  // ...
}
``` 

metadata are defined for a resource, and also for the list of resources:

```js
import { getMeta } from 'redux-crud-manager';

const { users } = store.getState();

if (getMeta(users).syncing) {
  // show loader
}
``` 

metadata item:
```js
{
  preCreated: false,
  creating: false,
  preUpdated: false,
  updating: false,
  preDeleted: false,
  deleting: false,
  localId: null,
  lastVersion: {},
  syncingVersion: {},
}
```

metadata list items:
```js
{
  fetching: false,
  fetched: false,
  creating: false,
  updating: false,
  deleting: false,
}
```
