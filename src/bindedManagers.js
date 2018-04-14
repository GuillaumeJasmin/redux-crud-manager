import { uniqBy, isPlainObject } from 'lodash';
import { getIn, throwError } from './helpers';

const createGetActionsWithBindedManagers = (publicConfig, privateConfig) => (items, baseActions, localConfig) => {
  const config = {
    ...publicConfig,
    ...localConfig,
  };

  let actionsToDispatch = [baseActions.fetched(items, config)];
  if (config.bindedManagers) {
    const actionsToDispatchOfLinkedItems = Object.entries(config.bindedManagers).map(([managerName, { path, configLinked = {} }]) => {
      const manager = privateConfig.managers[managerName];
      if (!manager) throwError(`No Manager with name ${managerName}`);
      let bindedItems = items.map(item => getIn(item, path));
      if (bindedItems.length) {
        if (Array.isArray(bindedItems[0])) {
          bindedItems = bindedItems.reduce((a, b) => [...a, ...b], []);
        } else if (isPlainObject(bindedItems[0])) {
          bindedItems = bindedItems.reduce((a, b) => [...a, b], []);
        }
      }
      return createGetActionsWithBindedManagers(publicConfig, privateConfig)(uniqBy(bindedItems, manager.config.idKey), manager.baseActions, { ...localConfig, ...manager.config, ...configLinked });
    }).reduce((a, b) => [...a, ...b], []);

    actionsToDispatch = [...actionsToDispatch, ...actionsToDispatchOfLinkedItems];
  }

  return actionsToDispatch;
};

export default createGetActionsWithBindedManagers;
