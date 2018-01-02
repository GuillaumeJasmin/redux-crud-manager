export const getIn = (obj, path) => {
  const newPath = path.slice();
  if (newPath.length > 1) {
    const key = newPath.shift();
    return getIn(obj[key], newPath);
  }
  return obj[path];
};

export const asArray = items => (Array.isArray(items) ? items : [items]);
