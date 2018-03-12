
Redux CRUD Manager - Linked Managers
===================

```js
const manager = createManager({
  linkedManagers: {
    yourManagerName: {
      path: ['itemInst'],
    },
  },
});
```

Note: `yourManagerName` must be one of manager name used into `getReducers()`. See * [Reducers](docs/v1/reducer.md#get-reducers)

Example with the request GET `/authors`, which return an array or authors

```js
[
  {
    name: 'John',
    books: [
      {
        id: 1
        title: 'Book 1',
      },
      {
        id: 2
        title: 'Book 2',
      }
    ]
  },
  {
    name: 'Max',
    books: [
      {
        id: 4
        title: 'Book 4',
      },
      {
        id: 4
        title: 'Book 5',
      }
    ]
  }
]
```

```js
const authorManager = createManager({
  ...
  linkedManagers: {
    books: {
      path: ['books'],
    },
  },
});
```
