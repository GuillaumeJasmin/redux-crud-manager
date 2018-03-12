import { getIn } from './helpers';

const createGetActionsWithLinkedManagers = (publicConfig) => (items, internalsActions, localConfig) => {
  const config = {
    ...publicConfig,
    ...localConfig,
  };

  let actionsToDispatch = [internalsActions.fetched(items, config)];
  if (config.linkedManagers) {
    const actionsToDispatchOfLinkedItems = Object.values(config.linkedManagers).map(({ manager, path, configLinked = {} }) => {
      const linkedItems = items.map(item => getIn(item, path)).reduce((a, b) => [...a, ...b], {});
      return manager.internalsActions.fetched(linkedItems, configLinked);
    });

    actionsToDispatch = [...actionsToDispatch, ...actionsToDispatchOfLinkedItems];
  }

  return actionsToDispatch;
};

export default createGetActionsWithLinkedManagers;
