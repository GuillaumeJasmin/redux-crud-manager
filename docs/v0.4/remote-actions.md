Redux CRUD Manager - remote actions
===================

Remote actions are defined with 5 methods:

- fetchAll()
- fetchOne()
- create()
- update()
- delete()

It's a simple CRUD pattern.

You need to defined yourself your request actions.

Example with the browser native fetch()

```js
const remoteActions = {
  fetchAll: (items, config) => {
    return fetch('http://api.yourserver.com/users', {method: 'GET'}).then(response => {
      return response.toJSON().then(users => {
        return users;
      });
    });
  },
  fetchOne: (userId, config) => {
    return fetch(`http://api.yourserver.com/users/${userId}`, {method: 'GET'}).then(response => {
      return response.toJSON().then(user => {
        return user;
      });
    });
  },
  create: (user, config) => {
    return fetch(`http://api.yourserver.com/users`, {method: 'POST'}).then(response => {
      return response.toJSON().then(user => {
        return user;
      });
    });
  },
  ...
}
```

Same things for update() and delete().

All methods must return a promise, with different data structure:
- fetchAll() Promise must return an array
- fetchOne() Promise must return an object
- create() Promise must return an object or an array of object (for batch)
- update() Promise must return an object or an array of object (for batch)
- delete() Promise response is not use, because a DELETE request must return 204 no-content

Of course, the above example is not optimised, it's only an example.
Usualy, yo don't define the full URL of each resource like this.

I this example, I used fetch(), but you can use the lirary of your choice, like [Axios](https://github.com/axios/axios) or [restful.js](https://github.com/marmelab/restful.js/tree/master)

I suggest you to create a function to generate these 5 CRUD methods, like this:

```js

const createRemoteActions = (itemName) => {

  const baseURL = 'http://api.yourserver.com';
  const headers = {...};

  return {
    fetchAll: (items, config) => {
      return fetch(`${baseURL}/${itemName}`, {method: 'GET', headers}).then(response => {
        return response.toJSON().then(items => {
          return models;
        });
      });
    },
    fetchOne: (itemId, config) => {
      return fetch(`${baseURL}/${modelName}/${itemId}`, {method: 'GET', headers}).then(response => {
        return response.toJSON().then(model => {
          return model;
        });
      });
    },
    create: (item, config) => {
      return fetch(`${baseURL}/${itemName}`, {method: 'POST', headers}).then(response => {
        return response.toJSON().then(item => {
          return item;
        });
      });
    },
    update: (item, config) => {
      return fetch(`${baseURL}/${itemName}/${itemId}`, {method: 'PATCH', headers}).then(response => {
        return response.toJSON().then(item => {
          return item;
        });
      });
    },
    delete: (itemId, config) => {
      return fetch(`${baseURL}/${itemName}/${itemId}`, {method: 'DELETE', headers}).then(response => {
        if (response.status === '204') {
          return null;
        } else {
          // error
        }
      });
    }
  }
}
```

And then, you can generate all your managers:

```js
const usersManager = createManager({
  reducerPath: ['users'],
  remoteActions: createRemoteActions('users')
});

const booksManager = createManager({
  reducerPath: ['books'],
  remoteActions: createRemoteActions('books')
});

// ... etc

const user = {
  name: '...',
  age: 20
};

dispatch(usersManager.create(user, {remote: true}));

const book = {
  title: '...',
  author: '...'
};

dispatch(booksManager.create(book, {remote: true}));

``` 


You can passe params into each methods, like specific headers, or filter, or what you want.
I recommand you to use ```params``` key to pass all your custom data, in order to prevent conflict with other config properties.
Example: use ```fetchAll(null, {params: {page: 1}})``` instead of ```fetchAll(null, page: 1})```

```js
const remoteActions = {
  fetchAll: (items, config) => {
    return fetch(`${baseURL}/${itemName}?page=${config.params.page}&filter=${config.params.filter}`, {method: 'GET'}).then(response => {
      return response.toJSON().then(users => {
        return users;
      });
    });
  }
}
```

```config``` argument is use  
