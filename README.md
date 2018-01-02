Redux CRUD Manager
===================

## Keep your redux store sync with your server.

Redux CRUD Manager provide a simple way to sync your redux store with your remote server.

No more need to write actions and reducer to update your store. 

What precisely each manager ?

* It use CRUD pattern
* update your data localy (redux store)
* update your data localy AND sync at the same time to your remote server
* update your data localy, and save few moment later to your remote server
* indicate loading process to the user (for example with a loader). No need to manually set a ```isLoading``` flag.
* fetch your data and use local data (redux) if resource are already fetched.

Reudx Crud Manager do not include any library around redux, and do not provide any UI component. It only provide actions and reducer.

## Documentation:

* [Configuration](#configuration)
* [Simple Example](#simple-example)
* [Configure remoteActions](docs/remote-actions.md)
* [Configure reducer](docs/reducer.md)

### Configuration

Install from npm registry
```
npm install redux-crud-manager --save
```

<a id="configuration"></a>

```js
import { createManager } from 'redux-crud-manager';

const config = {...};
const usersManager = createManager(config);
```

### Config object



* ```reducerPath``` {array[string]} - required - Most of time, there is a single item: the reducer name. But is you have nested reducer, define the full path.


* ```remoteActions```  {object} - required - async action for HTTP request


* ```idKey``` {string} - optional - the key use as the unique identifier. Default: ```id```


* ```cache``` {bool | function} - enable cache if resources are already fetched. Default: ```false```
You can pass a function to customise the check:
```js
{
    cache: (existingItems) => existingItems[0] && existingItems[0].bookId === someBookId
}
```


* ```merge``` {bool} optional - default ```true``` - merge item property on update()


* ```replace``` {bool} optional - default ```false```


* ```remote``` {bool} optional - default: ```false``` - save your change in your server, with remoteActions


* ```prefixLocalId``` {string} - optional


* ```showUpdatingProgress``` {bool} optional - default ```true``` . ```syncing``` will be set to ```true```


* ```updateLocalBeforeRemote``` {bool} optional - default ```false```. Properties will be updated locally before the server response. Ignored if ```showUpdatingProgress``` is false


* ```forceDelete``` {bool} optional - default ```true```


* ```includeProperties``` {array[string]} optional - include property on save.


* ```excludeProperties``` {array[string]} optional - include property on save. Ignored if ```includeProperties``` is defined



<a id="simple-example"></a>

### Simple example

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

* [How configure remoteActions](docs/remote-actions.md)

How to create a user localy into redux store ?
```js
const user = {name: ...};
dispatch(usersManager.actions.create(user));
```

Well, but with many users ?

Use an array:
```js
const users = [{name: ...}, {name: ...}];
dispatch(usersManager.actions.create(users));
```

How to create on my remote server ?

Use ```{remote: true}```:

```js
dispatch(usersManager.actions.create(users, {remote: true}));
```

Here is what happens above:
* POST request to your server
* redux store update after the request response

The POST request is defined in your remoteActions.create() function in the configuration.
See [How configure remoteActions](docs/remote-actions.md)

Now, if I want to do many changes localy, and sync my changes with my remote server few minutes later ? 

```js
// update my first user
dispatch(usersManager.actions.update({id: 1, name: ...}));

// create a third user
dispatch(usersManager.actions.create({name: ...}));

// delete my second user
dispatch(usersManager.actions.delete(userId));

// ... and few minute later, you want to save your data on your server

dispatch(usersManager.actions.sync());
```

Here is what happens above:
* PATCH (or PUT) request to your server (update the first user)
* POST request to your server (create the thrid user)
* DELETE request to your server (delete the second user)
* redux store update after all requests response

The ```sync()``` function check which local resource was updated without ```{remote: true}``` option, and make the appropriate request for it (create, update or delete).

ReducCrudManager use metadata to keep the state of your resource sync with your server, and know which resource need to be synced (created, updated or deleted).

Ok, nice. But how I can notify my user that my application is making a server request, in order to show a loader ?
Use metadata.

```js
import {meta} from 'redux-crud-manager';

const user = store.getState().users.find(...);

if (meta(user).syncing) {
  // show loader
}
``` 

metadata are defined for a resource, and also for the list of resources:

```js
import {meta} from 'redux-crud-manager';

const users = store.getState().users;

if (meta(users).syncing) {
  // show loader
}
``` 

Why we need to use ```meta(user).synced``` instead of ```user.synced``` ?

Because metadata is store into a key symbol in order to prevent conflict var name.

List of all metadata:

| key | values | description |
|:-------|:------|:------|
|syncing|true / false|indicated if local data is currently syncing into server|
|synced|true / false|indicated if local data is synced with server data|
|fetching|true / false|only for resources list, not a single resource| 
|fetched|true / false|only for resources list, not a single resource| 
|nextSync|create / update / delete|indicated what is the next action for sync the local data to the server|


### TODO
* save time of the last sync
* use delay for cache fetching
