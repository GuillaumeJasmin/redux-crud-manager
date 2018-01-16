export const getIn = (obj, path) => {
  const newPath = path.slice();
  if (newPath.length > 1) {
    const key = newPath.shift();
    return getIn(obj[key], newPath);
  }
  return obj[path];
};

export const asArray = items => (Array.isArray(items) ? items : [items]);

export const throwError = (msg) => {
  throw new Error(`ReduxCRUDManager: ${msg}`);
};

export const consoleError = (msg) => {
  console.error(`ReduxCRUDManager: ${msg}`);
};

export const consoleWarn = (msg) => {
  console.error(`ReduxCRUDManager: ${msg}`);
};


export const enumProxy = (data) => {
  if (process.env.NODE_ENV === 'production') {
    return data;
  }

  return new Proxy(Object.freeze(data), {
    get(target, name) {
      if (!(name in target)) {
        throw new Error(`enumProxy Error: Getting non-existant property '${name}'`);
      }
      return target[name];
    },
  });
};

export const enumProxyFromArray = (items) => {
  const obj = {};

  items.forEach((item) => {
    obj[item] = item;
  });

  return enumProxy(obj);
};
