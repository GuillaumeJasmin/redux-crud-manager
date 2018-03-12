Redux CRUD Manager - Reducer
===================

Before import reducer, make sure init your resource: 

```js
// store/users.js
import { createManager } from 'redux-crud-manager';

const config = {
  reducerPath: 'users',
  remoteActions: {
    fetchAll: () => {...}
    fetchOne: () => {...}
    create: () => {...}
    update: () => {...}
    delete: () => {...}
  }
}

const usersManager = createManager(config);

export default usersManager;
```

You can now use ```usersManager.reducer``` in your store configuration:

Then, create your store:

```js
// example of store/index.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { getReducers } from 'redux-crud-manager';
import users from './users.js';
import books from './books.js';

const mainReducer = combineReducers({
  ...getReducers({
    users,
    books,
  }),
  // here others reducers without redux-crud-manager...
});

const store = createStore(mainReducer, applyMiddleware(thunk));

export default store;
```
