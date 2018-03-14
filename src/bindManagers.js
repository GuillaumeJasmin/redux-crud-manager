export default managers => {
  Object.values(managers).forEach((manager) => {
    manager._setManagers(managers); // eslint-disable-line
  });
  return managers;
};
