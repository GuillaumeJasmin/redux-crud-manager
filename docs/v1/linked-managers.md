
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

Example with the request GET `/authors`, which return an array or authors

example with books and authors:
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
