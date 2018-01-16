Redux CRUD Manager - Events
===================

```js
import { createManager } from 'redux-crud-manager';

const userManager = createManager({...});

userManager.subscribe(EVENT_NAME, ({ dispatch, getState, data }) => {
  // do want you want
});
```

list of events:
* willFetchAll
* willFetchOne
* willPreCreate
* willCreate
* willPreUpdate
* willUpdate
* willPreDelete
* willDelete
* willSync
* didFetchAll
* didFetchOne
* didPreCreate
* didCreate
* didPreUpdate
* didUpdate
* didPreDelete
* didDelete
* didSync
