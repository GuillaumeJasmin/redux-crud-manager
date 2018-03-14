Redux CRUD Manager - Customs actions
===================

```js
const userManager = createManager({
  /**
   * @deprecated - use 'actions' instead
   */
  customActions: (defaultActions, internalsActions) => ({
    customFetchAll: () => (dispatch, getState) => {
      dispatch(internalsActions.fetching());
      fetch('http://...').then(items => {
        dispatch(internalsActions.fetched(items));
      });
    }
  }),

  actions: ({ baseActions, remoteActions, publish, fetchedWithBindedManagers, config, getManagers }) => ({
    customFetchAll: (your1stParam, your2ndParam) => (dispatch, getState) => {
      dispatch(baseActions.fetching());
      fetch('http://...').then(items => {
        dispatch(baseActions.fetched(items));
      });
    } 
  }),
});
```

```js
dispatch(userManager.actions.customFetchAll();
```

## actions() params

* baseActions - base actions of managers, like `fetching()`, `fetched()`...

* remoteActions - remote actions of manager

* publish {func} - See [Events](docs/v1/events.md)

* fetchedWithBindedManagers {func} . Make possible to fetch items of manager and hydrate items of linked manager. Example: `fetchedWithBindedManagers(items, config)`

* config {object} - all config of manager

* getManagers - {func} return all managers defined in `getReducers()`
