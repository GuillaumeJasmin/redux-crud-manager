Redux CRUD Manager - Customs actions
===================

# Simple example

```js
const userManager = createManager({
  actions: ({ defaultActions, baseActions, publish, fetchedWithBindedManagers, config, getManagers }) => ({
    fetchAll: () => {
      return defaultActions.fetchAll({
        request: () => fetch('http://api.yourserver.com/users', { method: 'GET' }).then(response => {
          return response.toJSON();
        }),
        config: {}
      });
    },
    create: (data) => {
      return defaultActions.create({
        data,
        request: items => fetch(`http://api.yourserver.com/users`, { method: 'POST', body: JSON.stringify(items) }).then(response => {
          return response.toJSON();
        }),
        config: {}
      });
    },
  }),
});
```

# All default actions:

* fetchAll

* fetchOne 

* create 

* update

* delete 

```js
dispatch(userManager.actions.fetchAll());
```

All methods must return a promise, with different data structure:
- fetchAll() Promise must return an array
- fetchOne() Promise must return an object
- create() Promise must return an object or an array of object (for batch)
- update() Promise must return an object or an array of object (for batch)
- delete() Promise response is not use, because a DELETE request must return 204 no-content

Of course, the above example is not optimised, it's only an example.
Usualy, yo don't define the full URL of each resource like this.

In this example, I used the native fetch() method, but you can use the library of your choice, like [Axios](https://github.com/axios/axios) or [restful.js](https://github.com/marmelab/restful.js/tree/master)

I suggest you to create a function to generate these 5 CRUD methods, like this:

```js

const createActions = (modelName) => {

  const baseURL = 'http://api.yourserver.com';
  const headers = {};

  return {
    fetchAll: (config) => {
      return defaultActions.fetchAll({
        request: () => {
          const url = `${baseURL}/${modelName}`;
          const opt = { method: 'GET', headers };
          fetch(url, opt).then(response => {
            return response.toJSON();
          })
        },
        config: {}
      });
    },
    fetchOne: (itemId, config) => {
      return defaultActions.fetchOne({
        data: itemId,
        request: () => {
          const url = `${baseURL}/${modelName}/${itemId}`;
          const opt = { method: 'GET', headers };
          fetch(url, opt).then(response => {
            return response.toJSON();
          })
        },
        config: {}
      });
    },
    create: (data, config) => {
      return defaultActions.create({
        data,
        request: (items) => {
          items.forEach(item => {
            const url = `${baseURL}/${modelName}`;
            const opt = { method: 'POST', body: JSON.stringify(item), headers };
            fetch(url, opt).then(response => {
              return response.toJSON();
            })
          });
        },
        config: {}
      });
    },
    update: (data, config) => {
      return defaultActions.update({
        data,
        request: (items) => {
          items.forEach(item => {
            const url = `${baseURL}/${modelName}/${item.id}`;
            const opt = { method: 'PATCH', body: JSON.stringify(item), headers };
            fetch(url, opt).then(response => {
              return response.toJSON();
            })
          });
        },
        config: {}
      });
    },
    update: (data, config) => {
      return defaultActions.delete({
        data,
        request: (items) => {
          items.forEach(item => {
            const url = `${baseURL}/${modelName}/${item.id}`;
            const opt = { method: 'DELETE', headers };
            fetch(url, opt);
          });
        },
        config: {}
      });
    },
  }
}
```

And then, you can generate all your managers:

```js
const usersManager = createManager({
  reducerPath: ['users'],
  actions: createActions('users')
});

const booksManager = createManager({
  reducerPath: ['books'],
  actions: createActions('books')
});



## actions() params

* baseActions - base actions of managers, like `fetching()`, `fetched()`...

* remoteActions - remote actions of manager

* publish {func} - See [Events](docs/v1/events.md)

* fetchedWithBindedManagers {func} . Make possible to fetch items of manager and hydrate items of linked manager. Example: `fetchedWithBindedManagers(items, config)`

* config {object} - all config of manager

* getManagers - {func} return all managers defined in `getReducers()`
