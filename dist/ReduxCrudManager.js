(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ReduxCrudManager", [], factory);
	else if(typeof exports === 'object')
		exports["ReduxCrudManager"] = factory();
	else
		root["ReduxCrudManager"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  metadataKey: Symbol('metadata')
};
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var getIn = exports.getIn = function getIn(obj, path) {
  var newPath = path.slice();
  if (newPath.length > 1) {
    var key = newPath.shift();
    return getIn(obj[key], newPath);
  }
  return obj[path];
};

var asArray = exports.asArray = function asArray(items) {
  return Array.isArray(items) ? items : [items];
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDeleted = exports.isUpdated = exports.isCreated = exports.isSynced = exports.isSyncing = exports.isFetching = undefined;

var _symbols = __webpack_require__(0);

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isFetching = exports.isFetching = function isFetching(items) {
  return items[_symbols2.default.metadataKey].fetching;
};

// use for list or item
var isSyncing = exports.isSyncing = function isSyncing(items) {
  return items[_symbols2.default.metadataKey].syncing;
};

// use for list or item
var isSynced = exports.isSynced = function isSynced(items) {
  return items[_symbols2.default.metadataKey].synced;
};

// use for item
var isCreated = exports.isCreated = function isCreated(items) {
  var meta = items[_symbols2.default.metadataKey];
  return meta.nextSync !== 'create';
};

// use for item
var isUpdated = exports.isUpdated = function isUpdated(items) {
  var meta = items[_symbols2.default.metadataKey];
  return meta.nextSync !== 'update';
};

// use for item
var isDeleted = exports.isDeleted = function isDeleted(items) {
  var meta = items[_symbols2.default.metadataKey];
  return !meta.synced && meta.nextSync === 'delete';
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.meta = exports.selectors = exports.createManager = undefined;

var _createManager = __webpack_require__(5);

var _createManager2 = _interopRequireDefault(_createManager);

var _selectors = __webpack_require__(3);

var selectors = _interopRequireWildcard(_selectors);

var _meta = __webpack_require__(14);

var _meta2 = _interopRequireDefault(_meta);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createManager = _createManager2.default;
exports.selectors = selectors;
exports.meta = _meta2.default;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createActions = __webpack_require__(6);

var _createActions2 = _interopRequireDefault(_createActions);

var _createActionCreators2 = __webpack_require__(9);

var _createActionCreators3 = _interopRequireDefault(_createActionCreators2);

var _createReducer = __webpack_require__(10);

var _createReducer2 = _interopRequireDefault(_createReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create Manager
 *
 * @param {Object}   config
 * @param {Object}   config.remoteActions
 * @param {string[]} config.reducerPath
 * @param {string}   config.idKey=id
 * @param {boolean}  config.cache=false
 * @param {boolean}  config.merge=true
 * @param {boolean}  config.remote=false
 * @param {boolean}  config.showUpdatingProgress=true
 * @param {string}   config.prefixLocalId=local-
 * @param {string[]} config.includeProperties
 * @param {string[]} config.excludeProperties
 *
 */
var createManager = function createManager(_config) {
  var config = _extends({
    idKey: 'id',
    cache: false,
    merge: true,
    replace: false,
    remote: false,
    prefixLocalId: 'ID_CREATED_LOCALLY___',
    showUpdatingProgress: true,
    updateLocalBeforeRemote: false,
    forceDelete: true,
    includeProperties: null,
    excludeProperties: null,
    insertDataBeforeCreateSuccess: false
  }, _config);

  var _createActionCreators = (0, _createActionCreators3.default)(config),
      actionCreators = _createActionCreators.actionCreators,
      actionReducers = _createActionCreators.actionReducers;

  var reducer = (0, _createReducer2.default)(config, actionReducers);

  var actions = (0, _createActions2.default)(config, actionCreators);

  return {
    reducer: reducer,
    actionCreators: actionCreators,
    actions: actions
  };
};

exports.default = createManager;
module.exports = exports['default'];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _uniqid = __webpack_require__(7);

var _uniqid2 = _interopRequireDefault(_uniqid);

var _selectors = __webpack_require__(3);

var _helpers = __webpack_require__(1);

var _symbols = __webpack_require__(0);

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var filterKeysOne = function filterKeysOne(properties, include, exclude) {
  var outputItems = {};

  if (include && include.length) {
    include.forEach(function (key) {
      outputItems[key] = properties[key];
    });
  } else if (exclude && exclude.length) {
    Object.keys(properties).filter(function (key) {
      return !exclude.includes(key);
    }).forEach(function (key) {
      outputItems[key] = properties[key];
    });
  } else {
    return properties;
  }

  return outputItems;
};

var filterKeys = function filterKeys(items, include, exclude) {
  return Array.isArray(items) ? items.map(function (item) {
    return filterKeysOne(item, include, exclude);
  }) : filterKeysOne(items, include, exclude);
};

/**
 * @param {Object} defaultConfig
 * @param {Object} actions
 */

exports.default = function (defaultConfig, actions) {
  var remoteActions = defaultConfig.remoteActions,
      reducerPath = defaultConfig.reducerPath;


  return {
    fetchAll: function fetchAll(items) {
      var localConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return function (dispatch, getState) {
        var config = _extends({}, defaultConfig, localConfig, {
          state: getState()
        });

        if (items) {
          return Promise.resolve(dispatch(actions.fetched(items, config)));
        }

        var state = (0, _helpers.getIn)(getState(), reducerPath);

        if ((0, _selectors.isFetching)(state)) return null;

        var existingItems = state;

        var enableCache = config.cache === true || typeof config.cache === 'function' && config.cache(existingItems) === true;

        if (enableCache && existingItems.length > 0) return Promise.resolve(existingItems);

        dispatch(actions.fetching());

        return remoteActions.fetchAll(null, config).then(function (fetchedItems) {
          return dispatch(actions.fetched(fetchedItems, config));
        });
      };
    },

    fetchOne: function fetchOne(itemId) {
      var localConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return function (dispatch, getState) {
        var config = _extends({}, defaultConfig, localConfig, {
          state: getState()
        });

        var state = (0, _helpers.getIn)(getState(), config.reducerPath);

        if ((0, _selectors.isFetching)(state)) return Promise.resolve(null);

        var item = state.find(function (_item) {
          return _item[defaultConfig.idKey] === itemId;
        });

        var enableCache = config.cache === true || typeof config.cache === 'function' && config.cache(item) === true;

        if (enableCache && item) return Promise.resolve(item);

        dispatch(actions.fetching());

        return remoteActions.fetchOne(itemId, config).then(function (fetchedItem) {
          return dispatch(actions.fetched(fetchedItem, config));
        });
      };
    },

    create: function create(data) {
      var localConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return function (dispatch) {
        var config = _extends({}, defaultConfig, localConfig);

        var items = (0, _helpers.asArray)(data);

        if (!config.remote) {
          var itemsWithLocalId = items.map(function (item) {
            var _extends2;

            if (item[config.idKey]) {
              throw new Error('Redux Crud Manager: key \'' + config.idKey + '\' is not allowed for local items');
            }

            var localId = (0, _uniqid2.default)(config.prefixLocalId);

            return _extends({}, item, (_extends2 = {}, _defineProperty(_extends2, config.idKey, localId), _defineProperty(_extends2, _symbols2.default.metadataKey, { localId: localId }), _extends2));
          });

          return Promise.resolve(dispatch(actions.createLocal(itemsWithLocalId, config)));
        }

        var itemsPropertiesFiltered = filterKeys(items, config.includeProperties, config.excludeProperties);

        return remoteActions.create(itemsPropertiesFiltered, config).then(function (itemsCreated) {
          return dispatch(actions.created(itemsCreated, config));
        });
      };
    },

    update: function update(data) {
      var localConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return function (dispatch) {
        var config = _extends({}, defaultConfig, localConfig);

        var items = (0, _helpers.asArray)(data);

        if (!config.remote) {
          return Promise.resolve(dispatch(actions.updateLocal(items, config)));
        }

        if (config.showUpdatingProgress) {
          if (config.updateLocalBeforeRemote) {
            dispatch(actions.updating(items, config));
          } else {
            var itemsWithOnlyId = items.map(function (item) {
              return _defineProperty({}, config.idKey, item[config.idKey]);
            });
            dispatch(actions.updating(itemsWithOnlyId, config));
          }
        }

        var itemsPropertiesFiltered = filterKeys(items, config.includeProperties, config.excludeProperties);

        return remoteActions.update(itemsPropertiesFiltered, config).then(function (itemsUpdated) {
          return dispatch(actions.updated(itemsUpdated, config));
        });
      };
    },

    delete: function _delete(data) {
      var localConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return function (dispatch) {
        var config = _extends({}, defaultConfig, localConfig);

        var items = (0, _helpers.asArray)(data);

        if (!config.remote) {
          return config.forceDelete ? dispatch(actions.deleted(items, config)) : dispatch(actions.deleteLocal(items, config));
        }

        return remoteActions.delete(items, config).then(function () {
          return dispatch(actions.deleted(items, config));
        });
      };
    },

    sync: function sync() {
      var localConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return function (dispatch, getState) {
        var config = _extends({}, defaultConfig, localConfig);

        var state = (0, _helpers.getIn)(getState(), reducerPath);

        var itemsToCreate = state.filter(function (item) {
          return !(0, _selectors.isCreated)(item);
        });
        var itemsToUpdate = state.filter(function (item) {
          return !(0, _selectors.isUpdated)(item);
        });
        var itemsToDelete = state.filter(function (item) {
          return (0, _selectors.isDeleted)(item);
        });

        var itemsToCreatePropertiesFiltered = itemsToCreate.length ? filterKeys(itemsToCreate, config.includeProperties, config.excludeProperties) : [];

        var itemsToUpdatePropertiesFiltered = itemsToUpdate.length ? filterKeys(itemsToUpdate, config.includeProperties, config.excludeProperties) : [];

        dispatch(actions.syncing({
          itemsToCreate: itemsToCreatePropertiesFiltered,
          itemsToUpdate: itemsToUpdatePropertiesFiltered,
          itemsToDelete: itemsToDelete
        }));

        var createPromise = void 0;

        if (itemsToCreatePropertiesFiltered.length) {
          createPromise = Promise.all(itemsToCreatePropertiesFiltered.map(function (item) {
            return remoteActions.create(item, config).then(function (itemCreated) {
              return _extends({}, itemCreated, _defineProperty({}, _symbols2.default.metadataKey, item[_symbols2.default.metadataKey]));
            });
          }));
        } else {
          createPromise = Promise.resolve([]);
        }

        var updatePromise = itemsToUpdatePropertiesFiltered.length ? remoteActions.update(itemsToUpdatePropertiesFiltered, config) : Promise.resolve([]);

        var deletePromise = itemsToDelete.length ? remoteActions.delete(itemsToDelete, config) : Promise.resolve([]);

        return Promise.all([createPromise, updatePromise, deletePromise]).then(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 3),
              itemsCreated = _ref3[0],
              itemsUpdated = _ref3[1],
              itemsDeleted = _ref3[2];

          var syncSuccessActions = { itemsCreated: itemsCreated, itemsUpdated: itemsUpdated, itemsDeleted: itemsDeleted };
          return dispatch(actions.synced(syncSuccessActions, config));
        });
      };
    }
  };
};

module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, module) {/* 
(The MIT License)
Copyright (c) 2014 Halász Ádám <mail@adamhalasz.com>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//  Unique Hexatridecimal ID Generator
// ================================================

//  Dependencies
// ================================================
var pid = process && process.pid ? process.pid.toString(36) : '' ;
var mac =  false ? require('macaddress').one(macHandler) : null ;
var address = mac ? parseInt(mac.replace(/\:|\D+/gi, '')).toString(36) : '' ;

//  Exports
// ================================================
module.exports         = function(prefix){ return (prefix || '') + address + pid + now().toString(36); }
module.exports.process = function(prefix){ return (prefix || '')           + pid + now().toString(36); }
module.exports.time    = function(prefix){ return (prefix || '')                 + now().toString(36); }

//  Helpers
// ================================================
function now(){
    var time = Date.now();
    var last = now.last || time;
    return now.last = time > last ? time : last + 1;
}

function macHandler(error){
    if(module.parent && module.parent.uniqid_debug){
        if(error) console.error('Info: No mac address - uniqid() falls back to uniqid.process().', error)
        if(pid == '') console.error('Info: No process.pid - uniqid.process() falls back to uniqid.time().')
    }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(8)(module)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var actions = [
// fetch
'fetching', 'fetched',
// create
'createLocal', 'created',
// update
'updateLocal', 'updating', 'updated',
// delete
'deleteLocal', 'deleting', 'deleted',
// sync
'syncing', 'synced'];

exports.default = function (globalConfig) {
  var reducerKey = globalConfig.reducerPath.map(function (item) {
    return item.toUpperCase();
  }).join('_');
  var prefixReducer = 'REDUX_CRUD_MANAGER_' + reducerKey;
  var actionCreators = {};
  var actionReducers = {};

  actions.forEach(function (action) {
    var type = Symbol(prefixReducer + '_' + action);
    actionReducers[action] = type;
    actionCreators[action] = function (data, config) {
      return {
        type: type,
        data: data,
        config: config
      };
    };
  });

  return {
    actionCreators: actionCreators,
    actionReducers: actionReducers
  };
};

module.exports = exports['default'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutabilityHelper = __webpack_require__(11);

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _setMetadata = __webpack_require__(13);

var _symbols = __webpack_require__(0);

var _symbols2 = _interopRequireDefault(_symbols);

var _helpers = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var setMetadataState = function setMetadataState(state, stateMetadata) {
  var oldStateMetadata = state[_symbols2.default.metadataKey];
  var outputState = state.slice();
  outputState[_symbols2.default.metadataKey] = _extends({}, oldStateMetadata, stateMetadata);
  return outputState;
};

var localActions = { synced: false, syncing: false, fetching: false };
var pendingActions = { synced: false, syncing: true, fetching: false };
var successActions = { synced: true, syncing: false, fetching: false };

/**
 * @param {Object} defaultConfig
 * @param {Object} actionReducers
 */

exports.default = function (defaultConfig, actionReducers) {
  /**
   * @param {Object} localConfig
   * @param {int}    localConfig.startIndex
   * @param {Object} state
   * @param {Object} data
   */
  var fetchAction = function fetchAction(state, items) {
    var localConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var config = _extends({}, defaultConfig, localConfig);

    if (config.replace) {
      return items;
    }

    var newState = void 0;

    if (typeof config.startIndex === 'number') {
      var itemsToUpdate = {};
      items.forEach(function (item, index) {
        var nextIndex = config.startIndex + index;
        itemsToUpdate[nextIndex] = { $set: item };
      });

      newState = (0, _immutabilityHelper2.default)(state, itemsToUpdate);
    } else {
      var _itemsToUpdate = {};
      var itemToAdd = [];

      items.forEach(function (item) {
        var index = state.findIndex(function (_item) {
          return _item[config.idKey] === item[config.idKey];
        });

        if (index !== -1) {
          _itemsToUpdate[index] = { $set: item };
        } else {
          itemToAdd.push(item);
        }
      });

      newState = (0, _immutabilityHelper2.default)(state, { $push: itemToAdd });
      newState = (0, _immutabilityHelper2.default)(newState, _itemsToUpdate);
    }

    return newState;
  };

  var createAction = function createAction(state, data) {
    var localConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var config = _extends({}, defaultConfig, localConfig);

    var items = (0, _helpers.asArray)(data);

    items.forEach(function (dataItem) {
      if (state.find(function (item) {
        return item[config.idKey] === dataItem[config.idKey];
      })) {
        throw new Error('ReduxCRUDSync: item with id ' + dataItem[config.idKey] + ' already exist');
      }
    });

    var newState = (0, _immutabilityHelper2.default)(state, { $push: items });
    newState[_symbols2.default.metadataKey] = state[_symbols2.default.metadataKey];

    return newState;
  };

  var updateAction = function updateAction(state, data) {
    var localConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var config = _extends({}, defaultConfig, localConfig);

    var items = (0, _helpers.asArray)(data);

    var itemsToUpdate = {};

    items.forEach(function (item) {
      var id = item[config.idKey];
      var localId = item[_symbols2.default.metadataKey].localId;

      var index = void 0;
      var newItem = item;

      if (localId) {
        var _update;

        index = state.findIndex(function (_item) {
          return _item[_symbols2.default.metadataKey].localId === localId;
        });
        if (index === -1) {
          throw new Error('Redux Crud Manager: item with localId \'' + localId + '\' is undefined');
        }
        newItem = (0, _immutabilityHelper2.default)(item, (_update = {}, _defineProperty(_update, _symbols2.default.metadataKey, { localId: { $set: null } }), _defineProperty(_update, config.idKey, { $set: id }), _update));
      } else {
        index = state.findIndex(function (_item) {
          return _item[config.idKey] === id;
        });
        if (index === -1) {
          throw new Error('Redux Crud Manager: item with id \'' + id + '\' is undefined');
        }
      }

      if (config.merge) {
        itemsToUpdate[index] = { $set: _extends({}, state[index], newItem) };
      } else {
        itemsToUpdate[index] = { $set: newItem };
      }
    });

    return (0, _immutabilityHelper2.default)(state, itemsToUpdate);
  };

  var deleteAction = function deleteAction(_state, data) {
    var incomeItems = (0, _helpers.asArray)(data);

    var indexes = incomeItems.map(function (item) {
      return _state.findIndex(function (_item) {
        return _item[defaultConfig.idKey] === item[defaultConfig.idKey];
      });
    }).sort(function (a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    var state = _state;

    for (var i = indexes.length - 1; i >= 0; i -= 1) {
      state = (0, _immutabilityHelper2.default)(state, { $splice: [[indexes[i], 1]] });
    }

    return state;
  };

  var defaultState = [];

  defaultState[_symbols2.default.metadataKey] = {
    fetching: false,
    fetched: false,
    syncing: false,
    synced: false
  };

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments[1];

    switch (action.type) {
      /**
       * FETCH
       */
      case actionReducers.fetching:
        {
          return setMetadataState(state, { fetching: true });
        }

      case actionReducers.fetched:
        {
          var itemsMeta = _extends({}, successActions, { nextSync: null });
          var items = (0, _setMetadata.setMetadataForItems)(action.data, itemsMeta);
          var newState = fetchAction(state, items, action.config);
          var stateMeta = _extends({}, successActions, { fetched: true });
          return setMetadataState(newState, stateMeta);
        }

      /**
       * CREATE
       */
      case actionReducers.createLocal:
        {
          var _itemsMeta = _extends({}, localActions, { nextSync: 'create' });
          var _items = (0, _setMetadata.setMetadataForItems)(action.data, _itemsMeta);
          var _newState = createAction(state, _items, action.config);
          return setMetadataState(_newState, localActions);
        }

      case actionReducers.created:
        {
          var _itemsMeta2 = _extends({}, successActions, { nextSync: null });
          var _items2 = (0, _setMetadata.setMetadataForItems)(action.data, _itemsMeta2);
          var _newState2 = createAction(state, _items2, action.config);
          return setMetadataState(_newState2, successActions);
        }

      /**
       * UPDATE
       */
      case actionReducers.updateLocal:
        {
          var _itemsMeta3 = _extends({}, localActions, { nextSync: 'update' });
          var _items3 = (0, _setMetadata.setMetadataForItems)(action.data, _itemsMeta3);
          var _newState3 = updateAction(state, _items3, action.config);
          return setMetadataState(_newState3, localActions);
        }

      case actionReducers.updating:
        {
          var itemsforKeys = (0, _helpers.asArray)(action.data);
          var keys = itemsforKeys.map(function (item) {
            return Object.keys(item).filter(function (key) {
              return key !== defaultConfig.idKey;
            });
          }).reduce(function (a, b) {
            return [].concat(_toConsumableArray(a), _toConsumableArray(b));
          });
          var keysUnique = Array.unique(keys);

          var _itemsMeta4 = _extends({}, pendingActions, { nextSync: 'update', keys: keysUnique });
          var _items4 = (0, _setMetadata.setMetadataForItems)(action.data, _itemsMeta4);
          var _newState4 = updateAction(state, _items4, action.config);
          return setMetadataState(_newState4, pendingActions);
        }

      case actionReducers.updated:
        {
          var _itemsMeta5 = _extends({}, successActions, { nextSync: null, keys: null });
          var _items5 = (0, _setMetadata.setMetadataForItems)(action.data, _itemsMeta5);
          var _newState5 = updateAction(state, _items5, action.config);
          return setMetadataState(_newState5, successActions);
        }

      /**
       * DELETE
       */
      case actionReducers.deleteLocal:
        {
          var _itemsMeta6 = _extends({}, localActions, { nextSync: 'delete', deleted: true });
          var _items6 = (0, _setMetadata.setMetadataForItems)(action.data, _itemsMeta6);
          var _newState6 = updateAction(state, _items6, action.config);
          return setMetadataState(_newState6, localActions);
        }

      case actionReducers.deleting:
        {
          var _itemsMeta7 = _extends({}, pendingActions, { nextSync: 'delete', deleted: true });
          var _items7 = (0, _setMetadata.setMetadataForItems)(action.data, _itemsMeta7);
          var _newState7 = updateAction(state, _items7, action.config);
          return setMetadataState(_newState7, pendingActions);
        }

      case actionReducers.deleted:
        {
          var _itemsMeta8 = _extends({}, successActions, { nextSync: null });
          var _items8 = (0, _setMetadata.setMetadataForItems)(action.data, _itemsMeta8);
          var _newState8 = deleteAction(state, _items8, action.config);
          return setMetadataState(_newState8, successActions);
        }

      /**
       * SYNC
       */
      case actionReducers.syncing:
        {
          var itemsToCreate = (0, _setMetadata.setMetadataForItems)(action.data.itemsToCreate, _extends({}, pendingActions, { nextSync: 'create' }));

          var itemsToUpdate = (0, _setMetadata.setMetadataForItems)(action.data.itemsToUpdate, _extends({}, pendingActions, { nextSync: 'update' }));

          var itemsToDelete = (0, _setMetadata.setMetadataForItems)(action.data.itemsToDelete, _extends({}, pendingActions, { deleted: true, nextSync: 'delete' }));

          var outputState = state;

          outputState = updateAction(outputState, itemsToCreate, action.config);
          outputState = updateAction(outputState, itemsToUpdate, action.config);
          outputState = updateAction(outputState, itemsToDelete, action.config);

          return setMetadataState(outputState, pendingActions);
        }

      case actionReducers.synced:
        {
          var itemsCreated = (0, _setMetadata.setMetadataForItems)(action.data.itemsCreated, _extends({}, successActions, { nextSync: null }));

          var itemsUpdated = (0, _setMetadata.setMetadataForItems)(action.data.itemsUpdated, _extends({}, successActions, { nextSync: null }));

          var itemsDeleted = (0, _setMetadata.setMetadataForItems)(action.data.itemsDeleted, _extends({}, successActions, { deleted: true, nextSync: null }));

          var _outputState = state;

          _outputState = updateAction(_outputState, itemsCreated, action.config);
          _outputState = updateAction(_outputState, itemsUpdated, action.config);
          _outputState = deleteAction(_outputState, itemsDeleted, action.config);

          return setMetadataState(_outputState, successActions);
        }

      default:

        return state;
    }
  };
};

module.exports = exports['default'];

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var invariant = __webpack_require__(12);

var hasOwnProperty = Object.prototype.hasOwnProperty;
var splice = Array.prototype.splice;

var toString = Object.prototype.toString
var type = function(obj) {
  return toString.call(obj).slice(8, -1);
}

var assign = Object.assign || /* istanbul ignore next */ function assign(target, source) {
  getAllKeys(source).forEach(function(key) {
    if (hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  });
  return target;
};

var getAllKeys = typeof Object.getOwnPropertySymbols === 'function' ?
  function(obj) { return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj)) } :
  /* istanbul ignore next */ function(obj) { return Object.keys(obj) };

/* istanbul ignore next */
function copy(object) {
  if (Array.isArray(object)) {
    return assign(object.constructor(object.length), object)
  } else if (type(object) === 'Map') {
    return new Map(object)
  } else if (type(object) === 'Set') {
    return new Set(object)
  } else if (object && typeof object === 'object') {
    var prototype = object.constructor && object.constructor.prototype
    return assign(Object.create(prototype || null), object);
  } else {
    return object;
  }
}

function newContext() {
  var commands = assign({}, defaultCommands);
  update.extend = function(directive, fn) {
    commands[directive] = fn;
  };
  update.isEquals = function(a, b) { return a === b; };

  return update;

  function update(object, spec) {
    if (typeof spec === 'function') {
      return spec(object);
    }

    if (!(Array.isArray(object) && Array.isArray(spec))) {
      invariant(
        !Array.isArray(spec),
        'update(): You provided an invalid spec to update(). The spec may ' +
        'not contain an array except as the value of $set, $push, $unshift, ' +
        '$splice or any custom command allowing an array value.'
      );
    }

    invariant(
      typeof spec === 'object' && spec !== null,
      'update(): You provided an invalid spec to update(). The spec and ' +
      'every included key path must be plain objects containing one of the ' +
      'following commands: %s.',
      Object.keys(commands).join(', ')
    );

    var nextObject = object;
    var index, key;
    getAllKeys(spec).forEach(function(key) {
      if (hasOwnProperty.call(commands, key)) {
        var objectWasNextObject = object === nextObject;
        nextObject = commands[key](spec[key], nextObject, spec, object);
        if (objectWasNextObject && update.isEquals(nextObject, object)) {
          nextObject = object;
        }
      } else {
        var nextValueForKey = update(object[key], spec[key]);
        if (!update.isEquals(nextValueForKey, nextObject[key]) || typeof nextValueForKey === 'undefined' && !hasOwnProperty.call(object, key)) {
          if (nextObject === object) {
            nextObject = copy(object);
          }
          nextObject[key] = nextValueForKey;
        }
      }
    })
    return nextObject;
  }

}

var defaultCommands = {
  $push: function(value, nextObject, spec) {
    invariantPushAndUnshift(nextObject, spec, '$push');
    return value.length ? nextObject.concat(value) : nextObject;
  },
  $unshift: function(value, nextObject, spec) {
    invariantPushAndUnshift(nextObject, spec, '$unshift');
    return value.length ? value.concat(nextObject) : nextObject;
  },
  $splice: function(value, nextObject, spec, originalObject) {
    invariantSplices(nextObject, spec);
    value.forEach(function(args) {
      invariantSplice(args);
      if (nextObject === originalObject && args.length) nextObject = copy(originalObject);
      splice.apply(nextObject, args);
    });
    return nextObject;
  },
  $set: function(value, nextObject, spec) {
    invariantSet(spec);
    return value;
  },
  $toggle: function(targets, nextObject) {
    invariantSpecArray(targets, '$toggle');
    var nextObjectCopy = targets.length ? copy(nextObject) : nextObject;

    targets.forEach(function(target) {
      nextObjectCopy[target] = !nextObject[target];
    });

    return nextObjectCopy;
  },
  $unset: function(value, nextObject, spec, originalObject) {
    invariantSpecArray(value, '$unset');
    value.forEach(function(key) {
      if (Object.hasOwnProperty.call(nextObject, key)) {
        if (nextObject === originalObject) nextObject = copy(originalObject);
        delete nextObject[key];
      }
    });
    return nextObject;
  },
  $add: function(value, nextObject, spec, originalObject) {
    invariantMapOrSet(nextObject, '$add');
    invariantSpecArray(value, '$add');
    if (type(nextObject) === 'Map') {
      value.forEach(function(pair) {
        var key = pair[0];
        var value = pair[1];
        if (nextObject === originalObject && nextObject.get(key) !== value) nextObject = copy(originalObject);
        nextObject.set(key, value);
      });
    } else {
      value.forEach(function(value) {
        if (nextObject === originalObject && !nextObject.has(value)) nextObject = copy(originalObject);
        nextObject.add(value);
      });
    }
    return nextObject;
  },
  $remove: function(value, nextObject, spec, originalObject) {
    invariantMapOrSet(nextObject, '$remove');
    invariantSpecArray(value, '$remove');
    value.forEach(function(key) {
      if (nextObject === originalObject && nextObject.has(key)) nextObject = copy(originalObject);
      nextObject.delete(key);
    });
    return nextObject;
  },
  $merge: function(value, nextObject, spec, originalObject) {
    invariantMerge(nextObject, value);
    getAllKeys(value).forEach(function(key) {
      if (value[key] !== nextObject[key]) {
        if (nextObject === originalObject) nextObject = copy(originalObject);
        nextObject[key] = value[key];
      }
    });
    return nextObject;
  },
  $apply: function(value, original) {
    invariantApply(value);
    return value(original);
  }
};

module.exports = newContext();
module.exports.newContext = newContext;

// invariants

function invariantPushAndUnshift(value, spec, command) {
  invariant(
    Array.isArray(value),
    'update(): expected target of %s to be an array; got %s.',
    command,
    value
  );
  invariantSpecArray(spec[command], command)
}

function invariantSpecArray(spec, command) {
  invariant(
    Array.isArray(spec),
    'update(): expected spec of %s to be an array; got %s. ' +
    'Did you forget to wrap your parameter in an array?',
    command,
    spec
  );
}

function invariantSplices(value, spec) {
  invariant(
    Array.isArray(value),
    'Expected $splice target to be an array; got %s',
    value
  );
  invariantSplice(spec['$splice']);
}

function invariantSplice(value) {
  invariant(
    Array.isArray(value),
    'update(): expected spec of $splice to be an array of arrays; got %s. ' +
    'Did you forget to wrap your parameters in an array?',
    value
  );
}

function invariantApply(fn) {
  invariant(
    typeof fn === 'function',
    'update(): expected spec of $apply to be a function; got %s.',
    fn
  );
}

function invariantSet(spec) {
  invariant(
    Object.keys(spec).length === 1,
    'Cannot have more than one key in an object with $set'
  );
}

function invariantMerge(target, specValue) {
  invariant(
    specValue && typeof specValue === 'object',
    'update(): $merge expects a spec of type \'object\'; got %s',
    specValue
  );
  invariant(
    target && typeof target === 'object',
    'update(): $merge expects a target of type \'object\'; got %s',
    target
  );
}

function invariantMapOrSet(target, command) {
  var typeOfTarget = type(target);
  invariant(
    typeOfTarget === 'Map' || typeOfTarget === 'Set',
    'update(): %s expects a target of type Set or Map; got %s',
    command,
    typeOfTarget
  );
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMetadataForItems = exports.setMetadata = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _symbols = __webpack_require__(0);

var _symbols2 = _interopRequireDefault(_symbols);

var _helpers = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var setMetadata = exports.setMetadata = function setMetadata(item, dataState) {
  return _defineProperty({}, _symbols2.default.metadataKey, _extends({
    syncing: false,
    synced: false,
    nextSync: item[_symbols2.default.metadataKey] && item[_symbols2.default.metadataKey].nextSync || null,
    lastLocalUpdate: null,
    lastRemoteUpdate: null,
    localId: item[_symbols2.default.metadataKey] && item[_symbols2.default.metadataKey].localId
  }, dataState));
};

var setMetadataForItems = exports.setMetadataForItems = function setMetadataForItems(items, data) {
  return (0, _helpers.asArray)(items).map(function (item) {
    return _extends({}, item, setMetadata(item, data));
  });
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _symbols = __webpack_require__(0);

var _symbols2 = _interopRequireDefault(_symbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (data) {
  return data[_symbols2.default.metadataKey];
};

module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=ReduxCrudManager.js.map