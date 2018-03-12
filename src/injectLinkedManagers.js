import { mapValues } from 'lodash';

export default managers => {
  Object.values(managers).forEach((manager) => {
    manager._setManagers(managers); // eslint-disable-line
    const { linkedManagers } = manager.config;
    if (linkedManagers) {
      Object.keys(linkedManagers).forEach((name) => {
        linkedManagers[name].manager = managers[name];
      });
    }
  });

  return mapValues(managers, 'reducer');
};
