import { uniqBy } from 'lodash';
import { getIn } from './helpers';

const createGetActionsWithLinkedManagers = (publicConfig) => (items, internalsActions, localConfig) => {
  const config = {
    ...publicConfig,
    ...localConfig,
  };

  let actionsToDispatch = [internalsActions.fetched(items, config)];
  if (config.linkedManagers) {
    const actionsToDispatchOfLinkedItems = Object.values(config.linkedManagers).map(({ manager, path, configLinked = {} }) => {
      let linkedItems = items.map(item => getIn(item, path));
      if (linkedItems.length && Array.isArray(linkedItems[0])) {
        linkedItems = linkedItems.reduce((a, b) => [...a, ...b], []);
      }
      return manager.internalsActions.fetched(uniqBy(linkedItems, manager.config.idKey), configLinked);
    });

    actionsToDispatch = [...actionsToDispatch, ...actionsToDispatchOfLinkedItems];
  }

  return actionsToDispatch;
};

export default createGetActionsWithLinkedManagers;
