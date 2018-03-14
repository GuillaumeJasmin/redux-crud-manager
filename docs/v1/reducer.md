Redux CRUD Manager - Reducer
===================

Before import reducer, make sure init your resource: 

```js
// store/users.js
import { createManager } from 'redux-crud-manager';

export default createManager({
  reducerPath: ['users'],
  remoteActions: {...}
});
```

<a id="get-reducers"></a>

Then, create your reducers with `getReducers()` :

```js
// example of store/index.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { bindManagers } from 'redux-crud-manager';
import users from './users.js';
import books from './books.js';

// bind manager if you use binded Managers
bindManagers({ users, books });

const mainReducer = combineReducers({
  users: users.reducer,
  books: books.reducer,
  // here others reducers without redux-crud-manager...
});

const store = createStore(mainReducer, applyMiddleware(thunk));

export default store;
```
