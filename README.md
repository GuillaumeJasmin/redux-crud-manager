Redux CRUD Manager - v1 alpha
===================

[v0.4 docs](docs/v0.4/README.md)

## Keep your redux store synced with your server.

Redux CRUD Manager provide a simple way to sync your redux store with your remote server.
No more need to write actions and reducer to update your store. 

* CRUD pattern
* update local data and sync with remote server when you want
* update local data only
* metadata for pending action

Reudx Crud Manager do not include any library around redux, and do not provide any UI component. It only provide actions and reducer.

## Documentation

* [Configuration](#configuration)
* [Simple Example](#simple-example)
* [Configure remoteActions](docs/v1/remote-actions.md)
* [Configure reducer](docs/v1/reducer.md)
* [Events](docs/v1/events.md)

## Configuration

Install from npm registry
```
npm install redux-crud-manager@next --save
```

<a id="configuration"></a>

```js
import { createManager } from 'redux-crud-manager';

const config = {...};
const usersManager = createManager(config);
```

### Config object


* `reducerPath` {array[string]} - required - Most of time, there is a single item: the reducer name. But if you have nested reducer, define the full path.


* `remoteActions`  {object} - required - async action for HTTP request

* `customActions`  {object} - make possible to create your own actions


* `idKey` {string} - optional - the key use as the unique identifier. Default: `id`


* `cache` {bool | function} - enable cache if resources are already fetched. Default: `false`
You can pass a function to customise the check:
```js
{
    cache: (existingItems) => existingItems[0] && existingItems[0].bookId === someBookId
}
```


* `merge` {bool} optional - default `true` - merge item property on update()

* `deepMerge` {array} optional - List of properties wich need a deep merge. Currently only available for 1 depth


* `replace` {bool} optional - default `true`


* `remote` {bool} optional - default: `false` - save your change in your server, with remoteActions


* `prefixLocalId` {string} - optional


* `showUpdatingProgress` {bool} optional - default `true` . `syncing` will be set to `true`


* `updateLocalBeforeRemote` {bool} optional - default `false`. Properties will be updated locally before the server response. Ignored if `showUpdatingProgress` is false


* `forceDelete` {bool} optional - default `true`


* `includeProperties` {array[string]} optional - include property on save.


* `excludeProperties` {array[string]} optional - include property on save. Ignored if `includeProperties` is defined

* `params` {object} optional - custom params used to pass arbitrary data. Use it as you want. [See example](docs/v1/remote-actions.md#custom-params)



<a id="simple-example"></a>

## Simple example

```js
import { createManager } from 'redux-crud-manager';

const config = {
  reducerPath: ['users'],
  remoteActions: {
    fetchAll: () => {...}
    fetchOne: () => {...}
    create: () => {...}
    update: () => {...}
    delete: () => {...}
  }
}

const usersManager = createManager(config);
```

* [How configure remoteActions](docs/v1/remote-actions.md)

## Actions
Create, update and delete

```js
import { createManager } from 'redux-crud-manager';

const userManager = createManager({...});

dispatch(userManager.actions.fetchAll());

dispatch(userManager.actions.fetchOne(userId));

dispatch(userManager.actions.create(data, { remote: true }));

dispatch(userManager.actions.update(data, { remote: true }));

dispatch(userManager.actions.delete(data, { remote: true }));
```

Note: `data` can be an object or an array

If you don't want to make a remote request but only use local change, set `remote: false`

### PreCreate, preUpdate, preDelete

You can create update and delete data locally and then save on remote.
Its usefull when you want to do many changes and save after.

```js
dispatch(userManager.actions.preCreate(user));
// or
dispatch(userManager.actions.preUpdate(user));
// or
dispatch(userManager.actions.preDelete(user));

// ...

// this will save changes on remote, like actions.create(data, { remote: true })
dispatch(userManager.actions.sync());

```

### Defaults actions
* fetchAll
* fetchOne
* preCreate
* create
* createFromItem
* preUpdate
* update
* preDelete
* delete
* sync
* clear
* clearChanges

### Internals actions

Internal actions are used inside `defaults actions` , and you will never have to use them. But if you need to create custom actions, you can use it.

* fetching
* fetched
* creating
* created
* updating
* updated
* deleting
* deleted

### Customs actions
```js
const userManager = createManager({
  customActions: (defaultActions, internalsActions) => ({
    customFetchAll: () => (dispatch, getState) => {
      dispatch(internalsActions.fetching());
      fetch('http://...').then(items => {
        dispatch(internalsActions.fetched(items));
      });
    }
  })
});
```

```js
dispatch(userManager.actions.customFetchAll();
```

## Metadata

```js
import { getMeta, isSyncing, isSynced, getChanges, syncingKeys } from 'redux-crud-manager';

const user = store.getState().users.find(...);

if (getMeta(user).preCreated) {
  // ...
}
``` 

metadata are defined for a resource, and also for the list of resources:

```js
import { getMeta } from 'redux-crud-manager';

const users = store.getState().users;

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
