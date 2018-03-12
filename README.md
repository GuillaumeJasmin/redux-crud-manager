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
* [Remote actions](docs/v1/remote-actions.md)
* [Reducers](docs/v1/reducer.md)
* [Metadata](docs/v1/metadata.md)
* [Custom actions](docs/v1/custom-actions.md)
* [Linked managers](docs/v1/linked-managers.md)
* [Events](docs/v1/events.md)
* [Batch actions with redux-batchted-actions](https://gist.github.com/GuillaumeJasmin/3956fb03becdba50dc18ab9a721b9793)

## Configuration

Install from npm registry
```
npm install redux-crud-manager@next --save
```

<a id="configuration"></a>

```js
import { createManager } from 'redux-crud-manager';

const config = {};
const usersManager = createManager(config);
```

### Config


* `reducerPath` {array[string]} - required - Most of time, there is a single item: the reducer name. But if you have nested reducer, define the full path.


* `remoteActions`  {object} - required - async action for HTTP request. See [how to configure remoteActions](docs/v1/remote-actions.md)


* `idKey` {string} - optional - default `id`. The key used as the unique identifier.


* `customActions` {object} - DEPRECATED, use `actions` instead. make possible to create your own actions. See [customs actions](docs/v1//custom-actions.md)


* `actions`  {object} - make possible to create your own actions. See [customs actions](docs/v1//custom-actions.md)


* `cache` {bool | function} - enable cache if resources are already fetched. Default: `false`
You can pass a function to customise the check:
```js
{
    cache: (existingItems) => existingItems[0] && existingItems[0].bookId === someBookId
}
```


* `merge` {bool} optional - default `true` - merge item property on update()


* `deepMerge` {array} optional - List of properties wich need a deep merge. Currently only available for 1 depth


* `replace` {bool} optional - default `true` . Use on fetch. If it's `true`, the previous list will be replace. if `false`, new items will be added to previous.


* `remote` {bool} optional - default: `false` - save your change in your server, with remoteActions


* `prefixLocalId` {string} - optional


* `showUpdatingProgress` {bool} optional - default `true` . `syncing` will be set to `true`


* `updateLocalBeforeRemote` {bool} optional - default `false`. Properties will be updated locally before the server response. Ignored if `showUpdatingProgress` is false


* `includeProperties` {array[string]} optional - include property on save.


* `excludeProperties` {array[string]} optional - include property on save. Ignored if `includeProperties` is defined


* `linkedManagers` {array} optional - default `null`. [See example](docs/v1/linked-managers.md)


* `enableLinkedManagers` {bool} optional - default `true` if `linkedManagers` is not null 


* `batchDispatch` {function} optional - default `(dispatch, actions) => actions.map(action => dispatch(action))`


* `params` {object} optional - custom params used to pass arbitrary data. Use it as you want. [See example](docs/v1/remote-actions.md#custom-params)


## Actions
Create, update and delete

```js
import { createManager } from 'redux-crud-manager';
const config = {};
const userManager = createManager(config);

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
* preUpdate
* update
* preDelete
* delete
* sync
* clear
* clearChanges

### Base actions

Base actions are used inside `defaults actions` , and you may never have to use them. But if you need to create custom actions, you can use it.

* fetching
* fetched
* creating
* created
* updating
* updated
* deleting
* deleted
