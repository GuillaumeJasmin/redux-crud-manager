import { getMeta } from './meta';

export default (state, prefix = '__META__') => {
  const newState = { ...state };
  Object.entries(newState).forEach(([reducerName, reducer]) => {
    if (Array.isArray(reducer) && getMeta(reducer)) {
      newState[`${prefix}${reducerName}`] = getMeta(reducer);
      newState[reducerName] = newState[reducerName].map(item => ({
        ...item,
        [prefix]: getMeta(item),
      }));
    }
  });

  return newState;
};
