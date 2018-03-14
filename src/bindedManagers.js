import { uniqBy } from 'lodash';
import { getIn, throwError } from './helpers';

const createGetActionsWithBindedManagers = (publicConfig, privateConfig) => (items, baseActions, localConfig) => {
  const config = {
    ...publicConfig,
    ...localConfig,
  };

  let actionsToDispatch = [baseActions.fetched(items, config)];
  if (config.bindedManagers) {
    const actionsToDispatchOfLinkedItems = Object.values(config.bindedManagers).map(({ manager: managerName, path, configLinked = {} }) => {
      const manager = privateConfig.managers[managerName];
      if (manager) throwError(`No Manager with name ${managerName}`);
      let bindedItems = items.map(item => getIn(item, path));
      if (bindedItems.length && Array.isArray(bindedItems[0])) {
        bindedItems = bindedItems.reduce((a, b) => [...a, ...b], []);
      }
      return manager.baseActions.fetched(uniqBy(bindedItems, manager.config.idKey), configLinked);
    });

    actionsToDispatch = [...actionsToDispatch, ...actionsToDispatchOfLinkedItems];
  }

  return actionsToDispatch;
};

export default createGetActionsWithBindedManagers;
