import { getIn } from './helpers';

export const createGetActionsWithNestedManagers = (publicConfig) => (items, internalsActions, localConfig) => {
  const config = {
    ...publicConfig,
    ...localConfig,
  };

  let actionsToDispatch = [internalsActions.fetched(items, config)];
  if (config.nestedManagers) {
    const actionsToDispatchOfNestedItems = config.nestedManagers.map(({ manager, path, configNested }) => {
      const nestedItems = items.map(item => getIn(item, path));
      return manager.internalsActions.fetched(nestedItems, configNested);
    });

    actionsToDispatch = [...actionsToDispatch, ...actionsToDispatchOfNestedItems];
  }

  return actionsToDispatch;
};

export default createGetActionsWithNestedManagers;
