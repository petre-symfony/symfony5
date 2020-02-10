(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendors~admin_article_form"],{

/***/ "./node_modules/core-js/internals/a-possible-prototype.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/a-possible-prototype.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-instance.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/an-instance.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-method-has-species-support.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/internals/array-method-has-species-support.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-method-is-strict.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/array-method-is-strict.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/internals/call-with-safe-iteration-closing.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/check-correctness-of-iteration.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/check-correctness-of-iteration.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/collection-weak.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/collection-weak.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefineAll = __webpack_require__(/*! ../internals/redefine-all */ "./node_modules/core-js/internals/redefine-all.js");
var getWeakData = __webpack_require__(/*! ../internals/internal-metadata */ "./node_modules/core-js/internals/internal-metadata.js").getWeakData;
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var ArrayIterationModule = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js");
var $has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;
var find = ArrayIterationModule.find;
var findIndex = ArrayIterationModule.findIndex;
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (store) {
  return store.frozen || (store.frozen = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function () {
  this.entries = [];
};

var findUncaughtFrozen = function (store, key) {
  return find(store.entries, function (it) {
    return it[0] === key;
  });
};

UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.entries.push([key, value]);
  },
  'delete': function (key) {
    var index = findIndex(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) this.entries.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        id: id++,
        frozen: undefined
      });
      if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var data = getWeakData(anObject(key), true);
      if (data === true) uncaughtFrozenStore(state).set(key, value);
      else data[state.id] = value;
      return that;
    };

    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
        return data && $has(data, state.id) && delete data[state.id];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state).has(key);
        return data && $has(data, state.id);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.3.3.3 WeakMap.prototype.get(key)
      get: function get(key) {
        var state = getInternalState(this);
        if (isObject(key)) {
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).get(key);
          return data ? data[state.id] : undefined;
        }
      },
      // 23.3.3.5 WeakMap.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key, value);
      }
    } : {
      // 23.4.3.1 WeakSet.prototype.add(value)
      add: function add(value) {
        return define(this, value, true);
      }
    });

    return C;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/collection.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/collection.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var InternalMetadataModule = __webpack_require__(/*! ../internals/internal-metadata */ "./node_modules/core-js/internals/internal-metadata.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js/internals/check-correctness-of-iteration.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var inheritIfRequired = __webpack_require__(/*! ../internals/inherit-if-required */ "./node_modules/core-js/internals/inherit-if-required.js");

module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  // eslint-disable-next-line max-len
  if (isForced(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
    new NativeConstructor().entries().next();
  })))) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.REQUIRED = true;
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};


/***/ }),

/***/ "./node_modules/core-js/internals/correct-prototype-getter.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "./node_modules/core-js/internals/create-iterator-constructor.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-iterator-constructor.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype;
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/create-property.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-iterator.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-iterator.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/create-iterator-constructor */ "./node_modules/core-js/internals/create-iterator-constructor.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js");

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),

/***/ "./node_modules/core-js/internals/dom-iterables.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/dom-iterables.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "./node_modules/core-js/internals/engine-is-ios.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/engine-is-ios.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);


/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),

/***/ "./node_modules/core-js/internals/freezing.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/freezing.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});


/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator-method.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator-method.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js/internals/host-report-errors.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/host-report-errors.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/inherit-if-required.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/inherit-if-required.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ "./node_modules/core-js/internals/internal-metadata.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/internal-metadata.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f;
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var FREEZING = __webpack_require__(/*! ../internals/freezing */ "./node_modules/core-js/internals/freezing.js");

var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;


/***/ }),

/***/ "./node_modules/core-js/internals/is-array-iterator-method.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/is-array-iterator-method.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterate.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/iterate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js/internals/is-array-iterator-method.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js");

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = bind(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, next, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterators-core.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterators-core.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterators.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/iterators.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/microtask.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/microtask.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getOwnPropertyDescriptor = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f;
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var macrotask = __webpack_require__(/*! ../internals/task */ "./node_modules/core-js/internals/task.js").set;
var IS_IOS = __webpack_require__(/*! ../internals/engine-is-ios */ "./node_modules/core-js/internals/engine-is-ios.js");

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var IS_NODE = classof(process) == 'process';
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  } else if (MutationObserver && !IS_IOS) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};


/***/ }),

/***/ "./node_modules/core-js/internals/native-promise-constructor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/native-promise-constructor.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

module.exports = global.Promise;


/***/ }),

/***/ "./node_modules/core-js/internals/new-promise-capability.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/new-promise-capability.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(/*! ../internals/a-function */ "./node_modules/core-js/internals/a-function.js");

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "./node_modules/core-js/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "./node_modules/core-js/internals/object-to-string.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/object-to-string.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ "./node_modules/core-js/internals/perform.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/perform.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/promise-resolve.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/promise-resolve.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var newPromiseCapability = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js/internals/new-promise-capability.js");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "./node_modules/core-js/internals/redefine-all.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/redefine-all.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-species.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/set-species.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-to-string-tag.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/set-to-string-tag.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f;
var has = __webpack_require__(/*! ../internals/has */ "./node_modules/core-js/internals/has.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/species-constructor.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/species-constructor.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var aFunction = __webpack_require__(/*! ../internals/a-function */ "./node_modules/core-js/internals/a-function.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};


/***/ }),

/***/ "./node_modules/core-js/internals/string-multibyte.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/string-multibyte.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ../internals/to-integer */ "./node_modules/core-js/internals/to-integer.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js/internals/task.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/task.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js/internals/html.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");
var IS_IOS = __webpack_require__(/*! ../internals/engine-is-ios */ "./node_modules/core-js/internals/engine-is-ios.js");

var location = global.location;
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (classof(process) == 'process') {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts && !fails(post)) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.concat.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.concat.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.filter.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.filter.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $filter = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").filter;
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var arrayMethodUsesToLength = __webpack_require__(/*! ../internals/array-method-uses-to-length */ "./node_modules/core-js/internals/array-method-uses-to-length.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.iterator.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.iterator.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var defineIterator = __webpack_require__(/*! ../internals/define-iterator */ "./node_modules/core-js/internals/define-iterator.js");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.join.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.join.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js/internals/array-method-is-strict.js");

var nativeJoin = [].join;

var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.github.io/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.map.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.map.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $map = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").map;
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var arrayMethodUsesToLength = __webpack_require__(/*! ../internals/array-method-uses-to-length */ "./node_modules/core-js/internals/array-method-uses-to-length.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
// FF49- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('map');

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.define-property.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.define-property.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var objectDefinePropertyModile = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: objectDefinePropertyModile.f
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.to-string.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var toString = __webpack_require__(/*! ../internals/object-to-string */ "./node_modules/core-js/internals/object-to-string.js");

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.promise.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/es.promise.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var NativePromise = __webpack_require__(/*! ../internals/native-promise-constructor */ "./node_modules/core-js/internals/native-promise-constructor.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var redefineAll = __webpack_require__(/*! ../internals/redefine-all */ "./node_modules/core-js/internals/redefine-all.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var setSpecies = __webpack_require__(/*! ../internals/set-species */ "./node_modules/core-js/internals/set-species.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var aFunction = __webpack_require__(/*! ../internals/a-function */ "./node_modules/core-js/internals/a-function.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js/internals/check-correctness-of-iteration.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js/internals/species-constructor.js");
var task = __webpack_require__(/*! ../internals/task */ "./node_modules/core-js/internals/task.js").set;
var microtask = __webpack_require__(/*! ../internals/microtask */ "./node_modules/core-js/internals/microtask.js");
var promiseResolve = __webpack_require__(/*! ../internals/promise-resolve */ "./node_modules/core-js/internals/promise-resolve.js");
var hostReportErrors = __webpack_require__(/*! ../internals/host-report-errors */ "./node_modules/core-js/internals/host-report-errors.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js/internals/perform.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var PromiseConstructor = NativePromise;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var IS_NODE = classof(process) == 'process';
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (V8_VERSION === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!IS_NODE && typeof PromiseRejectionEvent != 'function') return true;
  }
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromiseConstructor.prototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (promise, state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(promise, state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (handler = global['on' + name]) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (promise, state) {
  task.call(global, function () {
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (promise, state) {
  task.call(global, function () {
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, promise, state, unwrap) {
  return function (value) {
    fn(promise, state, value, unwrap);
  };
};

var internalReject = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(promise, state, true);
};

var internalResolve = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, promise, wrapper, state),
            bind(internalReject, promise, wrapper, state)
          );
        } catch (error) {
          internalReject(promise, wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(promise, state, false);
    }
  } catch (error) {
    internalReject(promise, { done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
    } catch (error) {
      internalReject(this, state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(this, state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, promise, state);
    this.reject = bind(internalReject, promise, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && typeof NativePromise == 'function') {
    nativeThen = NativePromise.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(NativePromise.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') $({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
      }
    });
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.github.io/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.github.io/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.github.io/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.github.io/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.iterator.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js/internals/string-multibyte.js").charAt;
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var defineIterator = __webpack_require__(/*! ../internals/define-iterator */ "./node_modules/core-js/internals/define-iterator.js");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.weak-set.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/es.weak-set.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var collection = __webpack_require__(/*! ../internals/collection */ "./node_modules/core-js/internals/collection.js");
var collectionWeak = __webpack_require__(/*! ../internals/collection-weak */ "./node_modules/core-js/internals/collection-weak.js");

// `WeakSet` constructor
// https://tc39.github.io/ecma262/#sec-weakset-constructor
collection('WeakSet', function (init) {
  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionWeak);


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-collections.iterator.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.iterator.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js/internals/dom-iterables.js");
var ArrayIteratorMethods = __webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}


/***/ }),

/***/ "./node_modules/dropzone/dist/dropzone.css":
/*!*************************************************!*\
  !*** ./node_modules/dropzone/dist/dropzone.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/dropzone/dist/dropzone.js":
/*!************************************************!*\
  !*** ./node_modules/dropzone/dist/dropzone.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery, module) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

// The Emitter class provides the ability to call `.on()` on Dropzone to listen
// to events.
// It is strongly based on component's emitter class, and I removed the
// functionality because of the dependency hell with different frameworks.
var Emitter = function () {
  function Emitter() {
    _classCallCheck(this, Emitter);
  }

  _createClass(Emitter, [{
    key: "on",

    // Add an event listener for given event
    value: function on(event, fn) {
      this._callbacks = this._callbacks || {};
      // Create namespace for this event
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }
      this._callbacks[event].push(fn);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      this._callbacks = this._callbacks || {};
      var callbacks = this._callbacks[event];

      if (callbacks) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        for (var _iterator = callbacks, _isArray = true, _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var callback = _ref;

          callback.apply(this, args);
        }
      }

      return this;
    }

    // Remove event listener for given event. If fn is not provided, all event
    // listeners for that event will be removed. If neither is provided, all
    // event listeners will be removed.

  }, {
    key: "off",
    value: function off(event, fn) {
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }

      // remove all handlers
      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      }

      // remove specific handler
      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];
        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      return this;
    }
  }]);

  return Emitter;
}();

var Dropzone = function (_Emitter) {
  _inherits(Dropzone, _Emitter);

  _createClass(Dropzone, null, [{
    key: "initClass",
    value: function initClass() {

      // Exposing the emitter class, mainly for tests
      this.prototype.Emitter = Emitter;

      /*
       This is a list of all available events you can register on a dropzone object.
        You can register an event handler like this:
        dropzone.on("dragEnter", function() { });
        */
      this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

      this.prototype.defaultOptions = {
        /**
         * Has to be specified on elements other than form (or when the form
         * doesn't have an `action` attribute). You can also
         * provide a function that will be called with `files` and
         * must return the url (since `v3.12.0`)
         */
        url: null,

        /**
         * Can be changed to `"put"` if necessary. You can also provide a function
         * that will be called with `files` and must return the method (since `v3.12.0`).
         */
        method: "post",

        /**
         * Will be set on the XHRequest.
         */
        withCredentials: false,

        /**
         * The timeout for the XHR requests in milliseconds (since `v4.4.0`).
         */
        timeout: 30000,

        /**
         * How many file uploads to process in parallel (See the
         * Enqueuing file uploads* documentation section for more info)
         */
        parallelUploads: 2,

        /**
         * Whether to send multiple files in one request. If
         * this it set to true, then the fallback file input element will
         * have the `multiple` attribute as well. This option will
         * also trigger additional events (like `processingmultiple`). See the events
         * documentation section for more information.
         */
        uploadMultiple: false,

        /**
         * Whether you want files to be uploaded in chunks to your server. This can't be
         * used in combination with `uploadMultiple`.
         *
         * See [chunksUploaded](#config-chunksUploaded) for the callback to finalise an upload.
         */
        chunking: false,

        /**
         * If `chunking` is enabled, this defines whether **every** file should be chunked,
         * even if the file size is below chunkSize. This means, that the additional chunk
         * form data will be submitted and the `chunksUploaded` callback will be invoked.
         */
        forceChunking: false,

        /**
         * If `chunking` is `true`, then this defines the chunk size in bytes.
         */
        chunkSize: 2000000,

        /**
         * If `true`, the individual chunks of a file are being uploaded simultaneously.
         */
        parallelChunkUploads: false,

        /**
         * Whether a chunk should be retried if it fails.
         */
        retryChunks: false,

        /**
         * If `retryChunks` is true, how many times should it be retried.
         */
        retryChunksLimit: 3,

        /**
         * If not `null` defines how many files this Dropzone handles. If it exceeds,
         * the event `maxfilesexceeded` will be called. The dropzone element gets the
         * class `dz-max-files-reached` accordingly so you can provide visual feedback.
         */
        maxFilesize: 256,

        /**
         * The name of the file param that gets transferred.
         * **NOTE**: If you have the option  `uploadMultiple` set to `true`, then
         * Dropzone will append `[]` to the name.
         */
        paramName: "file",

        /**
         * Whether thumbnails for images should be generated
         */
        createImageThumbnails: true,

        /**
         * In MB. When the filename exceeds this limit, the thumbnail will not be generated.
         */
        maxThumbnailFilesize: 10,

        /**
         * If `null`, the ratio of the image will be used to calculate it.
         */
        thumbnailWidth: 120,

        /**
         * The same as `thumbnailWidth`. If both are null, images will not be resized.
         */
        thumbnailHeight: 120,

        /**
         * How the images should be scaled down in case both, `thumbnailWidth` and `thumbnailHeight` are provided.
         * Can be either `contain` or `crop`.
         */
        thumbnailMethod: 'crop',

        /**
         * If set, images will be resized to these dimensions before being **uploaded**.
         * If only one, `resizeWidth` **or** `resizeHeight` is provided, the original aspect
         * ratio of the file will be preserved.
         *
         * The `options.transformFile` function uses these options, so if the `transformFile` function
         * is overridden, these options don't do anything.
         */
        resizeWidth: null,

        /**
         * See `resizeWidth`.
         */
        resizeHeight: null,

        /**
         * The mime type of the resized image (before it gets uploaded to the server).
         * If `null` the original mime type will be used. To force jpeg, for example, use `image/jpeg`.
         * See `resizeWidth` for more information.
         */
        resizeMimeType: null,

        /**
         * The quality of the resized images. See `resizeWidth`.
         */
        resizeQuality: 0.8,

        /**
         * How the images should be scaled down in case both, `resizeWidth` and `resizeHeight` are provided.
         * Can be either `contain` or `crop`.
         */
        resizeMethod: 'contain',

        /**
         * The base that is used to calculate the filesize. You can change this to
         * 1024 if you would rather display kibibytes, mebibytes, etc...
         * 1024 is technically incorrect, because `1024 bytes` are `1 kibibyte` not `1 kilobyte`.
         * You can change this to `1024` if you don't care about validity.
         */
        filesizeBase: 1000,

        /**
         * Can be used to limit the maximum number of files that will be handled by this Dropzone
         */
        maxFiles: null,

        /**
         * An optional object to send additional headers to the server. Eg:
         * `{ "My-Awesome-Header": "header value" }`
         */
        headers: null,

        /**
         * If `true`, the dropzone element itself will be clickable, if `false`
         * nothing will be clickable.
         *
         * You can also pass an HTML element, a CSS selector (for multiple elements)
         * or an array of those. In that case, all of those elements will trigger an
         * upload when clicked.
         */
        clickable: true,

        /**
         * Whether hidden files in directories should be ignored.
         */
        ignoreHiddenFiles: true,

        /**
         * The default implementation of `accept` checks the file's mime type or
         * extension against this list. This is a comma separated list of mime
         * types or file extensions.
         *
         * Eg.: `image/*,application/pdf,.psd`
         *
         * If the Dropzone is `clickable` this option will also be used as
         * [`accept`](https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept)
         * parameter on the hidden file input as well.
         */
        acceptedFiles: null,

        /**
         * **Deprecated!**
         * Use acceptedFiles instead.
         */
        acceptedMimeTypes: null,

        /**
         * If false, files will be added to the queue but the queue will not be
         * processed automatically.
         * This can be useful if you need some additional user input before sending
         * files (or if you want want all files sent at once).
         * If you're ready to send the file simply call `myDropzone.processQueue()`.
         *
         * See the [enqueuing file uploads](#enqueuing-file-uploads) documentation
         * section for more information.
         */
        autoProcessQueue: true,

        /**
         * If false, files added to the dropzone will not be queued by default.
         * You'll have to call `enqueueFile(file)` manually.
         */
        autoQueue: true,

        /**
         * If `true`, this will add a link to every file preview to remove or cancel (if
         * already uploading) the file. The `dictCancelUpload`, `dictCancelUploadConfirmation`
         * and `dictRemoveFile` options are used for the wording.
         */
        addRemoveLinks: false,

        /**
         * Defines where to display the file previews – if `null` the
         * Dropzone element itself is used. Can be a plain `HTMLElement` or a CSS
         * selector. The element should have the `dropzone-previews` class so
         * the previews are displayed properly.
         */
        previewsContainer: null,

        /**
         * This is the element the hidden input field (which is used when clicking on the
         * dropzone to trigger file selection) will be appended to. This might
         * be important in case you use frameworks to switch the content of your page.
         *
         * Can be a selector string, or an element directly.
         */
        hiddenInputContainer: "body",

        /**
         * If null, no capture type will be specified
         * If camera, mobile devices will skip the file selection and choose camera
         * If microphone, mobile devices will skip the file selection and choose the microphone
         * If camcorder, mobile devices will skip the file selection and choose the camera in video mode
         * On apple devices multiple must be set to false.  AcceptedFiles may need to
         * be set to an appropriate mime type (e.g. "image/*", "audio/*", or "video/*").
         */
        capture: null,

        /**
         * **Deprecated**. Use `renameFile` instead.
         */
        renameFilename: null,

        /**
         * A function that is invoked before the file is uploaded to the server and renames the file.
         * This function gets the `File` as argument and can use the `file.name`. The actual name of the
         * file that gets used during the upload can be accessed through `file.upload.filename`.
         */
        renameFile: null,

        /**
         * If `true` the fallback will be forced. This is very useful to test your server
         * implementations first and make sure that everything works as
         * expected without dropzone if you experience problems, and to test
         * how your fallbacks will look.
         */
        forceFallback: false,

        /**
         * The text used before any files are dropped.
         */
        dictDefaultMessage: "Drop files here to upload",

        /**
         * The text that replaces the default message text it the browser is not supported.
         */
        dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",

        /**
         * The text that will be added before the fallback form.
         * If you provide a  fallback element yourself, or if this option is `null` this will
         * be ignored.
         */
        dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",

        /**
         * If the filesize is too big.
         * `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
         */
        dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",

        /**
         * If the file doesn't match the file type.
         */
        dictInvalidFileType: "You can't upload files of this type.",

        /**
         * If the server response was invalid.
         * `{{statusCode}}` will be replaced with the servers status code.
         */
        dictResponseError: "Server responded with {{statusCode}} code.",

        /**
         * If `addRemoveLinks` is true, the text to be used for the cancel upload link.
         */
        dictCancelUpload: "Cancel upload",

        /**
         * The text that is displayed if an upload was manually canceled
         */
        dictUploadCanceled: "Upload canceled.",

        /**
         * If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
         */
        dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",

        /**
         * If `addRemoveLinks` is true, the text to be used to remove a file.
         */
        dictRemoveFile: "Remove file",

        /**
         * If this is not null, then the user will be prompted before removing a file.
         */
        dictRemoveFileConfirmation: null,

        /**
         * Displayed if `maxFiles` is st and exceeded.
         * The string `{{maxFiles}}` will be replaced by the configuration value.
         */
        dictMaxFilesExceeded: "You can not upload any more files.",

        /**
         * Allows you to translate the different units. Starting with `tb` for terabytes and going down to
         * `b` for bytes.
         */
        dictFileSizeUnits: { tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b" },
        /**
         * Called when dropzone initialized
         * You can add event listeners here
         */
        init: function init() {},


        /**
         * Can be an **object** of additional parameters to transfer to the server, **or** a `Function`
         * that gets invoked with the `files`, `xhr` and, if it's a chunked upload, `chunk` arguments. In case
         * of a function, this needs to return a map.
         *
         * The default implementation does nothing for normal uploads, but adds relevant information for
         * chunked uploads.
         *
         * This is the same as adding hidden input fields in the form element.
         */
        params: function params(files, xhr, chunk) {
          if (chunk) {
            return {
              dzuuid: chunk.file.upload.uuid,
              dzchunkindex: chunk.index,
              dztotalfilesize: chunk.file.size,
              dzchunksize: this.options.chunkSize,
              dztotalchunkcount: chunk.file.upload.totalChunkCount,
              dzchunkbyteoffset: chunk.index * this.options.chunkSize
            };
          }
        },


        /**
         * A function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File)
         * and a `done` function as parameters.
         *
         * If the done function is invoked without arguments, the file is "accepted" and will
         * be processed. If you pass an error message, the file is rejected, and the error
         * message will be displayed.
         * This function will not be called if the file is too big or doesn't match the mime types.
         */
        accept: function accept(file, done) {
          return done();
        },


        /**
         * The callback that will be invoked when all chunks have been uploaded for a file.
         * It gets the file for which the chunks have been uploaded as the first parameter,
         * and the `done` function as second. `done()` needs to be invoked when everything
         * needed to finish the upload process is done.
         */
        chunksUploaded: function chunksUploaded(file, done) {
          done();
        },

        /**
         * Gets called when the browser is not supported.
         * The default implementation shows the fallback input field and adds
         * a text.
         */
        fallback: function fallback() {
          // This code should pass in IE7... :(
          var messageElement = void 0;
          this.element.className = this.element.className + " dz-browser-not-supported";

          for (var _iterator2 = this.element.getElementsByTagName("div"), _isArray2 = true, _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref2 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref2 = _i2.value;
            }

            var child = _ref2;

            if (/(^| )dz-message($| )/.test(child.className)) {
              messageElement = child;
              child.className = "dz-message"; // Removes the 'dz-default' class
              break;
            }
          }
          if (!messageElement) {
            messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
            this.element.appendChild(messageElement);
          }

          var span = messageElement.getElementsByTagName("span")[0];
          if (span) {
            if (span.textContent != null) {
              span.textContent = this.options.dictFallbackMessage;
            } else if (span.innerText != null) {
              span.innerText = this.options.dictFallbackMessage;
            }
          }

          return this.element.appendChild(this.getFallbackForm());
        },


        /**
         * Gets called to calculate the thumbnail dimensions.
         *
         * It gets `file`, `width` and `height` (both may be `null`) as parameters and must return an object containing:
         *
         *  - `srcWidth` & `srcHeight` (required)
         *  - `trgWidth` & `trgHeight` (required)
         *  - `srcX` & `srcY` (optional, default `0`)
         *  - `trgX` & `trgY` (optional, default `0`)
         *
         * Those values are going to be used by `ctx.drawImage()`.
         */
        resize: function resize(file, width, height, resizeMethod) {
          var info = {
            srcX: 0,
            srcY: 0,
            srcWidth: file.width,
            srcHeight: file.height
          };

          var srcRatio = file.width / file.height;

          // Automatically calculate dimensions if not specified
          if (width == null && height == null) {
            width = info.srcWidth;
            height = info.srcHeight;
          } else if (width == null) {
            width = height * srcRatio;
          } else if (height == null) {
            height = width / srcRatio;
          }

          // Make sure images aren't upscaled
          width = Math.min(width, info.srcWidth);
          height = Math.min(height, info.srcHeight);

          var trgRatio = width / height;

          if (info.srcWidth > width || info.srcHeight > height) {
            // Image is bigger and needs rescaling
            if (resizeMethod === 'crop') {
              if (srcRatio > trgRatio) {
                info.srcHeight = file.height;
                info.srcWidth = info.srcHeight * trgRatio;
              } else {
                info.srcWidth = file.width;
                info.srcHeight = info.srcWidth / trgRatio;
              }
            } else if (resizeMethod === 'contain') {
              // Method 'contain'
              if (srcRatio > trgRatio) {
                height = width / srcRatio;
              } else {
                width = height * srcRatio;
              }
            } else {
              throw new Error("Unknown resizeMethod '" + resizeMethod + "'");
            }
          }

          info.srcX = (file.width - info.srcWidth) / 2;
          info.srcY = (file.height - info.srcHeight) / 2;

          info.trgWidth = width;
          info.trgHeight = height;

          return info;
        },


        /**
         * Can be used to transform the file (for example, resize an image if necessary).
         *
         * The default implementation uses `resizeWidth` and `resizeHeight` (if provided) and resizes
         * images according to those dimensions.
         *
         * Gets the `file` as the first parameter, and a `done()` function as the second, that needs
         * to be invoked with the file when the transformation is done.
         */
        transformFile: function transformFile(file, done) {
          if ((this.options.resizeWidth || this.options.resizeHeight) && file.type.match(/image.*/)) {
            return this.resizeImage(file, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, done);
          } else {
            return done(file);
          }
        },


        /**
         * A string that contains the template used for each dropped
         * file. Change it to fulfill your needs but make sure to properly
         * provide all elements.
         *
         * If you want to use an actual HTML element instead of providing a String
         * as a config option, you could create a div with the id `tpl`,
         * put the template inside it and provide the element like this:
         *
         *     document
         *       .querySelector('#tpl')
         *       .innerHTML
         *
         */
        previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>",

        // END OPTIONS
        // (Required by the dropzone documentation parser)


        /*
         Those functions register themselves to the events on init and handle all
         the user interface specific stuff. Overwriting them won't break the upload
         but can break the way it's displayed.
         You can overwrite them if you don't like the default behavior. If you just
         want to add an additional event handler, register it on the dropzone object
         and don't overwrite those options.
         */

        // Those are self explanatory and simply concern the DragnDrop.
        drop: function drop(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        dragstart: function dragstart(e) {},
        dragend: function dragend(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        dragenter: function dragenter(e) {
          return this.element.classList.add("dz-drag-hover");
        },
        dragover: function dragover(e) {
          return this.element.classList.add("dz-drag-hover");
        },
        dragleave: function dragleave(e) {
          return this.element.classList.remove("dz-drag-hover");
        },
        paste: function paste(e) {},


        // Called whenever there are no files left in the dropzone anymore, and the
        // dropzone should be displayed as if in the initial state.
        reset: function reset() {
          return this.element.classList.remove("dz-started");
        },


        // Called when a file is added to the queue
        // Receives `file`
        addedfile: function addedfile(file) {
          var _this2 = this;

          if (this.element === this.previewsContainer) {
            this.element.classList.add("dz-started");
          }

          if (this.previewsContainer) {
            file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
            file.previewTemplate = file.previewElement; // Backwards compatibility

            this.previewsContainer.appendChild(file.previewElement);
            for (var _iterator3 = file.previewElement.querySelectorAll("[data-dz-name]"), _isArray3 = true, _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
              var _ref3;

              if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
              } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref3 = _i3.value;
              }

              var node = _ref3;

              node.textContent = file.name;
            }
            for (var _iterator4 = file.previewElement.querySelectorAll("[data-dz-size]"), _isArray4 = true, _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
              if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                node = _iterator4[_i4++];
              } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                node = _i4.value;
              }

              node.innerHTML = this.filesize(file.size);
            }

            if (this.options.addRemoveLinks) {
              file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
              file.previewElement.appendChild(file._removeLink);
            }

            var removeFileEvent = function removeFileEvent(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this2.options.dictCancelUploadConfirmation, function () {
                  return _this2.removeFile(file);
                });
              } else {
                if (_this2.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this2.options.dictRemoveFileConfirmation, function () {
                    return _this2.removeFile(file);
                  });
                } else {
                  return _this2.removeFile(file);
                }
              }
            };

            for (var _iterator5 = file.previewElement.querySelectorAll("[data-dz-remove]"), _isArray5 = true, _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
              var _ref4;

              if (_isArray5) {
                if (_i5 >= _iterator5.length) break;
                _ref4 = _iterator5[_i5++];
              } else {
                _i5 = _iterator5.next();
                if (_i5.done) break;
                _ref4 = _i5.value;
              }

              var removeLink = _ref4;

              removeLink.addEventListener("click", removeFileEvent);
            }
          }
        },


        // Called whenever a file is removed.
        removedfile: function removedfile(file) {
          if (file.previewElement != null && file.previewElement.parentNode != null) {
            file.previewElement.parentNode.removeChild(file.previewElement);
          }
          return this._updateMaxFilesReachedClass();
        },


        // Called when a thumbnail has been generated
        // Receives `file` and `dataUrl`
        thumbnail: function thumbnail(file, dataUrl) {
          if (file.previewElement) {
            file.previewElement.classList.remove("dz-file-preview");
            for (var _iterator6 = file.previewElement.querySelectorAll("[data-dz-thumbnail]"), _isArray6 = true, _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
              var _ref5;

              if (_isArray6) {
                if (_i6 >= _iterator6.length) break;
                _ref5 = _iterator6[_i6++];
              } else {
                _i6 = _iterator6.next();
                if (_i6.done) break;
                _ref5 = _i6.value;
              }

              var thumbnailElement = _ref5;

              thumbnailElement.alt = file.name;
              thumbnailElement.src = dataUrl;
            }

            return setTimeout(function () {
              return file.previewElement.classList.add("dz-image-preview");
            }, 1);
          }
        },


        // Called whenever an error occurs
        // Receives `file` and `message`
        error: function error(file, message) {
          if (file.previewElement) {
            file.previewElement.classList.add("dz-error");
            if (typeof message !== "String" && message.error) {
              message = message.error;
            }
            for (var _iterator7 = file.previewElement.querySelectorAll("[data-dz-errormessage]"), _isArray7 = true, _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
              var _ref6;

              if (_isArray7) {
                if (_i7 >= _iterator7.length) break;
                _ref6 = _iterator7[_i7++];
              } else {
                _i7 = _iterator7.next();
                if (_i7.done) break;
                _ref6 = _i7.value;
              }

              var node = _ref6;

              node.textContent = message;
            }
          }
        },
        errormultiple: function errormultiple() {},


        // Called when a file gets processed. Since there is a cue, not all added
        // files are processed immediately.
        // Receives `file`
        processing: function processing(file) {
          if (file.previewElement) {
            file.previewElement.classList.add("dz-processing");
            if (file._removeLink) {
              return file._removeLink.innerHTML = this.options.dictCancelUpload;
            }
          }
        },
        processingmultiple: function processingmultiple() {},


        // Called whenever the upload progress gets updated.
        // Receives `file`, `progress` (percentage 0-100) and `bytesSent`.
        // To get the total number of bytes of the file, use `file.size`
        uploadprogress: function uploadprogress(file, progress, bytesSent) {
          if (file.previewElement) {
            for (var _iterator8 = file.previewElement.querySelectorAll("[data-dz-uploadprogress]"), _isArray8 = true, _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
              var _ref7;

              if (_isArray8) {
                if (_i8 >= _iterator8.length) break;
                _ref7 = _iterator8[_i8++];
              } else {
                _i8 = _iterator8.next();
                if (_i8.done) break;
                _ref7 = _i8.value;
              }

              var node = _ref7;

              node.nodeName === 'PROGRESS' ? node.value = progress : node.style.width = progress + "%";
            }
          }
        },


        // Called whenever the total upload progress gets updated.
        // Called with totalUploadProgress (0-100), totalBytes and totalBytesSent
        totaluploadprogress: function totaluploadprogress() {},


        // Called just before the file is sent. Gets the `xhr` object as second
        // parameter, so you can modify it (for example to add a CSRF token) and a
        // `formData` object to add additional information.
        sending: function sending() {},
        sendingmultiple: function sendingmultiple() {},


        // When the complete upload is finished and successful
        // Receives `file`
        success: function success(file) {
          if (file.previewElement) {
            return file.previewElement.classList.add("dz-success");
          }
        },
        successmultiple: function successmultiple() {},


        // When the upload is canceled.
        canceled: function canceled(file) {
          return this.emit("error", file, this.options.dictUploadCanceled);
        },
        canceledmultiple: function canceledmultiple() {},


        // When the upload is finished, either with success or an error.
        // Receives `file`
        complete: function complete(file) {
          if (file._removeLink) {
            file._removeLink.innerHTML = this.options.dictRemoveFile;
          }
          if (file.previewElement) {
            return file.previewElement.classList.add("dz-complete");
          }
        },
        completemultiple: function completemultiple() {},
        maxfilesexceeded: function maxfilesexceeded() {},
        maxfilesreached: function maxfilesreached() {},
        queuecomplete: function queuecomplete() {},
        addedfiles: function addedfiles() {}
      };

      this.prototype._thumbnailQueue = [];
      this.prototype._processingThumbnail = false;
    }

    // global utility

  }, {
    key: "extend",
    value: function extend(target) {
      for (var _len2 = arguments.length, objects = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        objects[_key2 - 1] = arguments[_key2];
      }

      for (var _iterator9 = objects, _isArray9 = true, _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
        var _ref8;

        if (_isArray9) {
          if (_i9 >= _iterator9.length) break;
          _ref8 = _iterator9[_i9++];
        } else {
          _i9 = _iterator9.next();
          if (_i9.done) break;
          _ref8 = _i9.value;
        }

        var object = _ref8;

        for (var key in object) {
          var val = object[key];
          target[key] = val;
        }
      }
      return target;
    }
  }]);

  function Dropzone(el, options) {
    _classCallCheck(this, Dropzone);

    var _this = _possibleConstructorReturn(this, (Dropzone.__proto__ || Object.getPrototypeOf(Dropzone)).call(this));

    var fallback = void 0,
        left = void 0;
    _this.element = el;
    // For backwards compatibility since the version was in the prototype previously
    _this.version = Dropzone.version;

    _this.defaultOptions.previewTemplate = _this.defaultOptions.previewTemplate.replace(/\n*/g, "");

    _this.clickableElements = [];
    _this.listeners = [];
    _this.files = []; // All files

    if (typeof _this.element === "string") {
      _this.element = document.querySelector(_this.element);
    }

    // Not checking if instance of HTMLElement or Element since IE9 is extremely weird.
    if (!_this.element || _this.element.nodeType == null) {
      throw new Error("Invalid dropzone element.");
    }

    if (_this.element.dropzone) {
      throw new Error("Dropzone already attached.");
    }

    // Now add this dropzone to the instances.
    Dropzone.instances.push(_this);

    // Put the dropzone inside the element itself.
    _this.element.dropzone = _this;

    var elementOptions = (left = Dropzone.optionsForElement(_this.element)) != null ? left : {};

    _this.options = Dropzone.extend({}, _this.defaultOptions, elementOptions, options != null ? options : {});

    // If the browser failed, just call the fallback and leave
    if (_this.options.forceFallback || !Dropzone.isBrowserSupported()) {
      var _ret;

      return _ret = _this.options.fallback.call(_this), _possibleConstructorReturn(_this, _ret);
    }

    // @options.url = @element.getAttribute "action" unless @options.url?
    if (_this.options.url == null) {
      _this.options.url = _this.element.getAttribute("action");
    }

    if (!_this.options.url) {
      throw new Error("No URL provided.");
    }

    if (_this.options.acceptedFiles && _this.options.acceptedMimeTypes) {
      throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
    }

    if (_this.options.uploadMultiple && _this.options.chunking) {
      throw new Error('You cannot set both: uploadMultiple and chunking.');
    }

    // Backwards compatibility
    if (_this.options.acceptedMimeTypes) {
      _this.options.acceptedFiles = _this.options.acceptedMimeTypes;
      delete _this.options.acceptedMimeTypes;
    }

    // Backwards compatibility
    if (_this.options.renameFilename != null) {
      _this.options.renameFile = function (file) {
        return _this.options.renameFilename.call(_this, file.name, file);
      };
    }

    _this.options.method = _this.options.method.toUpperCase();

    if ((fallback = _this.getExistingFallback()) && fallback.parentNode) {
      // Remove the fallback
      fallback.parentNode.removeChild(fallback);
    }

    // Display previews in the previewsContainer element or the Dropzone element unless explicitly set to false
    if (_this.options.previewsContainer !== false) {
      if (_this.options.previewsContainer) {
        _this.previewsContainer = Dropzone.getElement(_this.options.previewsContainer, "previewsContainer");
      } else {
        _this.previewsContainer = _this.element;
      }
    }

    if (_this.options.clickable) {
      if (_this.options.clickable === true) {
        _this.clickableElements = [_this.element];
      } else {
        _this.clickableElements = Dropzone.getElements(_this.options.clickable, "clickable");
      }
    }

    _this.init();
    return _this;
  }

  // Returns all files that have been accepted


  _createClass(Dropzone, [{
    key: "getAcceptedFiles",
    value: function getAcceptedFiles() {
      return this.files.filter(function (file) {
        return file.accepted;
      }).map(function (file) {
        return file;
      });
    }

    // Returns all files that have been rejected
    // Not sure when that's going to be useful, but added for completeness.

  }, {
    key: "getRejectedFiles",
    value: function getRejectedFiles() {
      return this.files.filter(function (file) {
        return !file.accepted;
      }).map(function (file) {
        return file;
      });
    }
  }, {
    key: "getFilesWithStatus",
    value: function getFilesWithStatus(status) {
      return this.files.filter(function (file) {
        return file.status === status;
      }).map(function (file) {
        return file;
      });
    }

    // Returns all files that are in the queue

  }, {
    key: "getQueuedFiles",
    value: function getQueuedFiles() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    }
  }, {
    key: "getUploadingFiles",
    value: function getUploadingFiles() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    }
  }, {
    key: "getAddedFiles",
    value: function getAddedFiles() {
      return this.getFilesWithStatus(Dropzone.ADDED);
    }

    // Files that are either queued or uploading

  }, {
    key: "getActiveFiles",
    value: function getActiveFiles() {
      return this.files.filter(function (file) {
        return file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED;
      }).map(function (file) {
        return file;
      });
    }

    // The function that gets called when Dropzone is initialized. You
    // can (and should) setup event listeners inside this function.

  }, {
    key: "init",
    value: function init() {
      var _this3 = this;

      // In case it isn't set already
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }

      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }

      if (this.clickableElements.length) {
        var setupHiddenFileInput = function setupHiddenFileInput() {
          if (_this3.hiddenFileInput) {
            _this3.hiddenFileInput.parentNode.removeChild(_this3.hiddenFileInput);
          }
          _this3.hiddenFileInput = document.createElement("input");
          _this3.hiddenFileInput.setAttribute("type", "file");
          if (_this3.options.maxFiles === null || _this3.options.maxFiles > 1) {
            _this3.hiddenFileInput.setAttribute("multiple", "multiple");
          }
          _this3.hiddenFileInput.className = "dz-hidden-input";

          if (_this3.options.acceptedFiles !== null) {
            _this3.hiddenFileInput.setAttribute("accept", _this3.options.acceptedFiles);
          }
          if (_this3.options.capture !== null) {
            _this3.hiddenFileInput.setAttribute("capture", _this3.options.capture);
          }

          // Not setting `display="none"` because some browsers don't accept clicks
          // on elements that aren't displayed.
          _this3.hiddenFileInput.style.visibility = "hidden";
          _this3.hiddenFileInput.style.position = "absolute";
          _this3.hiddenFileInput.style.top = "0";
          _this3.hiddenFileInput.style.left = "0";
          _this3.hiddenFileInput.style.height = "0";
          _this3.hiddenFileInput.style.width = "0";
          Dropzone.getElement(_this3.options.hiddenInputContainer, 'hiddenInputContainer').appendChild(_this3.hiddenFileInput);
          return _this3.hiddenFileInput.addEventListener("change", function () {
            var files = _this3.hiddenFileInput.files;

            if (files.length) {
              for (var _iterator10 = files, _isArray10 = true, _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
                var _ref9;

                if (_isArray10) {
                  if (_i10 >= _iterator10.length) break;
                  _ref9 = _iterator10[_i10++];
                } else {
                  _i10 = _iterator10.next();
                  if (_i10.done) break;
                  _ref9 = _i10.value;
                }

                var file = _ref9;

                _this3.addFile(file);
              }
            }
            _this3.emit("addedfiles", files);
            return setupHiddenFileInput();
          });
        };
        setupHiddenFileInput();
      }

      this.URL = window.URL !== null ? window.URL : window.webkitURL;

      // Setup all event listeners on the Dropzone object itself.
      // They're not in @setupEventListeners() because they shouldn't be removed
      // again when the dropzone gets disabled.
      for (var _iterator11 = this.events, _isArray11 = true, _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
        var _ref10;

        if (_isArray11) {
          if (_i11 >= _iterator11.length) break;
          _ref10 = _iterator11[_i11++];
        } else {
          _i11 = _iterator11.next();
          if (_i11.done) break;
          _ref10 = _i11.value;
        }

        var eventName = _ref10;

        this.on(eventName, this.options[eventName]);
      }

      this.on("uploadprogress", function () {
        return _this3.updateTotalUploadProgress();
      });

      this.on("removedfile", function () {
        return _this3.updateTotalUploadProgress();
      });

      this.on("canceled", function (file) {
        return _this3.emit("complete", file);
      });

      // Emit a `queuecomplete` event if all files finished uploading.
      this.on("complete", function (file) {
        if (_this3.getAddedFiles().length === 0 && _this3.getUploadingFiles().length === 0 && _this3.getQueuedFiles().length === 0) {
          // This needs to be deferred so that `queuecomplete` really triggers after `complete`
          return setTimeout(function () {
            return _this3.emit("queuecomplete");
          }, 0);
        }
      });

      var noPropagation = function noPropagation(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };

      // Create the listeners
      this.listeners = [{
        element: this.element,
        events: {
          "dragstart": function dragstart(e) {
            return _this3.emit("dragstart", e);
          },
          "dragenter": function dragenter(e) {
            noPropagation(e);
            return _this3.emit("dragenter", e);
          },
          "dragover": function dragover(e) {
            // Makes it possible to drag files from chrome's download bar
            // http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
            // Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
            var efct = void 0;
            try {
              efct = e.dataTransfer.effectAllowed;
            } catch (error) {}
            e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';

            noPropagation(e);
            return _this3.emit("dragover", e);
          },
          "dragleave": function dragleave(e) {
            return _this3.emit("dragleave", e);
          },
          "drop": function drop(e) {
            noPropagation(e);
            return _this3.drop(e);
          },
          "dragend": function dragend(e) {
            return _this3.emit("dragend", e);
          }

          // This is disabled right now, because the browsers don't implement it properly.
          // "paste": (e) =>
          //   noPropagation e
          //   @paste e
        } }];

      this.clickableElements.forEach(function (clickableElement) {
        return _this3.listeners.push({
          element: clickableElement,
          events: {
            "click": function click(evt) {
              // Only the actual dropzone or the message element should trigger file selection
              if (clickableElement !== _this3.element || evt.target === _this3.element || Dropzone.elementInside(evt.target, _this3.element.querySelector(".dz-message"))) {
                _this3.hiddenFileInput.click(); // Forward the click
              }
              return true;
            }
          }
        });
      });

      this.enable();

      return this.options.init.call(this);
    }

    // Not fully tested yet

  }, {
    key: "destroy",
    value: function destroy() {
      this.disable();
      this.removeAllFiles(true);
      if (this.hiddenFileInput != null ? this.hiddenFileInput.parentNode : undefined) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    }
  }, {
    key: "updateTotalUploadProgress",
    value: function updateTotalUploadProgress() {
      var totalUploadProgress = void 0;
      var totalBytesSent = 0;
      var totalBytes = 0;

      var activeFiles = this.getActiveFiles();

      if (activeFiles.length) {
        for (var _iterator12 = this.getActiveFiles(), _isArray12 = true, _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
          var _ref11;

          if (_isArray12) {
            if (_i12 >= _iterator12.length) break;
            _ref11 = _iterator12[_i12++];
          } else {
            _i12 = _iterator12.next();
            if (_i12.done) break;
            _ref11 = _i12.value;
          }

          var file = _ref11;

          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }

      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    }

    // @options.paramName can be a function taking one parameter rather than a string.
    // A parameter name for a file is obtained simply by calling this with an index number.

  }, {
    key: "_getParamName",
    value: function _getParamName(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    }

    // If @options.renameFile is a function,
    // the function will be used to rename the file.name before appending it to the formData

  }, {
    key: "_renameFile",
    value: function _renameFile(file) {
      if (typeof this.options.renameFile !== "function") {
        return file.name;
      }
      return this.options.renameFile(file);
    }

    // Returns a form that can be used as fallback if the browser does not support DragnDrop
    //
    // If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.
    // This code has to pass in IE7 :(

  }, {
    key: "getFallbackForm",
    value: function getFallbackForm() {
      var existingFallback = void 0,
          form = void 0;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }

      var fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + this._getParamName(0) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : undefined) + " /><input type=\"submit\" value=\"Upload!\"></div>";

      var fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        // Make sure that the enctype and method attributes are set properly
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    }

    // Returns the fallback elements if they exist already
    //
    // This code has to pass in IE7 :(

  }, {
    key: "getExistingFallback",
    value: function getExistingFallback() {
      var getFallback = function getFallback(elements) {
        for (var _iterator13 = elements, _isArray13 = true, _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
          var _ref12;

          if (_isArray13) {
            if (_i13 >= _iterator13.length) break;
            _ref12 = _iterator13[_i13++];
          } else {
            _i13 = _iterator13.next();
            if (_i13.done) break;
            _ref12 = _i13.value;
          }

          var el = _ref12;

          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };

      var _arr = ["div", "form"];
      for (var _i14 = 0; _i14 < _arr.length; _i14++) {
        var tagName = _arr[_i14];
        var fallback;
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    }

    // Activates all listeners stored in @listeners

  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];
          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return result;
        }();
      });
    }

    // Deactivates all listeners stored in @listeners

  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      return this.listeners.map(function (elementListeners) {
        return function () {
          var result = [];
          for (var event in elementListeners.events) {
            var listener = elementListeners.events[event];
            result.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return result;
        }();
      });
    }

    // Removes all event listeners and cancels all files in the queue or being processed.

  }, {
    key: "disable",
    value: function disable() {
      var _this4 = this;

      this.clickableElements.forEach(function (element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      this.disabled = true;

      return this.files.map(function (file) {
        return _this4.cancelUpload(file);
      });
    }
  }, {
    key: "enable",
    value: function enable() {
      delete this.disabled;
      this.clickableElements.forEach(function (element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    }

    // Returns a nicely formatted filesize

  }, {
    key: "filesize",
    value: function filesize(size) {
      var selectedSize = 0;
      var selectedUnit = "b";

      if (size > 0) {
        var units = ['tb', 'gb', 'mb', 'kb', 'b'];

        for (var i = 0; i < units.length; i++) {
          var unit = units[i];
          var cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;

          if (size >= cutoff) {
            selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
            selectedUnit = unit;
            break;
          }
        }

        selectedSize = Math.round(10 * selectedSize) / 10; // Cutting of digits
      }

      return "<strong>" + selectedSize + "</strong> " + this.options.dictFileSizeUnits[selectedUnit];
    }

    // Adds or removes the `dz-max-files-reached` class from the form.

  }, {
    key: "_updateMaxFilesReachedClass",
    value: function _updateMaxFilesReachedClass() {
      if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    }
  }, {
    key: "drop",
    value: function drop(e) {
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);

      // Convert the FileList to an Array
      // This is necessary for IE11
      var files = [];
      for (var i = 0; i < e.dataTransfer.files.length; i++) {
        files[i] = e.dataTransfer.files[i];
      }

      this.emit("addedfiles", files);

      // Even if it's a folder, files.length will contain the folders.
      if (files.length) {
        var items = e.dataTransfer.items;

        if (items && items.length && items[0].webkitGetAsEntry != null) {
          // The browser supports dropping of folders, so handle items instead of files
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    }
  }, {
    key: "paste",
    value: function paste(e) {
      if (__guard__(e != null ? e.clipboardData : undefined, function (x) {
        return x.items;
      }) == null) {
        return;
      }

      this.emit("paste", e);
      var items = e.clipboardData.items;


      if (items.length) {
        return this._addFilesFromItems(items);
      }
    }
  }, {
    key: "handleFiles",
    value: function handleFiles(files) {
      for (var _iterator14 = files, _isArray14 = true, _i15 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
        var _ref13;

        if (_isArray14) {
          if (_i15 >= _iterator14.length) break;
          _ref13 = _iterator14[_i15++];
        } else {
          _i15 = _iterator14.next();
          if (_i15.done) break;
          _ref13 = _i15.value;
        }

        var file = _ref13;

        this.addFile(file);
      }
    }

    // When a folder is dropped (or files are pasted), items must be handled
    // instead of files.

  }, {
    key: "_addFilesFromItems",
    value: function _addFilesFromItems(items) {
      var _this5 = this;

      return function () {
        var result = [];
        for (var _iterator15 = items, _isArray15 = true, _i16 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
          var _ref14;

          if (_isArray15) {
            if (_i16 >= _iterator15.length) break;
            _ref14 = _iterator15[_i16++];
          } else {
            _i16 = _iterator15.next();
            if (_i16.done) break;
            _ref14 = _i16.value;
          }

          var item = _ref14;

          var entry;
          if (item.webkitGetAsEntry != null && (entry = item.webkitGetAsEntry())) {
            if (entry.isFile) {
              result.push(_this5.addFile(item.getAsFile()));
            } else if (entry.isDirectory) {
              // Append all files from that directory to files
              result.push(_this5._addFilesFromDirectory(entry, entry.name));
            } else {
              result.push(undefined);
            }
          } else if (item.getAsFile != null) {
            if (item.kind == null || item.kind === "file") {
              result.push(_this5.addFile(item.getAsFile()));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      }();
    }

    // Goes through the directory, and adds each file it finds recursively

  }, {
    key: "_addFilesFromDirectory",
    value: function _addFilesFromDirectory(directory, path) {
      var _this6 = this;

      var dirReader = directory.createReader();

      var errorHandler = function errorHandler(error) {
        return __guardMethod__(console, 'log', function (o) {
          return o.log(error);
        });
      };

      var readEntries = function readEntries() {
        return dirReader.readEntries(function (entries) {
          if (entries.length > 0) {
            for (var _iterator16 = entries, _isArray16 = true, _i17 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
              var _ref15;

              if (_isArray16) {
                if (_i17 >= _iterator16.length) break;
                _ref15 = _iterator16[_i17++];
              } else {
                _i17 = _iterator16.next();
                if (_i17.done) break;
                _ref15 = _i17.value;
              }

              var entry = _ref15;

              if (entry.isFile) {
                entry.file(function (file) {
                  if (_this6.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                    return;
                  }
                  file.fullPath = path + "/" + file.name;
                  return _this6.addFile(file);
                });
              } else if (entry.isDirectory) {
                _this6._addFilesFromDirectory(entry, path + "/" + entry.name);
              }
            }

            // Recursively call readEntries() again, since browser only handle
            // the first 100 entries.
            // See: https://developer.mozilla.org/en-US/docs/Web/API/DirectoryReader#readEntries
            readEntries();
          }
          return null;
        }, errorHandler);
      };

      return readEntries();
    }

    // If `done()` is called without argument the file is accepted
    // If you call it with an error message, the file is rejected
    // (This allows for asynchronous validation)
    //
    // This function checks the filesize, and if the file.type passes the
    // `acceptedFiles` check.

  }, {
    key: "accept",
    value: function accept(file, done) {
      if (this.options.maxFilesize && file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if (this.options.maxFiles != null && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    }
  }, {
    key: "addFile",
    value: function addFile(file) {
      var _this7 = this;

      file.upload = {
        uuid: Dropzone.uuidv4(),
        progress: 0,
        // Setting the total upload size to file.size for the beginning
        // It's actual different than the size to be transmitted.
        total: file.size,
        bytesSent: 0,
        filename: this._renameFile(file),
        chunked: this.options.chunking && (this.options.forceChunking || file.size > this.options.chunkSize),
        totalChunkCount: Math.ceil(file.size / this.options.chunkSize)
      };
      this.files.push(file);

      file.status = Dropzone.ADDED;

      this.emit("addedfile", file);

      this._enqueueThumbnail(file);

      return this.accept(file, function (error) {
        if (error) {
          file.accepted = false;
          _this7._errorProcessing([file], error); // Will set the file.status
        } else {
          file.accepted = true;
          if (_this7.options.autoQueue) {
            _this7.enqueueFile(file);
          } // Will set .accepted = true
        }
        return _this7._updateMaxFilesReachedClass();
      });
    }

    // Wrapper for enqueueFile

  }, {
    key: "enqueueFiles",
    value: function enqueueFiles(files) {
      for (var _iterator17 = files, _isArray17 = true, _i18 = 0, _iterator17 = _isArray17 ? _iterator17 : _iterator17[Symbol.iterator]();;) {
        var _ref16;

        if (_isArray17) {
          if (_i18 >= _iterator17.length) break;
          _ref16 = _iterator17[_i18++];
        } else {
          _i18 = _iterator17.next();
          if (_i18.done) break;
          _ref16 = _i18.value;
        }

        var file = _ref16;

        this.enqueueFile(file);
      }
      return null;
    }
  }, {
    key: "enqueueFile",
    value: function enqueueFile(file) {
      var _this8 = this;

      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(function () {
            return _this8.processQueue();
          }, 0); // Deferring the call
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    }
  }, {
    key: "_enqueueThumbnail",
    value: function _enqueueThumbnail(file) {
      var _this9 = this;

      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(function () {
          return _this9._processThumbnailQueue();
        }, 0); // Deferring the call
      }
    }
  }, {
    key: "_processThumbnailQueue",
    value: function _processThumbnailQueue() {
      var _this10 = this;

      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }

      this._processingThumbnail = true;
      var file = this._thumbnailQueue.shift();
      return this.createThumbnail(file, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, true, function (dataUrl) {
        _this10.emit("thumbnail", file, dataUrl);
        _this10._processingThumbnail = false;
        return _this10._processThumbnailQueue();
      });
    }

    // Can be called by the user to remove a file

  }, {
    key: "removeFile",
    value: function removeFile(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);

      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    }

    // Removes all files that aren't currently processed from the list

  }, {
    key: "removeAllFiles",
    value: function removeAllFiles(cancelIfNecessary) {
      // Create a copy of files since removeFile() changes the @files array.
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      for (var _iterator18 = this.files.slice(), _isArray18 = true, _i19 = 0, _iterator18 = _isArray18 ? _iterator18 : _iterator18[Symbol.iterator]();;) {
        var _ref17;

        if (_isArray18) {
          if (_i19 >= _iterator18.length) break;
          _ref17 = _iterator18[_i19++];
        } else {
          _i19 = _iterator18.next();
          if (_i19.done) break;
          _ref17 = _i19.value;
        }

        var file = _ref17;

        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    }

    // Resizes an image before it gets sent to the server. This function is the default behavior of
    // `options.transformFile` if `resizeWidth` or `resizeHeight` are set. The callback is invoked with
    // the resized blob.

  }, {
    key: "resizeImage",
    value: function resizeImage(file, width, height, resizeMethod, callback) {
      var _this11 = this;

      return this.createThumbnail(file, width, height, resizeMethod, true, function (dataUrl, canvas) {
        if (canvas == null) {
          // The image has not been resized
          return callback(file);
        } else {
          var resizeMimeType = _this11.options.resizeMimeType;

          if (resizeMimeType == null) {
            resizeMimeType = file.type;
          }
          var resizedDataURL = canvas.toDataURL(resizeMimeType, _this11.options.resizeQuality);
          if (resizeMimeType === 'image/jpeg' || resizeMimeType === 'image/jpg') {
            // Now add the original EXIF information
            resizedDataURL = ExifRestore.restore(file.dataURL, resizedDataURL);
          }
          return callback(Dropzone.dataURItoBlob(resizedDataURL));
        }
      });
    }
  }, {
    key: "createThumbnail",
    value: function createThumbnail(file, width, height, resizeMethod, fixOrientation, callback) {
      var _this12 = this;

      var fileReader = new FileReader();

      fileReader.onload = function () {

        file.dataURL = fileReader.result;

        // Don't bother creating a thumbnail for SVG images since they're vector
        if (file.type === "image/svg+xml") {
          if (callback != null) {
            callback(fileReader.result);
          }
          return;
        }

        return _this12.createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback);
      };

      return fileReader.readAsDataURL(file);
    }
  }, {
    key: "createThumbnailFromUrl",
    value: function createThumbnailFromUrl(file, width, height, resizeMethod, fixOrientation, callback, crossOrigin) {
      var _this13 = this;

      // Not using `new Image` here because of a bug in latest Chrome versions.
      // See https://github.com/enyo/dropzone/pull/226
      var img = document.createElement("img");

      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }

      img.onload = function () {
        var loadExif = function loadExif(callback) {
          return callback(1);
        };
        if (typeof EXIF !== 'undefined' && EXIF !== null && fixOrientation) {
          loadExif = function loadExif(callback) {
            return EXIF.getData(img, function () {
              return callback(EXIF.getTag(this, 'Orientation'));
            });
          };
        }

        return loadExif(function (orientation) {
          file.width = img.width;
          file.height = img.height;

          var resizeInfo = _this13.options.resize.call(_this13, file, width, height, resizeMethod);

          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");

          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;

          if (orientation > 4) {
            canvas.width = resizeInfo.trgHeight;
            canvas.height = resizeInfo.trgWidth;
          }

          switch (orientation) {
            case 2:
              // horizontal flip
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              break;
            case 3:
              // 180° rotate left
              ctx.translate(canvas.width, canvas.height);
              ctx.rotate(Math.PI);
              break;
            case 4:
              // vertical flip
              ctx.translate(0, canvas.height);
              ctx.scale(1, -1);
              break;
            case 5:
              // vertical flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.scale(1, -1);
              break;
            case 6:
              // 90° rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(0, -canvas.width);
              break;
            case 7:
              // horizontal flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(canvas.height, -canvas.width);
              ctx.scale(-1, 1);
              break;
            case 8:
              // 90° rotate left
              ctx.rotate(-0.5 * Math.PI);
              ctx.translate(-canvas.height, 0);
              break;
          }

          // This is a bugfix for iOS' scaling bug.
          drawImageIOSFix(ctx, img, resizeInfo.srcX != null ? resizeInfo.srcX : 0, resizeInfo.srcY != null ? resizeInfo.srcY : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX != null ? resizeInfo.trgX : 0, resizeInfo.trgY != null ? resizeInfo.trgY : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);

          var thumbnail = canvas.toDataURL("image/png");

          if (callback != null) {
            return callback(thumbnail, canvas);
          }
        });
      };

      if (callback != null) {
        img.onerror = callback;
      }

      return img.src = file.dataURL;
    }

    // Goes through the queue and processes files if there aren't too many already.

  }, {
    key: "processQueue",
    value: function processQueue() {
      var parallelUploads = this.options.parallelUploads;

      var processingLength = this.getUploadingFiles().length;
      var i = processingLength;

      // There are already at least as many files uploading than should be
      if (processingLength >= parallelUploads) {
        return;
      }

      var queuedFiles = this.getQueuedFiles();

      if (!(queuedFiles.length > 0)) {
        return;
      }

      if (this.options.uploadMultiple) {
        // The files should be uploaded in one request
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          } // Nothing left to process
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    }

    // Wrapper for `processFiles`

  }, {
    key: "processFile",
    value: function processFile(file) {
      return this.processFiles([file]);
    }

    // Loads the file, then calls finishedLoading()

  }, {
    key: "processFiles",
    value: function processFiles(files) {
      for (var _iterator19 = files, _isArray19 = true, _i20 = 0, _iterator19 = _isArray19 ? _iterator19 : _iterator19[Symbol.iterator]();;) {
        var _ref18;

        if (_isArray19) {
          if (_i20 >= _iterator19.length) break;
          _ref18 = _iterator19[_i20++];
        } else {
          _i20 = _iterator19.next();
          if (_i20.done) break;
          _ref18 = _i20.value;
        }

        var file = _ref18;

        file.processing = true; // Backwards compatibility
        file.status = Dropzone.UPLOADING;

        this.emit("processing", file);
      }

      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }

      return this.uploadFiles(files);
    }
  }, {
    key: "_getFilesWithXhr",
    value: function _getFilesWithXhr(xhr) {
      var files = void 0;
      return files = this.files.filter(function (file) {
        return file.xhr === xhr;
      }).map(function (file) {
        return file;
      });
    }

    // Cancels the file upload and sets the status to CANCELED
    // **if** the file is actually being uploaded.
    // If it's still in the queue, the file is being removed from it and the status
    // set to CANCELED.

  }, {
    key: "cancelUpload",
    value: function cancelUpload(file) {
      if (file.status === Dropzone.UPLOADING) {
        var groupedFiles = this._getFilesWithXhr(file.xhr);
        for (var _iterator20 = groupedFiles, _isArray20 = true, _i21 = 0, _iterator20 = _isArray20 ? _iterator20 : _iterator20[Symbol.iterator]();;) {
          var _ref19;

          if (_isArray20) {
            if (_i21 >= _iterator20.length) break;
            _ref19 = _iterator20[_i21++];
          } else {
            _i21 = _iterator20.next();
            if (_i21.done) break;
            _ref19 = _i21.value;
          }

          var groupedFile = _ref19;

          groupedFile.status = Dropzone.CANCELED;
        }
        if (typeof file.xhr !== 'undefined') {
          file.xhr.abort();
        }
        for (var _iterator21 = groupedFiles, _isArray21 = true, _i22 = 0, _iterator21 = _isArray21 ? _iterator21 : _iterator21[Symbol.iterator]();;) {
          var _ref20;

          if (_isArray21) {
            if (_i22 >= _iterator21.length) break;
            _ref20 = _iterator21[_i22++];
          } else {
            _i22 = _iterator21.next();
            if (_i22.done) break;
            _ref20 = _i22.value;
          }

          var _groupedFile = _ref20;

          this.emit("canceled", _groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }, {
    key: "resolveOption",
    value: function resolveOption(option) {
      if (typeof option === 'function') {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        return option.apply(this, args);
      }
      return option;
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(file) {
      return this.uploadFiles([file]);
    }
  }, {
    key: "uploadFiles",
    value: function uploadFiles(files) {
      var _this14 = this;

      this._transformFiles(files, function (transformedFiles) {
        if (files[0].upload.chunked) {
          // This file should be sent in chunks!

          // If the chunking option is set, we **know** that there can only be **one** file, since
          // uploadMultiple is not allowed with this option.
          var file = files[0];
          var transformedFile = transformedFiles[0];
          var startedChunkCount = 0;

          file.upload.chunks = [];

          var handleNextChunk = function handleNextChunk() {
            var chunkIndex = 0;

            // Find the next item in file.upload.chunks that is not defined yet.
            while (file.upload.chunks[chunkIndex] !== undefined) {
              chunkIndex++;
            }

            // This means, that all chunks have already been started.
            if (chunkIndex >= file.upload.totalChunkCount) return;

            startedChunkCount++;

            var start = chunkIndex * _this14.options.chunkSize;
            var end = Math.min(start + _this14.options.chunkSize, file.size);

            var dataBlock = {
              name: _this14._getParamName(0),
              data: transformedFile.webkitSlice ? transformedFile.webkitSlice(start, end) : transformedFile.slice(start, end),
              filename: file.upload.filename,
              chunkIndex: chunkIndex
            };

            file.upload.chunks[chunkIndex] = {
              file: file,
              index: chunkIndex,
              dataBlock: dataBlock, // In case we want to retry.
              status: Dropzone.UPLOADING,
              progress: 0,
              retries: 0 // The number of times this block has been retried.
            };

            _this14._uploadData(files, [dataBlock]);
          };

          file.upload.finishedChunkUpload = function (chunk) {
            var allFinished = true;
            chunk.status = Dropzone.SUCCESS;

            // Clear the data from the chunk
            chunk.dataBlock = null;
            // Leaving this reference to xhr intact here will cause memory leaks in some browsers
            chunk.xhr = null;

            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              if (file.upload.chunks[i] === undefined) {
                return handleNextChunk();
              }
              if (file.upload.chunks[i].status !== Dropzone.SUCCESS) {
                allFinished = false;
              }
            }

            if (allFinished) {
              _this14.options.chunksUploaded(file, function () {
                _this14._finished(files, '', null);
              });
            }
          };

          if (_this14.options.parallelChunkUploads) {
            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              handleNextChunk();
            }
          } else {
            handleNextChunk();
          }
        } else {
          var dataBlocks = [];
          for (var _i23 = 0; _i23 < files.length; _i23++) {
            dataBlocks[_i23] = {
              name: _this14._getParamName(_i23),
              data: transformedFiles[_i23],
              filename: files[_i23].upload.filename
            };
          }
          _this14._uploadData(files, dataBlocks);
        }
      });
    }

    /// Returns the right chunk for given file and xhr

  }, {
    key: "_getChunk",
    value: function _getChunk(file, xhr) {
      for (var i = 0; i < file.upload.totalChunkCount; i++) {
        if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].xhr === xhr) {
          return file.upload.chunks[i];
        }
      }
    }

    // This function actually uploads the file(s) to the server.
    // If dataBlocks contains the actual data to upload (meaning, that this could either be transformed
    // files, or individual chunks for chunked upload).

  }, {
    key: "_uploadData",
    value: function _uploadData(files, dataBlocks) {
      var _this15 = this;

      var xhr = new XMLHttpRequest();

      // Put the xhr object in the file objects to be able to reference it later.
      for (var _iterator22 = files, _isArray22 = true, _i24 = 0, _iterator22 = _isArray22 ? _iterator22 : _iterator22[Symbol.iterator]();;) {
        var _ref21;

        if (_isArray22) {
          if (_i24 >= _iterator22.length) break;
          _ref21 = _iterator22[_i24++];
        } else {
          _i24 = _iterator22.next();
          if (_i24.done) break;
          _ref21 = _i24.value;
        }

        var file = _ref21;

        file.xhr = xhr;
      }
      if (files[0].upload.chunked) {
        // Put the xhr object in the right chunk object, so it can be associated later, and found with _getChunk
        files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr = xhr;
      }

      var method = this.resolveOption(this.options.method, files);
      var url = this.resolveOption(this.options.url, files);
      xhr.open(method, url, true);

      // Setting the timeout after open because of IE11 issue: https://gitlab.com/meno/dropzone/issues/8
      xhr.timeout = this.resolveOption(this.options.timeout, files);

      // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
      xhr.withCredentials = !!this.options.withCredentials;

      xhr.onload = function (e) {
        _this15._finishedUploading(files, xhr, e);
      };

      xhr.onerror = function () {
        _this15._handleUploadError(files, xhr);
      };

      // Some browsers do not have the .upload property
      var progressObj = xhr.upload != null ? xhr.upload : xhr;
      progressObj.onprogress = function (e) {
        return _this15._updateFilesUploadProgress(files, xhr, e);
      };

      var headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };

      if (this.options.headers) {
        Dropzone.extend(headers, this.options.headers);
      }

      for (var headerName in headers) {
        var headerValue = headers[headerName];
        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }

      var formData = new FormData();

      // Adding all @options parameters
      if (this.options.params) {
        var additionalParams = this.options.params;
        if (typeof additionalParams === 'function') {
          additionalParams = additionalParams.call(this, files, xhr, files[0].upload.chunked ? this._getChunk(files[0], xhr) : null);
        }

        for (var key in additionalParams) {
          var value = additionalParams[key];
          formData.append(key, value);
        }
      }

      // Let the user add additional data if necessary
      for (var _iterator23 = files, _isArray23 = true, _i25 = 0, _iterator23 = _isArray23 ? _iterator23 : _iterator23[Symbol.iterator]();;) {
        var _ref22;

        if (_isArray23) {
          if (_i25 >= _iterator23.length) break;
          _ref22 = _iterator23[_i25++];
        } else {
          _i25 = _iterator23.next();
          if (_i25.done) break;
          _ref22 = _i25.value;
        }

        var _file = _ref22;

        this.emit("sending", _file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }

      this._addFormElementData(formData);

      // Finally add the files
      // Has to be last because some servers (eg: S3) expect the file to be the last parameter
      for (var i = 0; i < dataBlocks.length; i++) {
        var dataBlock = dataBlocks[i];
        formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
      }

      this.submitRequest(xhr, formData, files);
    }

    // Transforms all files with this.options.transformFile and invokes done with the transformed files when done.

  }, {
    key: "_transformFiles",
    value: function _transformFiles(files, done) {
      var _this16 = this;

      var transformedFiles = [];
      // Clumsy way of handling asynchronous calls, until I get to add a proper Future library.
      var doneCounter = 0;

      var _loop = function _loop(i) {
        _this16.options.transformFile.call(_this16, files[i], function (transformedFile) {
          transformedFiles[i] = transformedFile;
          if (++doneCounter === files.length) {
            done(transformedFiles);
          }
        });
      };

      for (var i = 0; i < files.length; i++) {
        _loop(i);
      }
    }

    // Takes care of adding other input elements of the form to the AJAX request

  }, {
    key: "_addFormElementData",
    value: function _addFormElementData(formData) {
      // Take care of other input elements
      if (this.element.tagName === "FORM") {
        for (var _iterator24 = this.element.querySelectorAll("input, textarea, select, button"), _isArray24 = true, _i26 = 0, _iterator24 = _isArray24 ? _iterator24 : _iterator24[Symbol.iterator]();;) {
          var _ref23;

          if (_isArray24) {
            if (_i26 >= _iterator24.length) break;
            _ref23 = _iterator24[_i26++];
          } else {
            _i26 = _iterator24.next();
            if (_i26.done) break;
            _ref23 = _i26.value;
          }

          var input = _ref23;

          var inputName = input.getAttribute("name");
          var inputType = input.getAttribute("type");
          if (inputType) inputType = inputType.toLowerCase();

          // If the input doesn't have a name, we can't use it.
          if (typeof inputName === 'undefined' || inputName === null) continue;

          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            // Possibly multiple values
            for (var _iterator25 = input.options, _isArray25 = true, _i27 = 0, _iterator25 = _isArray25 ? _iterator25 : _iterator25[Symbol.iterator]();;) {
              var _ref24;

              if (_isArray25) {
                if (_i27 >= _iterator25.length) break;
                _ref24 = _iterator25[_i27++];
              } else {
                _i27 = _iterator25.next();
                if (_i27.done) break;
                _ref24 = _i27.value;
              }

              var option = _ref24;

              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || inputType !== "checkbox" && inputType !== "radio" || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
    }

    // Invoked when there is new progress information about given files.
    // If e is not provided, it is assumed that the upload is finished.

  }, {
    key: "_updateFilesUploadProgress",
    value: function _updateFilesUploadProgress(files, xhr, e) {
      var progress = void 0;
      if (typeof e !== 'undefined') {
        progress = 100 * e.loaded / e.total;

        if (files[0].upload.chunked) {
          var file = files[0];
          // Since this is a chunked upload, we need to update the appropriate chunk progress.
          var chunk = this._getChunk(file, xhr);
          chunk.progress = progress;
          chunk.total = e.total;
          chunk.bytesSent = e.loaded;
          var fileProgress = 0,
              fileTotal = void 0,
              fileBytesSent = void 0;
          file.upload.progress = 0;
          file.upload.total = 0;
          file.upload.bytesSent = 0;
          for (var i = 0; i < file.upload.totalChunkCount; i++) {
            if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].progress !== undefined) {
              file.upload.progress += file.upload.chunks[i].progress;
              file.upload.total += file.upload.chunks[i].total;
              file.upload.bytesSent += file.upload.chunks[i].bytesSent;
            }
          }
          file.upload.progress = file.upload.progress / file.upload.totalChunkCount;
        } else {
          for (var _iterator26 = files, _isArray26 = true, _i28 = 0, _iterator26 = _isArray26 ? _iterator26 : _iterator26[Symbol.iterator]();;) {
            var _ref25;

            if (_isArray26) {
              if (_i28 >= _iterator26.length) break;
              _ref25 = _iterator26[_i28++];
            } else {
              _i28 = _iterator26.next();
              if (_i28.done) break;
              _ref25 = _i28.value;
            }

            var _file2 = _ref25;

            _file2.upload.progress = progress;
            _file2.upload.total = e.total;
            _file2.upload.bytesSent = e.loaded;
          }
        }
        for (var _iterator27 = files, _isArray27 = true, _i29 = 0, _iterator27 = _isArray27 ? _iterator27 : _iterator27[Symbol.iterator]();;) {
          var _ref26;

          if (_isArray27) {
            if (_i29 >= _iterator27.length) break;
            _ref26 = _iterator27[_i29++];
          } else {
            _i29 = _iterator27.next();
            if (_i29.done) break;
            _ref26 = _i29.value;
          }

          var _file3 = _ref26;

          this.emit("uploadprogress", _file3, _file3.upload.progress, _file3.upload.bytesSent);
        }
      } else {
        // Called when the file finished uploading

        var allFilesFinished = true;

        progress = 100;

        for (var _iterator28 = files, _isArray28 = true, _i30 = 0, _iterator28 = _isArray28 ? _iterator28 : _iterator28[Symbol.iterator]();;) {
          var _ref27;

          if (_isArray28) {
            if (_i30 >= _iterator28.length) break;
            _ref27 = _iterator28[_i30++];
          } else {
            _i30 = _iterator28.next();
            if (_i30.done) break;
            _ref27 = _i30.value;
          }

          var _file4 = _ref27;

          if (_file4.upload.progress !== 100 || _file4.upload.bytesSent !== _file4.upload.total) {
            allFilesFinished = false;
          }
          _file4.upload.progress = progress;
          _file4.upload.bytesSent = _file4.upload.total;
        }

        // Nothing to do, all files already at 100%
        if (allFilesFinished) {
          return;
        }

        for (var _iterator29 = files, _isArray29 = true, _i31 = 0, _iterator29 = _isArray29 ? _iterator29 : _iterator29[Symbol.iterator]();;) {
          var _ref28;

          if (_isArray29) {
            if (_i31 >= _iterator29.length) break;
            _ref28 = _iterator29[_i31++];
          } else {
            _i31 = _iterator29.next();
            if (_i31.done) break;
            _ref28 = _i31.value;
          }

          var _file5 = _ref28;

          this.emit("uploadprogress", _file5, progress, _file5.upload.bytesSent);
        }
      }
    }
  }, {
    key: "_finishedUploading",
    value: function _finishedUploading(files, xhr, e) {
      var response = void 0;

      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.responseType !== 'arraybuffer' && xhr.responseType !== 'blob') {
        response = xhr.responseText;

        if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
          try {
            response = JSON.parse(response);
          } catch (error) {
            e = error;
            response = "Invalid JSON response from server.";
          }
        }
      }

      this._updateFilesUploadProgress(files);

      if (!(200 <= xhr.status && xhr.status < 300)) {
        this._handleUploadError(files, xhr, response);
      } else {
        if (files[0].upload.chunked) {
          files[0].upload.finishedChunkUpload(this._getChunk(files[0], xhr));
        } else {
          this._finished(files, response, e);
        }
      }
    }
  }, {
    key: "_handleUploadError",
    value: function _handleUploadError(files, xhr, response) {
      if (files[0].status === Dropzone.CANCELED) {
        return;
      }

      if (files[0].upload.chunked && this.options.retryChunks) {
        var chunk = this._getChunk(files[0], xhr);
        if (chunk.retries++ < this.options.retryChunksLimit) {
          this._uploadData(files, [chunk.dataBlock]);
          return;
        } else {
          console.warn('Retried this chunk too often. Giving up.');
        }
      }

      for (var _iterator30 = files, _isArray30 = true, _i32 = 0, _iterator30 = _isArray30 ? _iterator30 : _iterator30[Symbol.iterator]();;) {
        var _ref29;

        if (_isArray30) {
          if (_i32 >= _iterator30.length) break;
          _ref29 = _iterator30[_i32++];
        } else {
          _i32 = _iterator30.next();
          if (_i32.done) break;
          _ref29 = _i32.value;
        }

        var file = _ref29;

        this._errorProcessing(files, response || this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
      }
    }
  }, {
    key: "submitRequest",
    value: function submitRequest(xhr, formData, files) {
      xhr.send(formData);
    }

    // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_finished",
    value: function _finished(files, responseText, e) {
      for (var _iterator31 = files, _isArray31 = true, _i33 = 0, _iterator31 = _isArray31 ? _iterator31 : _iterator31[Symbol.iterator]();;) {
        var _ref30;

        if (_isArray31) {
          if (_i33 >= _iterator31.length) break;
          _ref30 = _iterator31[_i33++];
        } else {
          _i33 = _iterator31.next();
          if (_i33.done) break;
          _ref30 = _i33.value;
        }

        var file = _ref30;

        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }

    // Called internally when processing is finished.
    // Individual callbacks have to be called in the appropriate sections.

  }, {
    key: "_errorProcessing",
    value: function _errorProcessing(files, message, xhr) {
      for (var _iterator32 = files, _isArray32 = true, _i34 = 0, _iterator32 = _isArray32 ? _iterator32 : _iterator32[Symbol.iterator]();;) {
        var _ref31;

        if (_isArray32) {
          if (_i34 >= _iterator32.length) break;
          _ref31 = _iterator32[_i34++];
        } else {
          _i34 = _iterator32.next();
          if (_i34.done) break;
          _ref31 = _i34.value;
        }

        var file = _ref31;

        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }], [{
    key: "uuidv4",
    value: function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
      });
    }
  }]);

  return Dropzone;
}(Emitter);

Dropzone.initClass();

Dropzone.version = "5.5.1";

// This is a map of options for your different dropzones. Add configurations
// to this object for your different dropzone elemens.
//
// Example:
//
//     Dropzone.options.myDropzoneElementId = { maxFilesize: 1 };
//
// To disable autoDiscover for a specific element, you can set `false` as an option:
//
//     Dropzone.options.myDisabledElementId = false;
//
// And in html:
//
//     <form action="/upload" id="my-dropzone-element-id" class="dropzone"></form>
Dropzone.options = {};

// Returns the options for an element or undefined if none available.
Dropzone.optionsForElement = function (element) {
  // Get the `Dropzone.options.elementId` for this element if it exists
  if (element.getAttribute("id")) {
    return Dropzone.options[camelize(element.getAttribute("id"))];
  } else {
    return undefined;
  }
};

// Holds a list of all dropzone instances
Dropzone.instances = [];

// Returns the dropzone for given element if any
Dropzone.forElement = function (element) {
  if (typeof element === "string") {
    element = document.querySelector(element);
  }
  if ((element != null ? element.dropzone : undefined) == null) {
    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
  }
  return element.dropzone;
};

// Set to false if you don't want Dropzone to automatically find and attach to .dropzone elements.
Dropzone.autoDiscover = true;

// Looks for all .dropzone elements and creates a dropzone for them
Dropzone.discover = function () {
  var dropzones = void 0;
  if (document.querySelectorAll) {
    dropzones = document.querySelectorAll(".dropzone");
  } else {
    dropzones = [];
    // IE :(
    var checkElements = function checkElements(elements) {
      return function () {
        var result = [];
        for (var _iterator33 = elements, _isArray33 = true, _i35 = 0, _iterator33 = _isArray33 ? _iterator33 : _iterator33[Symbol.iterator]();;) {
          var _ref32;

          if (_isArray33) {
            if (_i35 >= _iterator33.length) break;
            _ref32 = _iterator33[_i35++];
          } else {
            _i35 = _iterator33.next();
            if (_i35.done) break;
            _ref32 = _i35.value;
          }

          var el = _ref32;

          if (/(^| )dropzone($| )/.test(el.className)) {
            result.push(dropzones.push(el));
          } else {
            result.push(undefined);
          }
        }
        return result;
      }();
    };
    checkElements(document.getElementsByTagName("div"));
    checkElements(document.getElementsByTagName("form"));
  }

  return function () {
    var result = [];
    for (var _iterator34 = dropzones, _isArray34 = true, _i36 = 0, _iterator34 = _isArray34 ? _iterator34 : _iterator34[Symbol.iterator]();;) {
      var _ref33;

      if (_isArray34) {
        if (_i36 >= _iterator34.length) break;
        _ref33 = _iterator34[_i36++];
      } else {
        _i36 = _iterator34.next();
        if (_i36.done) break;
        _ref33 = _i36.value;
      }

      var dropzone = _ref33;

      // Create a dropzone unless auto discover has been disabled for specific element
      if (Dropzone.optionsForElement(dropzone) !== false) {
        result.push(new Dropzone(dropzone));
      } else {
        result.push(undefined);
      }
    }
    return result;
  }();
};

// Since the whole Drag'n'Drop API is pretty new, some browsers implement it,
// but not correctly.
// So I created a blacklist of userAgents. Yes, yes. Browser sniffing, I know.
// But what to do when browsers *theoretically* support an API, but crash
// when using it.
//
// This is a list of regular expressions tested against navigator.userAgent
//
// ** It should only be used on browser that *do* support the API, but
// incorrectly **
//
Dropzone.blacklistedBrowsers = [
// The mac os and windows phone version of opera 12 seems to have a problem with the File drag'n'drop API.
/opera.*(Macintosh|Windows Phone).*version\/12/i];

// Checks if the browser is supported
Dropzone.isBrowserSupported = function () {
  var capableBrowser = true;

  if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
    if (!("classList" in document.createElement("a"))) {
      capableBrowser = false;
    } else {
      // The browser supports the API, but may be blacklisted.
      for (var _iterator35 = Dropzone.blacklistedBrowsers, _isArray35 = true, _i37 = 0, _iterator35 = _isArray35 ? _iterator35 : _iterator35[Symbol.iterator]();;) {
        var _ref34;

        if (_isArray35) {
          if (_i37 >= _iterator35.length) break;
          _ref34 = _iterator35[_i37++];
        } else {
          _i37 = _iterator35.next();
          if (_i37.done) break;
          _ref34 = _i37.value;
        }

        var regex = _ref34;

        if (regex.test(navigator.userAgent)) {
          capableBrowser = false;
          continue;
        }
      }
    }
  } else {
    capableBrowser = false;
  }

  return capableBrowser;
};

Dropzone.dataURItoBlob = function (dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0, end = byteString.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob
  return new Blob([ab], { type: mimeString });
};

// Returns an array without the rejected item
var without = function without(list, rejectedItem) {
  return list.filter(function (item) {
    return item !== rejectedItem;
  }).map(function (item) {
    return item;
  });
};

// abc-def_ghi -> abcDefGhi
var camelize = function camelize(str) {
  return str.replace(/[\-_](\w)/g, function (match) {
    return match.charAt(1).toUpperCase();
  });
};

// Creates an element from string
Dropzone.createElement = function (string) {
  var div = document.createElement("div");
  div.innerHTML = string;
  return div.childNodes[0];
};

// Tests if given element is inside (or simply is) the container
Dropzone.elementInside = function (element, container) {
  if (element === container) {
    return true;
  } // Coffeescript doesn't support do/while loops
  while (element = element.parentNode) {
    if (element === container) {
      return true;
    }
  }
  return false;
};

Dropzone.getElement = function (el, name) {
  var element = void 0;
  if (typeof el === "string") {
    element = document.querySelector(el);
  } else if (el.nodeType != null) {
    element = el;
  }
  if (element == null) {
    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
  }
  return element;
};

Dropzone.getElements = function (els, name) {
  var el = void 0,
      elements = void 0;
  if (els instanceof Array) {
    elements = [];
    try {
      for (var _iterator36 = els, _isArray36 = true, _i38 = 0, _iterator36 = _isArray36 ? _iterator36 : _iterator36[Symbol.iterator]();;) {
        if (_isArray36) {
          if (_i38 >= _iterator36.length) break;
          el = _iterator36[_i38++];
        } else {
          _i38 = _iterator36.next();
          if (_i38.done) break;
          el = _i38.value;
        }

        elements.push(this.getElement(el, name));
      }
    } catch (e) {
      elements = null;
    }
  } else if (typeof els === "string") {
    elements = [];
    for (var _iterator37 = document.querySelectorAll(els), _isArray37 = true, _i39 = 0, _iterator37 = _isArray37 ? _iterator37 : _iterator37[Symbol.iterator]();;) {
      if (_isArray37) {
        if (_i39 >= _iterator37.length) break;
        el = _iterator37[_i39++];
      } else {
        _i39 = _iterator37.next();
        if (_i39.done) break;
        el = _i39.value;
      }

      elements.push(el);
    }
  } else if (els.nodeType != null) {
    elements = [els];
  }

  if (elements == null || !elements.length) {
    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
  }

  return elements;
};

// Asks the user the question and calls accepted or rejected accordingly
//
// The default implementation just uses `window.confirm` and then calls the
// appropriate callback.
Dropzone.confirm = function (question, accepted, rejected) {
  if (window.confirm(question)) {
    return accepted();
  } else if (rejected != null) {
    return rejected();
  }
};

// Validates the mime type like this:
//
// https://developer.mozilla.org/en-US/docs/HTML/Element/input#attr-accept
Dropzone.isValidFile = function (file, acceptedFiles) {
  if (!acceptedFiles) {
    return true;
  } // If there are no accepted mime types, it's OK
  acceptedFiles = acceptedFiles.split(",");

  var mimeType = file.type;
  var baseMimeType = mimeType.replace(/\/.*$/, "");

  for (var _iterator38 = acceptedFiles, _isArray38 = true, _i40 = 0, _iterator38 = _isArray38 ? _iterator38 : _iterator38[Symbol.iterator]();;) {
    var _ref35;

    if (_isArray38) {
      if (_i40 >= _iterator38.length) break;
      _ref35 = _iterator38[_i40++];
    } else {
      _i40 = _iterator38.next();
      if (_i40.done) break;
      _ref35 = _i40.value;
    }

    var validType = _ref35;

    validType = validType.trim();
    if (validType.charAt(0) === ".") {
      if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
        return true;
      }
    } else if (/\/\*$/.test(validType)) {
      // This is something like a image/* mime type
      if (baseMimeType === validType.replace(/\/.*$/, "")) {
        return true;
      }
    } else {
      if (mimeType === validType) {
        return true;
      }
    }
  }

  return false;
};

// Augment jQuery
if (typeof jQuery !== 'undefined' && jQuery !== null) {
  jQuery.fn.dropzone = function (options) {
    return this.each(function () {
      return new Dropzone(this, options);
    });
  };
}

if ( true && module !== null) {
  module.exports = Dropzone;
} else {
  window.Dropzone = Dropzone;
}

// Dropzone file status codes
Dropzone.ADDED = "added";

Dropzone.QUEUED = "queued";
// For backwards compatibility. Now, if a file is accepted, it's either queued
// or uploading.
Dropzone.ACCEPTED = Dropzone.QUEUED;

Dropzone.UPLOADING = "uploading";
Dropzone.PROCESSING = Dropzone.UPLOADING; // alias

Dropzone.CANCELED = "canceled";
Dropzone.ERROR = "error";
Dropzone.SUCCESS = "success";

/*

 Bugfix for iOS 6 and 7
 Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
 based on the work of https://github.com/stomita/ios-imagefile-megapixel

 */

// Detecting vertical squash in loaded image.
// Fixes a bug which squash image vertically while drawing into canvas for some images.
// This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
var detectVerticalSquash = function detectVerticalSquash(img) {
  var iw = img.naturalWidth;
  var ih = img.naturalHeight;
  var canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = ih;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var _ctx$getImageData = ctx.getImageData(1, 0, 1, ih),
      data = _ctx$getImageData.data;

  // search image edge pixel position in case it is squashed vertically.


  var sy = 0;
  var ey = ih;
  var py = ih;
  while (py > sy) {
    var alpha = data[(py - 1) * 4 + 3];

    if (alpha === 0) {
      ey = py;
    } else {
      sy = py;
    }

    py = ey + sy >> 1;
  }
  var ratio = py / ih;

  if (ratio === 0) {
    return 1;
  } else {
    return ratio;
  }
};

// A replacement for context.drawImage
// (args are for source and destination).
var drawImageIOSFix = function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
  var vertSquashRatio = detectVerticalSquash(img);
  return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
};

// Based on MinifyJpeg
// Source: http://www.perry.cz/files/ExifRestorer.js
// http://elicon.blog57.fc2.com/blog-entry-206.html

var ExifRestore = function () {
  function ExifRestore() {
    _classCallCheck(this, ExifRestore);
  }

  _createClass(ExifRestore, null, [{
    key: "initClass",
    value: function initClass() {
      this.KEY_STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    }
  }, {
    key: "encode64",
    value: function encode64(input) {
      var output = '';
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = '';
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = '';
      var i = 0;
      while (true) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + this.KEY_STR.charAt(enc1) + this.KEY_STR.charAt(enc2) + this.KEY_STR.charAt(enc3) + this.KEY_STR.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
        if (!(i < input.length)) {
          break;
        }
      }
      return output;
    }
  }, {
    key: "restore",
    value: function restore(origFileBase64, resizedFileBase64) {
      if (!origFileBase64.match('data:image/jpeg;base64,')) {
        return resizedFileBase64;
      }
      var rawImage = this.decode64(origFileBase64.replace('data:image/jpeg;base64,', ''));
      var segments = this.slice2Segments(rawImage);
      var image = this.exifManipulation(resizedFileBase64, segments);
      return "data:image/jpeg;base64," + this.encode64(image);
    }
  }, {
    key: "exifManipulation",
    value: function exifManipulation(resizedFileBase64, segments) {
      var exifArray = this.getExifArray(segments);
      var newImageArray = this.insertExif(resizedFileBase64, exifArray);
      var aBuffer = new Uint8Array(newImageArray);
      return aBuffer;
    }
  }, {
    key: "getExifArray",
    value: function getExifArray(segments) {
      var seg = undefined;
      var x = 0;
      while (x < segments.length) {
        seg = segments[x];
        if (seg[0] === 255 & seg[1] === 225) {
          return seg;
        }
        x++;
      }
      return [];
    }
  }, {
    key: "insertExif",
    value: function insertExif(resizedFileBase64, exifArray) {
      var imageData = resizedFileBase64.replace('data:image/jpeg;base64,', '');
      var buf = this.decode64(imageData);
      var separatePoint = buf.indexOf(255, 3);
      var mae = buf.slice(0, separatePoint);
      var ato = buf.slice(separatePoint);
      var array = mae;
      array = array.concat(exifArray);
      array = array.concat(ato);
      return array;
    }
  }, {
    key: "slice2Segments",
    value: function slice2Segments(rawImageArray) {
      var head = 0;
      var segments = [];
      while (true) {
        var length;
        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 218) {
          break;
        }
        if (rawImageArray[head] === 255 & rawImageArray[head + 1] === 216) {
          head += 2;
        } else {
          length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
          var endPoint = head + length + 2;
          var seg = rawImageArray.slice(head, endPoint);
          segments.push(seg);
          head = endPoint;
        }
        if (head > rawImageArray.length) {
          break;
        }
      }
      return segments;
    }
  }, {
    key: "decode64",
    value: function decode64(input) {
      var output = '';
      var chr1 = undefined;
      var chr2 = undefined;
      var chr3 = '';
      var enc1 = undefined;
      var enc2 = undefined;
      var enc3 = undefined;
      var enc4 = '';
      var i = 0;
      var buf = [];
      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        console.warn('There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\nExpect errors in decoding.');
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      while (true) {
        enc1 = this.KEY_STR.indexOf(input.charAt(i++));
        enc2 = this.KEY_STR.indexOf(input.charAt(i++));
        enc3 = this.KEY_STR.indexOf(input.charAt(i++));
        enc4 = this.KEY_STR.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        buf.push(chr1);
        if (enc3 !== 64) {
          buf.push(chr2);
        }
        if (enc4 !== 64) {
          buf.push(chr3);
        }
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
        if (!(i < input.length)) {
          break;
        }
      }
      return buf;
    }
  }]);

  return ExifRestore;
}();

ExifRestore.initClass();

/*
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 */

// @win window reference
// @fn function reference
var contentLoaded = function contentLoaded(win, fn) {
  var done = false;
  var top = true;
  var doc = win.document;
  var root = doc.documentElement;
  var add = doc.addEventListener ? "addEventListener" : "attachEvent";
  var rem = doc.addEventListener ? "removeEventListener" : "detachEvent";
  var pre = doc.addEventListener ? "" : "on";
  var init = function init(e) {
    if (e.type === "readystatechange" && doc.readyState !== "complete") {
      return;
    }
    (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
    if (!done && (done = true)) {
      return fn.call(win, e.type || e);
    }
  };

  var poll = function poll() {
    try {
      root.doScroll("left");
    } catch (e) {
      setTimeout(poll, 50);
      return;
    }
    return init("poll");
  };

  if (doc.readyState !== "complete") {
    if (doc.createEventObject && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (error) {}
      if (top) {
        poll();
      }
    }
    doc[add](pre + "DOMContentLoaded", init, false);
    doc[add](pre + "readystatechange", init, false);
    return win[add](pre + "load", init, false);
  }
};

// As a single function to be able to write tests.
Dropzone._autoDiscoverFunction = function () {
  if (Dropzone.autoDiscover) {
    return Dropzone.discover();
  }
};
contentLoaded(window, Dropzone._autoDiscoverFunction);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! ./../../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/sortablejs/modular/sortable.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/sortablejs/modular/sortable.esm.js ***!
  \*********************************************************/
/*! exports provided: default, MultiDrag, Sortable, Swap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiDrag", function() { return MultiDragPlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sortable", function() { return Sortable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Swap", function() { return SwapPlugin; });
/**!
 * Sortable 1.10.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var version = "1.10.2";

function userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !!
    /*@__PURE__*/
    navigator.userAgent.match(pattern);
  }
}

var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

var captureMode = {
  capture: false,
  passive: false
};

function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}

function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}

function matches(
/**HTMLElement*/
el,
/**String*/
selector) {
  if (!selector) return;
  selector[0] === '>' && (selector = selector.substring(1));

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }

  return false;
}

function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}

function closest(
/**HTMLElement*/
el,
/**String*/
selector,
/**HTMLElement*/
ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;

    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }

      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = getParentOrHost(el));
  }

  return null;
}

var R_SPACE = /\s+/g;

function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}

function css(el, prop, val) {
  var style = el && el.style;

  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}

function matrix(el, selfOnly) {
  var appliedTransforms = '';

  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, 'transform');

      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */

    } while (!selfOnly && (el = el.parentNode));
  }

  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */

  return matrixFn && new matrixFn(appliedTransforms);
}

function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName),
        i = 0,
        n = list.length;

    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }

    return list;
  }

  return [];
}

function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */


function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;

  if (el !== window && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }

  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    // Adjust for translate()
    container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11

    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

          top -= containerRect.top + parseInt(css(container, 'border-top-width'));
          left -= containerRect.left + parseInt(css(container, 'border-left-width'));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
        /* jshint boss:true */

      } while (container = container.parentNode);
    }
  }

  if (undoScale && el !== window) {
    // Adjust for scale()
    var elMatrix = matrix(container || el),
        scaleX = elMatrix && elMatrix.a,
        scaleY = elMatrix && elMatrix.d;

    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }

  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: width,
    height: height
  };
}
/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */


function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true),
      elSideVal = getRect(el)[elSide];
  /* jshint boss:true */

  while (parent) {
    var parentSideVal = getRect(parent)[parentSide],
        visible = void 0;

    if (parentSide === 'top' || parentSide === 'left') {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }

    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }

  return false;
}
/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */


function getChild(el, childNum, options) {
  var currentChild = 0,
      i = 0,
      children = el.children;

  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && children[i] !== Sortable.dragged && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }

      currentChild++;
    }

    i++;
  }

  return null;
}
/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */


function lastChild(el, selector) {
  var last = el.lastElementChild;

  while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }

  return last || null;
}
/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */


function index(el, selector) {
  var index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }
  /* jshint boss:true */


  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index++;
    }
  }

  return index;
}
/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */


function getRelativeScrollOffset(el) {
  var offsetLeft = 0,
      offsetTop = 0,
      winScroller = getWindowScrollingElement();

  if (el) {
    do {
      var elMatrix = matrix(el),
          scaleX = elMatrix.a,
          scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }

  return [offsetLeft, offsetTop];
}
/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */


function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }

  return -1;
}

function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;

  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);

      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */

  } while (elem = elem.parentNode);

  return getWindowScrollingElement();
}

function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}

var _throttleTimeout;

function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      var args = arguments,
          _this = this;

      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }

      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}

function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}

function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}

function clone(el) {
  var Polymer = window.Polymer;
  var $ = __webpack_provided_window_dot_jQuery || window.Zepto;

  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}

function setRect(el, rect) {
  css(el, 'position', 'absolute');
  css(el, 'top', rect.top);
  css(el, 'left', rect.left);
  css(el, 'width', rect.width);
  css(el, 'height', rect.height);
}

function unsetRect(el) {
  css(el, 'position', '');
  css(el, 'top', '');
  css(el, 'left', '');
  css(el, 'width', '');
  css(el, 'height', '');
}

var expando = 'Sortable' + new Date().getTime();

function AnimationStateManager() {
  var animationStates = [],
      animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });

        var fromRect = _objectSpread({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation


        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);

          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;

      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }

      var animating = false,
          animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
            target = state.target,
            fromRect = target.fromRect,
            toRect = getRect(target),
            prevFromRect = target.prevFromRect,
            prevToRect = target.prevToRect,
            animatingRect = state.rect,
            targetMatrix = matrix(target, true);

        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }

        target.toRect = toRect;

        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        } // if fromRect != toRect: animate


        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;

          if (!time) {
            time = _this.options.animation;
          }

          _this.animate(target, animatingRect, toRect, time);
        }

        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);

      if (!animating) {
        if (typeof callback === 'function') callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === 'function') callback();
        }, animationTime);
      }

      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, 'transition', '');
        css(target, 'transform', '');
        var elMatrix = matrix(this.el),
            scaleX = elMatrix && elMatrix.a,
            scaleY = elMatrix && elMatrix.d,
            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        repaint(target); // repaint

        css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        css(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css(target, 'transition', '');
          css(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}

function repaint(target) {
  return target.offsetWidth;
}

function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}

var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }

    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;

    this.eventCanceled = false;

    evt.cancel = function () {
      _this.eventCanceled = true;
    };

    var eventNameGlobal = eventName + 'Global';
    plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread({
          sortable: sortable
        }, evt));
      } // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined


      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized; // Add default options from plugin

      _extends(defaults, initialized.defaults);
    });

    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);

      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;

      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};

function dispatchEvent(_ref) {
  var sortable = _ref.sortable,
      rootEl = _ref.rootEl,
      name = _ref.name,
      targetEl = _ref.targetEl,
      cloneEl = _ref.cloneEl,
      toEl = _ref.toEl,
      fromEl = _ref.fromEl,
      oldIndex = _ref.oldIndex,
      newIndex = _ref.newIndex,
      oldDraggableIndex = _ref.oldDraggableIndex,
      newDraggableIndex = _ref.newDraggableIndex,
      originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  var evt,
      options = sortable.options,
      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
  }

  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

  var allEventProperties = _objectSpread({}, extraEventProperties, PluginManager.getEventProperties(name, sortable));

  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }

  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }

  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

var pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      originalEvent = _ref.evt,
      data = _objectWithoutProperties(_ref, ["evt"]);

  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread({
    dragEl: dragEl,
    parentEl: parentEl,
    ghostEl: ghostEl,
    rootEl: rootEl,
    nextEl: nextEl,
    lastDownEl: lastDownEl,
    cloneEl: cloneEl,
    cloneHidden: cloneHidden,
    dragStarted: moved,
    putSortable: putSortable,
    activeSortable: Sortable.active,
    originalEvent: originalEvent,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};

function _dispatchEvent(info) {
  dispatchEvent(_objectSpread({
    putSortable: putSortable,
    cloneEl: cloneEl,
    targetEl: dragEl,
    rootEl: rootEl,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex
  }, info));
}

var dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    oldIndex,
    newIndex,
    oldDraggableIndex,
    newDraggableIndex,
    activeGroup,
    putSortable,
    awaitingDragStarted = false,
    ignoreNextClick = false,
    sortables = [],
    tapEvt,
    touchEvt,
    lastDx,
    lastDy,
    tapDistanceLeft,
    tapDistanceTop,
    moved,
    lastTarget,
    lastDirection,
    pastFirstInvertThresh = false,
    isCircumstantialInvert = false,
    targetMoveDistance,
    // For positioning ghost absolutely
ghostRelativeParent,
    ghostRelativeParentInitialScroll = [],
    // (left, top)
_silent = false,
    savedInputChecked = [];
/** @const */

var documentExists = typeof document !== 'undefined',
    PositionGhostAbsolutely = IOS,
    CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
    // This will not pass for IE9, because IE9 DnD only works on anchors
supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
    supportCssPointerEvents = function () {
  if (!documentExists) return; // false when <= IE11

  if (IE11OrLess) {
    return false;
  }

  var el = document.createElement('x');
  el.style.cssText = 'pointer-events:auto';
  return el.style.pointerEvents === 'auto';
}(),
    _detectDirection = function _detectDirection(el, options) {
  var elCSS = css(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css(child1),
      secondChildCSS = child2 && css(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

  if (elCSS.display === 'flex') {
    return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
  }

  if (elCSS.display === 'grid') {
    return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
  }

  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
    var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
    return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
  }

  return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
},
    _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
},

/**
 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
 * @param  {Number} x      X position
 * @param  {Number} y      Y position
 * @return {HTMLElement}   Element of the first found nearest Sortable
 */
_detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
  var ret;
  sortables.some(function (sortable) {
    if (lastChild(sortable)) return;
    var rect = getRect(sortable),
        threshold = sortable[expando].options.emptyInsertThreshold,
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

    if (threshold && insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
},
    _prepareGroup = function _prepareGroup(options) {
  function toFn(value, pull) {
    return function (to, from, dragEl, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

      if (value == null && (pull || sameGroup)) {
        // Default pull value
        // Default pull and put value if same group
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === 'clone') {
        return value;
      } else if (typeof value === 'function') {
        return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }

  var group = {};
  var originalGroup = options.group;

  if (!originalGroup || _typeof(originalGroup) != 'object') {
    originalGroup = {
      name: originalGroup
    };
  }

  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
},
    _hideGhostForTarget = function _hideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', 'none');
  }
},
    _unhideGhostForTarget = function _unhideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', '');
  }
}; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


if (documentExists) {
  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}

var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;

    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

    if (nearest) {
      // Create imitation event
      var event = {};

      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }

      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;

      nearest[expando]._onDragOver(event);
    }
  }
};

var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */


function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }

  this.el = el; // root element

  this.options = options = _extends({}, options); // Export instance

  el[expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    ignore: 'a, img',
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl) {
      dataTransfer.setData('Text', dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: 'data-id',
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults); // Set default options

  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }

  _prepareGroup(options); // Bind all private methods


  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  } // Setup drag mode


  this.nativeDraggable = options.forceFallback ? false : supportDraggable;

  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  } // Bind events


  if (options.supportPointer) {
    on(el, 'pointerdown', this._onTapStart);
  } else {
    on(el, 'mousedown', this._onTapStart);
    on(el, 'touchstart', this._onTapStart);
  }

  if (this.nativeDraggable) {
    on(el, 'dragover', this);
    on(el, 'dragenter', this);
  }

  sortables.push(this.el); // Restore sorting

  options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

  _extends(this, AnimationStateManager());
}

Sortable.prototype =
/** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(
  /** Event|TouchEvent */
  evt) {
    if (!evt.cancelable) return;

    var _this = this,
        el = this.el,
        options = this.options,
        preventOnFilter = options.preventOnFilter,
        type = evt.type,
        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
        target = (touch || evt).target,
        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
        filter = options.filter;

    _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


    if (dragEl) {
      return;
    }

    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    } // cancel dnd if original target is content editable


    if (originalTarget.isContentEditable) {
      return;
    }

    target = closest(target, options.draggable, el, false);

    if (target && target.animated) {
      return;
    }

    if (lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    } // Get the index of the dragged element within its parent


    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable); // Check filter

    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });

        pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);

        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });

          pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });

      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    }

    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    } // Prepare `dragstart`


    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(
  /** Event */
  evt,
  /** Touch */
  touch,
  /** HTMLElement */
  target) {
    var _this = this,
        el = _this.el,
        options = _this.options,
        ownerDocument = el.ownerDocument,
        dragStartFn;

    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style['will-change'] = 'all';

      dragStartFn = function dragStartFn() {
        pluginEvent('delayEnded', _this, {
          evt: evt
        });

        if (Sortable.eventCanceled) {
          _this._onDrop();

          return;
        } // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove


        _this._disableDelayedDragEvents();

        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        } // Bind the events: dragstart/dragend


        _this._triggerDragStart(evt, touch); // Drag start event


        _dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        }); // Chosen item


        toggleClass(dragEl, options.chosenClass, true);
      }; // Disable "draggable"


      options.ignore.split(',').forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mouseup', _this._onDrop);
      on(ownerDocument, 'touchend', _this._onDrop);
      on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }

      pluginEvent('delayStart', this, {
        evt: evt
      }); // Delay is impossible for native DnD in Edge or IE

      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();

          return;
        } // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag


        on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
        on(ownerDocument, 'touchend', _this._disableDelayedDrag);
        on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
  /** TouchEvent|PointerEvent **/
  e) {
    var touch = e.touches ? e.touches[0] : e;

    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);

    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    off(ownerDocument, 'touchend', this._disableDelayedDrag);
    off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(
  /** Event */
  evt,
  /** Touch */
  touch) {
    touch = touch || evt.pointerType == 'touch' && evt;

    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        on(document, 'touchmove', this._onTouchMove);
      } else {
        on(document, 'mousemove', this._onTouchMove);
      }
    } else {
      on(dragEl, 'dragend', this);
      on(rootEl, 'dragstart', this._onDragStart);
    }

    try {
      if (document.selection) {
        // Timeout neccessary for IE9
        _nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {

    awaitingDragStarted = false;

    if (rootEl && dragEl) {
      pluginEvent('dragStarted', this, {
        evt: evt
      });

      if (this.nativeDraggable) {
        on(document, 'dragover', _checkOutsideTargetEl);
      }

      var options = this.options; // Apply effect

      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost(); // Drag start event

      _dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;

      _hideGhostForTarget();

      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;

      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }

      dragEl.parentNode[expando]._isOutsideThisEl(target);

      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target: target,
              rootEl: parent
            });

            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }

          target = parent; // store last element
        }
        /* jshint boss:true */
        while (parent = parent.parentNode);
      }

      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(
  /**TouchEvent*/
  evt) {
    if (tapEvt) {
      var options = this.options,
          fallbackTolerance = options.fallbackTolerance,
          fallbackOffset = options.fallbackOffset,
          touch = evt.touches ? evt.touches[0] : evt,
          ghostMatrix = ghostEl && matrix(ghostEl, true),
          scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
          scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
          relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
          dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
          dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }

        this._onDragStart(evt, true);
      }

      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }

        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, 'webkitTransform', cssMatrix);
        css(ghostEl, 'mozTransform', cssMatrix);
        css(ghostEl, 'msTransform', cssMatrix);
        css(ghostEl, 'transform', cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }

      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl,
          rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
          options = this.options; // Position absolutely

      if (PositionGhostAbsolutely) {
        // Get relatively positioned parent
        ghostRelativeParent = container;

        while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }

        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }

        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }

      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, 'transition', '');
      css(ghostEl, 'transform', '');
      css(ghostEl, 'box-sizing', 'border-box');
      css(ghostEl, 'margin', 0);
      css(ghostEl, 'top', rect.top);
      css(ghostEl, 'left', rect.left);
      css(ghostEl, 'width', rect.width);
      css(ghostEl, 'height', rect.height);
      css(ghostEl, 'opacity', '0.8');
      css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
      css(ghostEl, 'zIndex', '100000');
      css(ghostEl, 'pointerEvents', 'none');
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl); // Set transform-origin

      css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
    }
  },
  _onDragStart: function _onDragStart(
  /**Event*/
  evt,
  /**boolean*/
  fallback) {
    var _this = this;

    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent('dragStart', this, {
      evt: evt
    });

    if (Sortable.eventCanceled) {
      this._onDrop();

      return;
    }

    pluginEvent('setupClone', this);

    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.draggable = false;
      cloneEl.style['will-change'] = '';

      this._hideClone();

      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    } // #1143: IFrame support workaround


    _this.cloneId = _nextTick(function () {
      pluginEvent('clone', _this);
      if (Sortable.eventCanceled) return;

      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }

      _this._hideClone();

      _dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true); // Set proper drop events

    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off(document, 'mouseup', _this._onDrop);
      off(document, 'touchend', _this._onDrop);
      off(document, 'touchcancel', _this._onDrop);

      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }

      on(document, 'drop', _this); // #1276 fix:

      css(dragEl, 'transform', 'translateZ(0)');
    }

    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, 'selectstart', _this);
    moved = true;

    if (Safari) {
      css(document.body, 'user-select', 'none');
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(
  /**Event*/
  evt) {
    var el = this.el,
        target = evt.target,
        dragRect,
        targetRect,
        revert,
        options = this.options,
        group = options.group,
        activeSortable = Sortable.active,
        isOwner = activeGroup === group,
        canSort = options.sort,
        fromSortable = putSortable || activeSortable,
        vertical,
        _this = this,
        completedFired = false;

    if (_silent) return;

    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, _objectSpread({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
        },
        changed: changed
      }, extra));
    } // Capture animation state


    function capture() {
      dragOverEvent('dragOverAnimationCapture');

      _this.captureAnimationState();

      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    } // Return invocation when dragEl is inserted (or completed)


    function completed(insertion) {
      dragOverEvent('dragOverCompleted', {
        insertion: insertion
      });

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }

        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }

        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        } // Animation


        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }

        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });

        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      } // Null lastTarget if it is not inside a previously swapped element


      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      } // no bubbling and not fallback


      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


        !insertion && nearestEmptyInsertDetectEvent(evt);
      }

      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    } // Call when dragEl has been inserted


    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);

      _dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: newIndex,
        newDraggableIndex: newDraggableIndex,
        originalEvent: evt
      });
    }

    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }

    target = closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if (Sortable.eventCanceled) return completedFired;

    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }

    ignoreNextClick = false;

    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = getRect(dragEl);
      dragOverEvent('dragOverValid');
      if (Sortable.eventCanceled) return completedFired;

      if (revert) {
        parentEl = rootEl; // actualization

        capture();

        this._hideClone();

        dragOverEvent('revert');

        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }

        return completed(true);
      }

      var elLastChild = lastChild(el, options.draggable);

      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // If already at end of list: Do not insert
        if (elLastChild === dragEl) {
          return completed(false);
        } // assign target only if condition is true


        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }

        if (target) {
          targetRect = getRect(target);
        }

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          el.appendChild(dragEl);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0,
            targetBeforeFirstSwap,
            differentLevel = dragEl.parentNode !== el,
            differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
            side1 = vertical ? 'top' : 'left',
            scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }

        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;

        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = index(dragEl);

          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
        } // If dragEl is already beside target: Do not insert


        if (direction === 0 || sibling === target) {
          return completed(false);
        }

        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling,
            after = false;
        after = direction === 1;

        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }

          _silent = true;
          setTimeout(_unsilent, 30);
          capture();

          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          } // Undo chrome's scroll adjustment (has no effect on other browsers)


          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }

          parentEl = dragEl.parentNode; // actualization
          // must be done before animation

          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }

          changed();
          return completed(true);
        }
      }

      if (el.contains(dragEl)) {
        return completed(false);
      }
    }

    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, 'mousemove', this._onTouchMove);
    off(document, 'touchmove', this._onTouchMove);
    off(document, 'pointermove', this._onTouchMove);
    off(document, 'dragover', nearestEmptyInsertDetectEvent);
    off(document, 'mousemove', nearestEmptyInsertDetectEvent);
    off(document, 'touchmove', nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._onDrop);
    off(ownerDocument, 'touchend', this._onDrop);
    off(ownerDocument, 'pointerup', this._onDrop);
    off(ownerDocument, 'touchcancel', this._onDrop);
    off(document, 'selectstart', this);
  },
  _onDrop: function _onDrop(
  /**Event*/
  evt) {
    var el = this.el,
        options = this.options; // Get the index of the dragged element within its parent

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent('drop', this, {
      evt: evt
    });
    parentEl = dragEl && dragEl.parentNode; // Get again after plugin event

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);

    if (Sortable.eventCanceled) {
      this._nulling();

      return;
    }

    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);

    _cancelNextTick(this.cloneId);

    _cancelNextTick(this._dragStartId); // Unbind events


    if (this.nativeDraggable) {
      off(document, 'drop', this);
      off(el, 'dragstart', this._onDragStart);
    }

    this._offMoveEvents();

    this._offUpEvents();

    if (Safari) {
      css(document.body, 'user-select', '');
    }

    css(dragEl, 'transform', '');

    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }

      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }

      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, 'dragend', this);
        }

        _disableDraggable(dragEl);

        dragEl.style['will-change'] = ''; // Remove classes
        // ghostClass is added in dragStarted

        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }

        toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event

        _dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });

        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: 'add',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            }); // Remove event


            _dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: parentEl,
              originalEvent: evt
            }); // drag from one list and drop into another


            _dispatchEvent({
              rootEl: parentEl,
              name: 'sort',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });

            _dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: parentEl,
              originalEvent: evt
            });
          }

          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: parentEl,
                originalEvent: evt
              });

              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }

        if (Sortable.active) {
          /* jshint eqnull:true */
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }

          _dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: parentEl,
            originalEvent: evt
          }); // Save sorting


          this.save();
        }
      }
    }

    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent('nulling', this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(
  /**Event*/
  evt) {
    switch (evt.type) {
      case 'drop':
      case 'dragend':
        this._onDrop(evt);

        break;

      case 'dragenter':
      case 'dragover':
        if (dragEl) {
          this._onDragOver(evt);

          _globalDragOver(evt);
        }

        break;

      case 'selectstart':
        evt.preventDefault();
        break;
    }
  },

  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [],
        el,
        children = this.el.children,
        i = 0,
        n = children.length,
        options = this.options;

    for (; i < n; i++) {
      el = children[i];

      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }

    return order;
  },

  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order) {
    var items = {},
        rootEl = this.el;
    this.toArray().forEach(function (id, i) {
      var el = rootEl.children[i];

      if (closest(el, this.options.draggable, rootEl, false)) {
        items[id] = el;
      }
    }, this);
    order.forEach(function (id) {
      if (items[id]) {
        rootEl.removeChild(items[id]);
        rootEl.appendChild(items[id]);
      }
    });
  },

  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },

  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },

  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;

    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);

      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }

      if (name === 'group') {
        _prepareGroup(options);
      }
    }
  },

  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent('destroy', this);
    var el = this.el;
    el[expando] = null;
    off(el, 'mousedown', this._onTapStart);
    off(el, 'touchstart', this._onTapStart);
    off(el, 'pointerdown', this._onTapStart);

    if (this.nativeDraggable) {
      off(el, 'dragover', this);
      off(el, 'dragenter', this);
    } // Remove draggable attributes


    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });

    this._onDrop();

    this._disableDelayedDragEvents();

    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent('hideClone', this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, 'display', 'none');

      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }

      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();

      return;
    }

    if (cloneHidden) {
      pluginEvent('showClone', this);
      if (Sortable.eventCanceled) return; // show clone at dragEl or original position

      if (rootEl.contains(dragEl) && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }

      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }

      css(cloneEl, 'display', '');
      cloneHidden = false;
    }
  }
};

function _globalDragOver(
/**Event*/
evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }

  evt.cancelable && evt.preventDefault();
}

function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
      sortable = fromEl[expando],
      onMoveFn = sortable.options.onMove,
      retVal; // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent('move', {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
  }

  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);

  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }

  return retVal;
}

function _disableDraggable(el) {
  el.draggable = false;
}

function _unsilent() {
  _silent = false;
}

function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}

function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
      targetLength = vertical ? targetRect.height : targetRect.width,
      targetS1 = vertical ? targetRect.top : targetRect.left,
      targetS2 = vertical ? targetRect.bottom : targetRect.right,
      invert = false;

  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }

      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }

  invert = invert || invertSwap;

  if (invert) {
    // Invert of regular
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }

  return 0;
}
/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */


function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */


function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
      i = str.length,
      sum = 0;

  while (i--) {
    sum += str.charCodeAt(i);
  }

  return sum.toString(36);
}

function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;

  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}

function _nextTick(fn) {
  return setTimeout(fn, 0);
}

function _cancelNextTick(id) {
  return clearTimeout(id);
} // Fixed #973:


if (documentExists) {
  on(document, 'touchmove', function (evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
} // Export utils


Sortable.utils = {
  on: on,
  off: off,
  css: css,
  find: find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend,
  throttle: throttle,
  closest: closest,
  toggleClass: toggleClass,
  clone: clone,
  index: index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild: getChild
};
/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */

Sortable.get = function (element) {
  return element[expando];
};
/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */


Sortable.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }

    if (plugin.utils) Sortable.utils = _objectSpread({}, Sortable.utils, plugin.utils);
    PluginManager.mount(plugin);
  });
};
/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */


Sortable.create = function (el, options) {
  return new Sortable(el, options);
}; // Export


Sortable.version = version;

var autoScrolls = [],
    scrollEl,
    scrollRootEl,
    scrolling = false,
    lastAutoScrollX,
    lastAutoScrollY,
    touchEvt$1,
    pointerElemChangedInterval;

function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    }; // Bind all private methods

    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }

  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;

      if (this.sortable.nativeDraggable) {
        on(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          on(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;

      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        off(document, 'dragover', this._handleAutoScroll);
      } else {
        off(document, 'pointermove', this._handleFallbackAutoScroll);
        off(document, 'touchmove', this._handleFallbackAutoScroll);
        off(document, 'mousemove', this._handleFallbackAutoScroll);
      }

      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;

      var x = (evt.touches ? evt.touches[0] : evt).clientX,
          y = (evt.touches ? evt.touches[0] : evt).clientY,
          elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt; // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good

      if (fallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

        var ogElemScroller = getParentAutoScrollElement(elem, true);

        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

          pointerElemChangedInterval = setInterval(function () {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);

            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }

            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }

        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}

function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}

function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}

var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
      y = (evt.touches ? evt.touches[0] : evt).clientY,
      sens = options.scrollSensitivity,
      speed = options.scrollSpeed,
      winScroller = getWindowScrollingElement();
  var scrollThisInstance = false,
      scrollCustomFn; // New scroll root, set scrollEl

  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;

    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }

  var layersOut = 0;
  var currentParent = scrollEl;

  do {
    var el = currentParent,
        rect = getRect(el),
        top = rect.top,
        bottom = rect.bottom,
        left = rect.left,
        right = rect.right,
        width = rect.width,
        height = rect.height,
        canScrollX = void 0,
        canScrollY = void 0,
        scrollWidth = el.scrollWidth,
        scrollHeight = el.scrollHeight,
        elCSS = css(el),
        scrollPosX = el.scrollLeft,
        scrollPosY = el.scrollTop;

    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }

    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }

    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);

      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */

        autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely

          }

          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }

          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }

    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));

  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

var drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      dragEl = _ref.dragEl,
      activeSortable = _ref.activeSortable,
      dispatchSortableEvent = _ref.dispatchSortableEvent,
      hideGhostForTarget = _ref.hideGhostForTarget,
      unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();

  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};

function Revert() {}

Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
        putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();

    if (putSortable) {
      putSortable.captureAnimationState();
    }

    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }

    this.sortable.animateAll();

    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: drop
};

_extends(Revert, {
  pluginName: 'revertOnSpill'
});

function Remove() {}

Remove.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
        putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: drop
};

_extends(Remove, {
  pluginName: 'removeOnSpill'
});

var lastSwapEl;

function SwapPlugin() {
  function Swap() {
    this.defaults = {
      swapClass: 'sortable-swap-highlight'
    };
  }

  Swap.prototype = {
    dragStart: function dragStart(_ref) {
      var dragEl = _ref.dragEl;
      lastSwapEl = dragEl;
    },
    dragOverValid: function dragOverValid(_ref2) {
      var completed = _ref2.completed,
          target = _ref2.target,
          onMove = _ref2.onMove,
          activeSortable = _ref2.activeSortable,
          changed = _ref2.changed,
          cancel = _ref2.cancel;
      if (!activeSortable.options.swap) return;
      var el = this.sortable.el,
          options = this.options;

      if (target && target !== el) {
        var prevSwapEl = lastSwapEl;

        if (onMove(target) !== false) {
          toggleClass(target, options.swapClass, true);
          lastSwapEl = target;
        } else {
          lastSwapEl = null;
        }

        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
          toggleClass(prevSwapEl, options.swapClass, false);
        }
      }

      changed();
      completed(true);
      cancel();
    },
    drop: function drop(_ref3) {
      var activeSortable = _ref3.activeSortable,
          putSortable = _ref3.putSortable,
          dragEl = _ref3.dragEl;
      var toSortable = putSortable || this.sortable;
      var options = this.options;
      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);

      if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
        if (dragEl !== lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
          swapNodes(dragEl, lastSwapEl);
          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
    },
    nulling: function nulling() {
      lastSwapEl = null;
    }
  };
  return _extends(Swap, {
    pluginName: 'swap',
    eventProperties: function eventProperties() {
      return {
        swapItem: lastSwapEl
      };
    }
  });
}

function swapNodes(n1, n2) {
  var p1 = n1.parentNode,
      p2 = n2.parentNode,
      i1,
      i2;
  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
  i1 = index(n1);
  i2 = index(n2);

  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }

  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);
}

var multiDragElements = [],
    multiDragClones = [],
    lastMultiDragSelect,
    // for selection with modifier key down (SHIFT)
multiDragSortable,
    initialFolding = false,
    // Initial multi-drag fold when drag started
folding = false,
    // Folding any other time
dragStarted = false,
    dragEl$1,
    clonesFromRect,
    clonesHidden;

function MultiDragPlugin() {
  function MultiDrag(sortable) {
    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    if (sortable.options.supportPointer) {
      on(document, 'pointerup', this._deselectMultiDrag);
    } else {
      on(document, 'mouseup', this._deselectMultiDrag);
      on(document, 'touchend', this._deselectMultiDrag);
    }

    on(document, 'keydown', this._checkKeyDown);
    on(document, 'keyup', this._checkKeyUp);
    this.defaults = {
      selectedClass: 'sortable-selected',
      multiDragKey: null,
      setData: function setData(dataTransfer, dragEl) {
        var data = '';

        if (multiDragElements.length && multiDragSortable === sortable) {
          multiDragElements.forEach(function (multiDragElement, i) {
            data += (!i ? '' : ', ') + multiDragElement.textContent;
          });
        } else {
          data = dragEl.textContent;
        }

        dataTransfer.setData('Text', data);
      }
    };
  }

  MultiDrag.prototype = {
    multiDragKeyDown: false,
    isMultiDrag: false,
    delayStartGlobal: function delayStartGlobal(_ref) {
      var dragged = _ref.dragEl;
      dragEl$1 = dragged;
    },
    delayEnded: function delayEnded() {
      this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
    },
    setupClone: function setupClone(_ref2) {
      var sortable = _ref2.sortable,
          cancel = _ref2.cancel;
      if (!this.isMultiDrag) return;

      for (var i = 0; i < multiDragElements.length; i++) {
        multiDragClones.push(clone(multiDragElements[i]));
        multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
        multiDragClones[i].draggable = false;
        multiDragClones[i].style['will-change'] = '';
        toggleClass(multiDragClones[i], this.options.selectedClass, false);
        multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
      }

      sortable._hideClone();

      cancel();
    },
    clone: function clone(_ref3) {
      var sortable = _ref3.sortable,
          rootEl = _ref3.rootEl,
          dispatchSortableEvent = _ref3.dispatchSortableEvent,
          cancel = _ref3.cancel;
      if (!this.isMultiDrag) return;

      if (!this.options.removeCloneOnHide) {
        if (multiDragElements.length && multiDragSortable === sortable) {
          insertMultiDragClones(true, rootEl);
          dispatchSortableEvent('clone');
          cancel();
        }
      }
    },
    showClone: function showClone(_ref4) {
      var cloneNowShown = _ref4.cloneNowShown,
          rootEl = _ref4.rootEl,
          cancel = _ref4.cancel;
      if (!this.isMultiDrag) return;
      insertMultiDragClones(false, rootEl);
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', '');
      });
      cloneNowShown();
      clonesHidden = false;
      cancel();
    },
    hideClone: function hideClone(_ref5) {
      var _this = this;

      var sortable = _ref5.sortable,
          cloneNowHidden = _ref5.cloneNowHidden,
          cancel = _ref5.cancel;
      if (!this.isMultiDrag) return;
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', 'none');

        if (_this.options.removeCloneOnHide && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
      cloneNowHidden();
      clonesHidden = true;
      cancel();
    },
    dragStartGlobal: function dragStartGlobal(_ref6) {
      var sortable = _ref6.sortable;

      if (!this.isMultiDrag && multiDragSortable) {
        multiDragSortable.multiDrag._deselectMultiDrag();
      }

      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.sortableIndex = index(multiDragElement);
      }); // Sort multi-drag elements

      multiDragElements = multiDragElements.sort(function (a, b) {
        return a.sortableIndex - b.sortableIndex;
      });
      dragStarted = true;
    },
    dragStarted: function dragStarted(_ref7) {
      var _this2 = this;

      var sortable = _ref7.sortable;
      if (!this.isMultiDrag) return;

      if (this.options.sort) {
        // Capture rects,
        // hide multi drag elements (by positioning them absolute),
        // set multi drag elements rects to dragRect,
        // show multi drag elements,
        // animate to rects,
        // unset rects & remove from DOM
        sortable.captureAnimationState();

        if (this.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            css(multiDragElement, 'position', 'absolute');
          });
          var dragRect = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRect);
          });
          folding = true;
          initialFolding = true;
        }
      }

      sortable.animateAll(function () {
        folding = false;
        initialFolding = false;

        if (_this2.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
        } // Remove all auxiliary multidrag items from el, if sorting enabled


        if (_this2.options.sort) {
          removeMultiDragElements();
        }
      });
    },
    dragOver: function dragOver(_ref8) {
      var target = _ref8.target,
          completed = _ref8.completed,
          cancel = _ref8.cancel;

      if (folding && ~multiDragElements.indexOf(target)) {
        completed(false);
        cancel();
      }
    },
    revert: function revert(_ref9) {
      var fromSortable = _ref9.fromSortable,
          rootEl = _ref9.rootEl,
          sortable = _ref9.sortable,
          dragRect = _ref9.dragRect;

      if (multiDragElements.length > 1) {
        // Setup unfold animation
        multiDragElements.forEach(function (multiDragElement) {
          sortable.addAnimationState({
            target: multiDragElement,
            rect: folding ? getRect(multiDragElement) : dragRect
          });
          unsetRect(multiDragElement);
          multiDragElement.fromRect = dragRect;
          fromSortable.removeAnimationState(multiDragElement);
        });
        folding = false;
        insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref10) {
      var sortable = _ref10.sortable,
          isOwner = _ref10.isOwner,
          insertion = _ref10.insertion,
          activeSortable = _ref10.activeSortable,
          parentEl = _ref10.parentEl,
          putSortable = _ref10.putSortable;
      var options = this.options;

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        }

        initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

        if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
          var dragRectAbsolute = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable

            parentEl.appendChild(multiDragElement);
          });
          folding = true;
        } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


        if (!isOwner) {
          // Only remove if not folding (folding will remove them anyways)
          if (!folding) {
            removeMultiDragElements();
          }

          if (multiDragElements.length > 1) {
            var clonesHiddenBefore = clonesHidden;

            activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


            if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
              multiDragClones.forEach(function (clone) {
                activeSortable.addAnimationState({
                  target: clone,
                  rect: clonesFromRect
                });
                clone.fromRect = clonesFromRect;
                clone.thisAnimationDuration = null;
              });
            }
          } else {
            activeSortable._showClone(sortable);
          }
        }
      }
    },
    dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
      var dragRect = _ref11.dragRect,
          isOwner = _ref11.isOwner,
          activeSortable = _ref11.activeSortable;
      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.thisAnimationDuration = null;
      });

      if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
        clonesFromRect = _extends({}, dragRect);
        var dragMatrix = matrix(dragEl$1, true);
        clonesFromRect.top -= dragMatrix.f;
        clonesFromRect.left -= dragMatrix.e;
      }
    },
    dragOverAnimationComplete: function dragOverAnimationComplete() {
      if (folding) {
        folding = false;
        removeMultiDragElements();
      }
    },
    drop: function drop(_ref12) {
      var evt = _ref12.originalEvent,
          rootEl = _ref12.rootEl,
          parentEl = _ref12.parentEl,
          sortable = _ref12.sortable,
          dispatchSortableEvent = _ref12.dispatchSortableEvent,
          oldIndex = _ref12.oldIndex,
          putSortable = _ref12.putSortable;
      var toSortable = putSortable || this.sortable;
      if (!evt) return;
      var options = this.options,
          children = parentEl.children; // Multi-drag selection

      if (!dragStarted) {
        if (options.multiDragKey && !this.multiDragKeyDown) {
          this._deselectMultiDrag();
        }

        toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));

        if (!~multiDragElements.indexOf(dragEl$1)) {
          multiDragElements.push(dragEl$1);
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'select',
            targetEl: dragEl$1,
            originalEvt: evt
          }); // Modifier activated, select from last to dragEl

          if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
            var lastIndex = index(lastMultiDragSelect),
                currentIndex = index(dragEl$1);

            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
              // Must include lastMultiDragSelect (select it), in case modified selection from no selection
              // (but previous selection existed)
              var n, i;

              if (currentIndex > lastIndex) {
                i = lastIndex;
                n = currentIndex;
              } else {
                i = currentIndex;
                n = lastIndex + 1;
              }

              for (; i < n; i++) {
                if (~multiDragElements.indexOf(children[i])) continue;
                toggleClass(children[i], options.selectedClass, true);
                multiDragElements.push(children[i]);
                dispatchEvent({
                  sortable: sortable,
                  rootEl: rootEl,
                  name: 'select',
                  targetEl: children[i],
                  originalEvt: evt
                });
              }
            }
          } else {
            lastMultiDragSelect = dragEl$1;
          }

          multiDragSortable = toSortable;
        } else {
          multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
          lastMultiDragSelect = null;
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'deselect',
            targetEl: dragEl$1,
            originalEvt: evt
          });
        }
      } // Multi-drag drop


      if (dragStarted && this.isMultiDrag) {
        // Do not "unfold" after around dragEl if reverted
        if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
          var dragRect = getRect(dragEl$1),
              multiDragIndex = index(dragEl$1, ':not(.' + this.options.selectedClass + ')');
          if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
          toSortable.captureAnimationState();

          if (!initialFolding) {
            if (options.animation) {
              dragEl$1.fromRect = dragRect;
              multiDragElements.forEach(function (multiDragElement) {
                multiDragElement.thisAnimationDuration = null;

                if (multiDragElement !== dragEl$1) {
                  var rect = folding ? getRect(multiDragElement) : dragRect;
                  multiDragElement.fromRect = rect; // Prepare unfold animation

                  toSortable.addAnimationState({
                    target: multiDragElement,
                    rect: rect
                  });
                }
              });
            } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
            // properly they must all be removed


            removeMultiDragElements();
            multiDragElements.forEach(function (multiDragElement) {
              if (children[multiDragIndex]) {
                parentEl.insertBefore(multiDragElement, children[multiDragIndex]);
              } else {
                parentEl.appendChild(multiDragElement);
              }

              multiDragIndex++;
            }); // If initial folding is done, the elements may have changed position because they are now
            // unfolding around dragEl, even though dragEl may not have his index changed, so update event
            // must be fired here as Sortable will not.

            if (oldIndex === index(dragEl$1)) {
              var update = false;
              multiDragElements.forEach(function (multiDragElement) {
                if (multiDragElement.sortableIndex !== index(multiDragElement)) {
                  update = true;
                  return;
                }
              });

              if (update) {
                dispatchSortableEvent('update');
              }
            }
          } // Must be done after capturing individual rects (scroll bar)


          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
          toSortable.animateAll();
        }

        multiDragSortable = toSortable;
      } // Remove clones if necessary


      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        multiDragClones.forEach(function (clone) {
          clone.parentNode && clone.parentNode.removeChild(clone);
        });
      }
    },
    nullingGlobal: function nullingGlobal() {
      this.isMultiDrag = dragStarted = false;
      multiDragClones.length = 0;
    },
    destroyGlobal: function destroyGlobal() {
      this._deselectMultiDrag();

      off(document, 'pointerup', this._deselectMultiDrag);
      off(document, 'mouseup', this._deselectMultiDrag);
      off(document, 'touchend', this._deselectMultiDrag);
      off(document, 'keydown', this._checkKeyDown);
      off(document, 'keyup', this._checkKeyUp);
    },
    _deselectMultiDrag: function _deselectMultiDrag(evt) {
      if (typeof dragStarted !== "undefined" && dragStarted) return; // Only deselect if selection is in this sortable

      if (multiDragSortable !== this.sortable) return; // Only deselect if target is not item in this sortable

      if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

      if (evt && evt.button !== 0) return;

      while (multiDragElements.length) {
        var el = multiDragElements[0];
        toggleClass(el, this.options.selectedClass, false);
        multiDragElements.shift();
        dispatchEvent({
          sortable: this.sortable,
          rootEl: this.sortable.el,
          name: 'deselect',
          targetEl: el,
          originalEvt: evt
        });
      }
    },
    _checkKeyDown: function _checkKeyDown(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = true;
      }
    },
    _checkKeyUp: function _checkKeyUp(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = false;
      }
    }
  };
  return _extends(MultiDrag, {
    // Static methods & properties
    pluginName: 'multiDrag',
    utils: {
      /**
       * Selects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be selected
       */
      select: function select(el) {
        var sortable = el.parentNode[expando];
        if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

        if (multiDragSortable && multiDragSortable !== sortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();

          multiDragSortable = sortable;
        }

        toggleClass(el, sortable.options.selectedClass, true);
        multiDragElements.push(el);
      },

      /**
       * Deselects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be deselected
       */
      deselect: function deselect(el) {
        var sortable = el.parentNode[expando],
            index = multiDragElements.indexOf(el);
        if (!sortable || !sortable.options.multiDrag || !~index) return;
        toggleClass(el, sortable.options.selectedClass, false);
        multiDragElements.splice(index, 1);
      }
    },
    eventProperties: function eventProperties() {
      var _this3 = this;

      var oldIndicies = [],
          newIndicies = [];
      multiDragElements.forEach(function (multiDragElement) {
        oldIndicies.push({
          multiDragElement: multiDragElement,
          index: multiDragElement.sortableIndex
        }); // multiDragElements will already be sorted if folding

        var newIndex;

        if (folding && multiDragElement !== dragEl$1) {
          newIndex = -1;
        } else if (folding) {
          newIndex = index(multiDragElement, ':not(.' + _this3.options.selectedClass + ')');
        } else {
          newIndex = index(multiDragElement);
        }

        newIndicies.push({
          multiDragElement: multiDragElement,
          index: newIndex
        });
      });
      return {
        items: _toConsumableArray(multiDragElements),
        clones: [].concat(multiDragClones),
        oldIndicies: oldIndicies,
        newIndicies: newIndicies
      };
    },
    optionListeners: {
      multiDragKey: function multiDragKey(key) {
        key = key.toLowerCase();

        if (key === 'ctrl') {
          key = 'Control';
        } else if (key.length > 1) {
          key = key.charAt(0).toUpperCase() + key.substr(1);
        }

        return key;
      }
    }
  });
}

function insertMultiDragElements(clonesInserted, rootEl) {
  multiDragElements.forEach(function (multiDragElement, i) {
    var target = rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(multiDragElement, target);
    } else {
      rootEl.appendChild(multiDragElement);
    }
  });
}
/**
 * Insert multi-drag clones
 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
 * @param  {HTMLElement} rootEl
 */


function insertMultiDragClones(elementsInserted, rootEl) {
  multiDragClones.forEach(function (clone, i) {
    var target = rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(clone, target);
    } else {
      rootEl.appendChild(clone);
    }
  });
}

function removeMultiDragElements() {
  multiDragElements.forEach(function (multiDragElement) {
    if (multiDragElement === dragEl$1) return;
    multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
  });
}

Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

/* harmony default export */ __webpack_exports__["default"] = (Sortable);


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
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


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYS1wb3NzaWJsZS1wcm90b3R5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FuLWluc3RhbmNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1tZXRob2QtaGFzLXNwZWNpZXMtc3VwcG9ydC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2FsbC13aXRoLXNhZmUtaXRlcmF0aW9uLWNsb3NpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NoZWNrLWNvcnJlY3RuZXNzLW9mLWl0ZXJhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY29sbGVjdGlvbi13ZWFrLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb2xsZWN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb3JyZWN0LXByb3RvdHlwZS1nZXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1pdGVyYXRvci1jb25zdHJ1Y3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZWZpbmUtaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvbS1pdGVyYWJsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VuZ2luZS1pcy1pb3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZnJlZXppbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1pdGVyYXRvci1tZXRob2QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hvc3QtcmVwb3J0LWVycm9ycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW5oZXJpdC1pZi1yZXF1aXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW50ZXJuYWwtbWV0YWRhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3JzLWNvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2l0ZXJhdG9ycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbWljcm90YXNrLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9uYXRpdmUtcHJvbWlzZS1jb25zdHJ1Y3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmV3LXByb21pc2UtY2FwYWJpbGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1wcm90b3R5cGUtb2YuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1zZXQtcHJvdG90eXBlLW9mLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtdG8tc3RyaW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9wZXJmb3JtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9wcm9taXNlLXJlc29sdmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZGVmaW5lLWFsbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LXNwZWNpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NldC10by1zdHJpbmctdGFnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zdHJpbmctbXVsdGlieXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90YXNrLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1zdHJpbmctdGFnLXN1cHBvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5jb25jYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmpvaW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMub2JqZWN0LnRvLXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnByb21pc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy53ZWFrLXNldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20tY29sbGVjdGlvbnMuaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Ryb3B6b25lL2Rpc3QvZHJvcHpvbmUuY3NzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kcm9wem9uZS9kaXN0L2Ryb3B6b25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zb3J0YWJsZWpzL21vZHVsYXIvc29ydGFibGUuZXNtLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsZUFBZSxtQkFBTyxDQUFDLDZFQUF3Qjs7QUFFL0M7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7OztBQ0pBLFlBQVksbUJBQU8sQ0FBQyxxRUFBb0I7QUFDeEMsc0JBQXNCLG1CQUFPLENBQUMsNkZBQWdDO0FBQzlELGlCQUFpQixtQkFBTyxDQUFDLDZGQUFnQzs7QUFFekQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7O0FDbEJhO0FBQ2IsWUFBWSxtQkFBTyxDQUFDLHFFQUFvQjs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsU0FBUyxFQUFFO0FBQzFELEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7O0FDVEEsZUFBZSxtQkFBTyxDQUFDLDZFQUF3Qjs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNaQSxzQkFBc0IsbUJBQU8sQ0FBQyw2RkFBZ0M7O0FBRTlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsU0FBUyxFQUFFO0FBQ3pELENBQUMsZ0JBQWdCOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRyxnQkFBZ0I7QUFDbkI7QUFDQTs7Ozs7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Q0EsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUcsZUFBZTtBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCw2QkFBNkIsY0FBYztBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7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O0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwRkFBMEYsYUFBYTtBQUN2RztBQUNBOztBQUVBLGtJQUFrSTtBQUNsSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLHNCQUFzQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLEVBQUU7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHNDQUFzQztBQUNuRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsVUFBVSxTQUFTLGFBQWE7QUFDOUM7QUFDQSw0Q0FBNEMsVUFBVSxzQkFBc0IsYUFBYTs7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Q0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsMElBQTBJO0FBQzFJOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsS0FBSztBQUNoQjtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxLQUFLO0FBQ2Q7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVKQUF1SjtBQUN2Sjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQSwwSUFBMEk7QUFDMUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLCtCQUErQjtBQUMvQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGlDQUFpQztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCw4SUFBOEk7QUFDOUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0SUFBNEk7QUFDNUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7O0FBRUE7O0FBRUEsNElBQTRJO0FBQzVJOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNElBQTRJO0FBQzVJOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBLDBJQUEwSTtBQUMxSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsMkZBQTJGLFlBQVk7QUFDdkc7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsMElBQTBJO0FBQzFJOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQSwwSUFBMEk7QUFDMUk7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtJQUErSTtBQUMvSTs7QUFFQTtBQUNBO0FBQ0E7QUFD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Q0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0EsMkVBQTJFO0FBQzNFO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGlFQUFpRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3o4R0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLHVCQUF1QjtBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxlQUFlLDZCQUE2QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlEQUFpRCxnQkFBZ0I7O0FBRWpFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCOztBQUU5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLFlBQVksWUFBWTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksWUFBWTtBQUN4QixZQUFZLE9BQU87QUFDbkI7OztBQUdBO0FBQ0E7QUFDQSxpRUFBaUU7QUFDakU7O0FBRUEsZUFBZTs7QUFFZixzQ0FBc0MsV0FBVzs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDs7QUFFdEQ7QUFDQTtBQUNBOztBQUVBLHlCQUF5Qjs7O0FBR3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCOztBQUUxQixpRkFBaUY7O0FBRWpGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0I7OztBQUcvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhO0FBQ2IsS0FBSzs7O0FBR0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBLHlEQUF5RDs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsZUFBZTtBQUNmO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVg7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7OztBQUdMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7OztBQUdBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVCw0Q0FBNEM7OztBQUc1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsRUFBRTs7O0FBR1g7QUFDQSxRQUFROzs7QUFHUjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7O0FBRXREO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPLEVBQUU7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUM7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnTUFBZ007O0FBRWhNO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMLDhEQUE4RDs7QUFFOUQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDQUFrQzs7QUFFbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7O0FBR0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUzs7O0FBR1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7QUFHUDtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQSxnRUFBZ0U7OztBQUdoRTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCOztBQUUxQjs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUzs7O0FBR1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXOzs7QUFHWDtBQUNBO0FBQ0E7O0FBRUEsdUNBQXVDO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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LEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQiw4QkFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU8sRUFBRTs7QUFFVDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUzs7O0FBR1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtB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QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsWUFBWSxVQUFVO0FBQ3RCLFlBQVksWUFBWTtBQUN4Qjs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVlLHVFQUFRLEVBQUM7QUFDOEM7Ozs7Ozs7Ozs7Ozs7QUNsbkh0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidmVuZG9yc35hZG1pbl9hcnRpY2xlX2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpICYmIGl0ICE9PSBudWxsKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3Qgc2V0IFwiICsgU3RyaW5nKGl0KSArICcgYXMgYSBwcm90b3R5cGUnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lKSB7XG4gIGlmICghKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbmNvcnJlY3QgJyArIChuYW1lID8gbmFtZSArICcgJyA6ICcnKSArICdpbnZvY2F0aW9uJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcblxudmFyIFNQRUNJRVMgPSB3ZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgLy8gV2UgY2FuJ3QgdXNlIHRoaXMgZmVhdHVyZSBkZXRlY3Rpb24gaW4gVjggc2luY2UgaXQgY2F1c2VzXG4gIC8vIGRlb3B0aW1pemF0aW9uIGFuZCBzZXJpb3VzIHBlcmZvcm1hbmNlIGRlZ3JhZGF0aW9uXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy82NzdcbiAgcmV0dXJuIFY4X1ZFUlNJT04gPj0gNTEgfHwgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBhcnJheS5jb25zdHJ1Y3RvciA9IHt9O1xuICAgIGNvbnN0cnVjdG9yW1NQRUNJRVNdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHsgZm9vOiAxIH07XG4gICAgfTtcbiAgICByZXR1cm4gYXJyYXlbTUVUSE9EX05BTUVdKEJvb2xlYW4pLmZvbyAhPT0gMTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBhcmd1bWVudCkge1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICByZXR1cm4gISFtZXRob2QgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGwsbm8tdGhyb3ctbGl0ZXJhbFxuICAgIG1ldGhvZC5jYWxsKG51bGwsIGFyZ3VtZW50IHx8IGZ1bmN0aW9uICgpIHsgdGhyb3cgMTsgfSwgMSk7XG4gIH0pO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcblxuLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgRU5UUklFUykge1xuICB0cnkge1xuICAgIHJldHVybiBFTlRSSUVTID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdmFyIHJldHVybk1ldGhvZCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0dXJuTWV0aG9kICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldHVybk1ldGhvZC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG4iLCJ2YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIGNhbGxlZCA9IDA7XG4gIHZhciBpdGVyYXRvcldpdGhSZXR1cm4gPSB7XG4gICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHsgZG9uZTogISFjYWxsZWQrKyB9O1xuICAgIH0sXG4gICAgJ3JldHVybic6IGZ1bmN0aW9uICgpIHtcbiAgICAgIFNBRkVfQ0xPU0lORyA9IHRydWU7XG4gICAgfVxuICB9O1xuICBpdGVyYXRvcldpdGhSZXR1cm5bSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKGl0ZXJhdG9yV2l0aFJldHVybiwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgU0tJUF9DTE9TSU5HKSB7XG4gIGlmICghU0tJUF9DTE9TSU5HICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIElURVJBVElPTl9TVVBQT1JUID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIG9iamVjdCA9IHt9O1xuICAgIG9iamVjdFtJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHsgZG9uZTogSVRFUkFUSU9OX1NVUFBPUlQgPSB0cnVlIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgICBleGVjKG9iamVjdCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIElURVJBVElPTl9TVVBQT1JUO1xufTtcbiIsInZhciBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0Jyk7XG52YXIgY2xhc3NvZlJhdyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgVE9fU1RSSU5HX1RBRyA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQ09SUkVDVF9BUkdVTUVOVFMgPSBjbGFzc29mUmF3KGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG4vLyBnZXR0aW5nIHRhZyBmcm9tIEVTNisgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgXG5tb2R1bGUuZXhwb3J0cyA9IFRPX1NUUklOR19UQUdfU1VQUE9SVCA/IGNsYXNzb2ZSYXcgOiBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIHRhZywgcmVzdWx0O1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAodGFnID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUT19TVFJJTkdfVEFHKSkgPT0gJ3N0cmluZycgPyB0YWdcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IENPUlJFQ1RfQVJHVU1FTlRTID8gY2xhc3NvZlJhdyhPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChyZXN1bHQgPSBjbGFzc29mUmF3KE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWRlZmluZS1hbGwnKTtcbnZhciBnZXRXZWFrRGF0YSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1tZXRhZGF0YScpLmdldFdlYWtEYXRhO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4taW5zdGFuY2UnKTtcbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdGUnKTtcbnZhciBBcnJheUl0ZXJhdGlvbk1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pdGVyYXRpb24nKTtcbnZhciAkaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIEludGVybmFsU3RhdGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUnKTtcblxudmFyIHNldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLnNldDtcbnZhciBpbnRlcm5hbFN0YXRlR2V0dGVyRm9yID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5nZXR0ZXJGb3I7XG52YXIgZmluZCA9IEFycmF5SXRlcmF0aW9uTW9kdWxlLmZpbmQ7XG52YXIgZmluZEluZGV4ID0gQXJyYXlJdGVyYXRpb25Nb2R1bGUuZmluZEluZGV4O1xudmFyIGlkID0gMDtcblxuLy8gZmFsbGJhY2sgZm9yIHVuY2F1Z2h0IGZyb3plbiBrZXlzXG52YXIgdW5jYXVnaHRGcm96ZW5TdG9yZSA9IGZ1bmN0aW9uIChzdG9yZSkge1xuICByZXR1cm4gc3RvcmUuZnJvemVuIHx8IChzdG9yZS5mcm96ZW4gPSBuZXcgVW5jYXVnaHRGcm96ZW5TdG9yZSgpKTtcbn07XG5cbnZhciBVbmNhdWdodEZyb3plblN0b3JlID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmVudHJpZXMgPSBbXTtcbn07XG5cbnZhciBmaW5kVW5jYXVnaHRGcm96ZW4gPSBmdW5jdGlvbiAoc3RvcmUsIGtleSkge1xuICByZXR1cm4gZmluZChzdG9yZS5lbnRyaWVzLCBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcbiAgfSk7XG59O1xuXG5VbmNhdWdodEZyb3plblN0b3JlLnByb3RvdHlwZSA9IHtcbiAgZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGVudHJ5ID0gZmluZFVuY2F1Z2h0RnJvemVuKHRoaXMsIGtleSk7XG4gICAgaWYgKGVudHJ5KSByZXR1cm4gZW50cnlbMV07XG4gIH0sXG4gIGhhczogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiAhIWZpbmRVbmNhdWdodEZyb3plbih0aGlzLCBrZXkpO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgdmFyIGVudHJ5ID0gZmluZFVuY2F1Z2h0RnJvemVuKHRoaXMsIGtleSk7XG4gICAgaWYgKGVudHJ5KSBlbnRyeVsxXSA9IHZhbHVlO1xuICAgIGVsc2UgdGhpcy5lbnRyaWVzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSxcbiAgJ2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgodGhpcy5lbnRyaWVzLCBmdW5jdGlvbiAoaXQpIHtcbiAgICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xuICAgIH0pO1xuICAgIGlmICh+aW5kZXgpIHRoaXMuZW50cmllcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiAhIX5pbmRleDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgQ09OU1RSVUNUT1JfTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgQ09OU1RSVUNUT1JfTkFNRSk7XG4gICAgICBzZXRJbnRlcm5hbFN0YXRlKHRoYXQsIHtcbiAgICAgICAgdHlwZTogQ09OU1RSVUNUT1JfTkFNRSxcbiAgICAgICAgaWQ6IGlkKyssXG4gICAgICAgIGZyb3plbjogdW5kZWZpbmVkXG4gICAgICB9KTtcbiAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGl0ZXJhdGUoaXRlcmFibGUsIHRoYXRbQURERVJdLCB0aGF0LCBJU19NQVApO1xuICAgIH0pO1xuXG4gICAgdmFyIGdldEludGVybmFsU3RhdGUgPSBpbnRlcm5hbFN0YXRlR2V0dGVyRm9yKENPTlNUUlVDVE9SX05BTUUpO1xuXG4gICAgdmFyIGRlZmluZSA9IGZ1bmN0aW9uICh0aGF0LCBrZXksIHZhbHVlKSB7XG4gICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoYXQpO1xuICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrRGF0YShhbk9iamVjdChrZXkpLCB0cnVlKTtcbiAgICAgIGlmIChkYXRhID09PSB0cnVlKSB1bmNhdWdodEZyb3plblN0b3JlKHN0YXRlKS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICBlbHNlIGRhdGFbc3RhdGUuaWRdID0gdmFsdWU7XG4gICAgICByZXR1cm4gdGhhdDtcbiAgICB9O1xuXG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjMuMy4yIFdlYWtNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy40LjMuMyBXZWFrU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpO1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGtleSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrRGF0YShrZXkpO1xuICAgICAgICBpZiAoZGF0YSA9PT0gdHJ1ZSkgcmV0dXJuIHVuY2F1Z2h0RnJvemVuU3RvcmUoc3RhdGUpWydkZWxldGUnXShrZXkpO1xuICAgICAgICByZXR1cm4gZGF0YSAmJiAkaGFzKGRhdGEsIHN0YXRlLmlkKSAmJiBkZWxldGUgZGF0YVtzdGF0ZS5pZF07XG4gICAgICB9LFxuICAgICAgLy8gMjMuMy4zLjQgV2Vha01hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjQuMy40IFdlYWtTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpO1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGtleSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrRGF0YShrZXkpO1xuICAgICAgICBpZiAoZGF0YSA9PT0gdHJ1ZSkgcmV0dXJuIHVuY2F1Z2h0RnJvemVuU3RvcmUoc3RhdGUpLmhhcyhrZXkpO1xuICAgICAgICByZXR1cm4gZGF0YSAmJiAkaGFzKGRhdGEsIHN0YXRlLmlkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBJU19NQVAgPyB7XG4gICAgICAvLyAyMy4zLjMuMyBXZWFrTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhpcyk7XG4gICAgICAgIGlmIChpc09iamVjdChrZXkpKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSBnZXRXZWFrRGF0YShrZXkpO1xuICAgICAgICAgIGlmIChkYXRhID09PSB0cnVlKSByZXR1cm4gdW5jYXVnaHRGcm96ZW5TdG9yZShzdGF0ZSkuZ2V0KGtleSk7XG4gICAgICAgICAgcmV0dXJuIGRhdGEgPyBkYXRhW3N0YXRlLmlkXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjMuMy41IFdlYWtNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICAgICAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZGVmaW5lKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0gOiB7XG4gICAgICAvLyAyMy40LjMuMSBXZWFrU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gICAgICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZGVmaW5lKHRoaXMsIHZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBDO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzRm9yY2VkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgSW50ZXJuYWxNZXRhZGF0YU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1tZXRhZGF0YScpO1xudmFyIGl0ZXJhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0ZScpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4taW5zdGFuY2UnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNoZWNrQ29ycmVjdG5lc3NPZkl0ZXJhdGlvbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jaGVjay1jb3JyZWN0bmVzcy1vZi1pdGVyYXRpb24nKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGluaGVyaXRJZlJlcXVpcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ09OU1RSVUNUT1JfTkFNRSwgd3JhcHBlciwgY29tbW9uKSB7XG4gIHZhciBJU19NQVAgPSBDT05TVFJVQ1RPUl9OQU1FLmluZGV4T2YoJ01hcCcpICE9PSAtMTtcbiAgdmFyIElTX1dFQUsgPSBDT05TVFJVQ1RPUl9OQU1FLmluZGV4T2YoJ1dlYWsnKSAhPT0gLTE7XG4gIHZhciBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCc7XG4gIHZhciBOYXRpdmVDb25zdHJ1Y3RvciA9IGdsb2JhbFtDT05TVFJVQ1RPUl9OQU1FXTtcbiAgdmFyIE5hdGl2ZVByb3RvdHlwZSA9IE5hdGl2ZUNvbnN0cnVjdG9yICYmIE5hdGl2ZUNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgdmFyIENvbnN0cnVjdG9yID0gTmF0aXZlQ29uc3RydWN0b3I7XG4gIHZhciBleHBvcnRlZCA9IHt9O1xuXG4gIHZhciBmaXhNZXRob2QgPSBmdW5jdGlvbiAoS0VZKSB7XG4gICAgdmFyIG5hdGl2ZU1ldGhvZCA9IE5hdGl2ZVByb3RvdHlwZVtLRVldO1xuICAgIHJlZGVmaW5lKE5hdGl2ZVByb3RvdHlwZSwgS0VZLFxuICAgICAgS0VZID09ICdhZGQnID8gZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgICAgIG5hdGl2ZU1ldGhvZC5jYWxsKHRoaXMsIHZhbHVlID09PSAwID8gMCA6IHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IDogS0VZID09ICdkZWxldGUnID8gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3Qoa2V5KSA/IGZhbHNlIDogbmF0aXZlTWV0aG9kLmNhbGwodGhpcywga2V5ID09PSAwID8gMCA6IGtleSk7XG4gICAgICB9IDogS0VZID09ICdnZXQnID8gZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3Qoa2V5KSA/IHVuZGVmaW5lZCA6IG5hdGl2ZU1ldGhvZC5jYWxsKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXkpO1xuICAgICAgfSA6IEtFWSA9PSAnaGFzJyA/IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGtleSkgPyBmYWxzZSA6IG5hdGl2ZU1ldGhvZC5jYWxsKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXkpO1xuICAgICAgfSA6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIG5hdGl2ZU1ldGhvZC5jYWxsKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICBpZiAoaXNGb3JjZWQoQ09OU1RSVUNUT1JfTkFNRSwgdHlwZW9mIE5hdGl2ZUNvbnN0cnVjdG9yICE9ICdmdW5jdGlvbicgfHwgIShJU19XRUFLIHx8IE5hdGl2ZVByb3RvdHlwZS5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgbmV3IE5hdGl2ZUNvbnN0cnVjdG9yKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKSkge1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQ29uc3RydWN0b3IgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgQ09OU1RSVUNUT1JfTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgSW50ZXJuYWxNZXRhZGF0YU1vZHVsZS5SRVFVSVJFRCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoaXNGb3JjZWQoQ09OU1RSVUNUT1JfTkFNRSwgdHJ1ZSkpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTtcbiAgICAvLyBlYXJseSBpbXBsZW1lbnRhdGlvbnMgbm90IHN1cHBvcnRzIGNoYWluaW5nXG4gICAgdmFyIEhBU05UX0NIQUlOSU5HID0gaW5zdGFuY2VbQURERVJdKElTX1dFQUsgPyB7fSA6IC0wLCAxKSAhPSBpbnN0YW5jZTtcbiAgICAvLyBWOCB+IENocm9taXVtIDQwLSB3ZWFrLWNvbGxlY3Rpb25zIHRocm93cyBvbiBwcmltaXRpdmVzLCBidXQgc2hvdWxkIHJldHVybiBmYWxzZVxuICAgIHZhciBUSFJPV1NfT05fUFJJTUlUSVZFUyA9IGZhaWxzKGZ1bmN0aW9uICgpIHsgaW5zdGFuY2UuaGFzKDEpOyB9KTtcbiAgICAvLyBtb3N0IGVhcmx5IGltcGxlbWVudGF0aW9ucyBkb2Vzbid0IHN1cHBvcnRzIGl0ZXJhYmxlcywgbW9zdCBtb2Rlcm4gLSBub3QgY2xvc2UgaXQgY29ycmVjdGx5XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ld1xuICAgIHZhciBBQ0NFUFRfSVRFUkFCTEVTID0gY2hlY2tDb3JyZWN0bmVzc09mSXRlcmF0aW9uKGZ1bmN0aW9uIChpdGVyYWJsZSkgeyBuZXcgTmF0aXZlQ29uc3RydWN0b3IoaXRlcmFibGUpOyB9KTtcbiAgICAvLyBmb3IgZWFybHkgaW1wbGVtZW50YXRpb25zIC0wIGFuZCArMCBub3QgdGhlIHNhbWVcbiAgICB2YXIgQlVHR1lfWkVSTyA9ICFJU19XRUFLICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFY4IH4gQ2hyb21pdW0gNDItIGZhaWxzIG9ubHkgd2l0aCA1KyBlbGVtZW50c1xuICAgICAgdmFyICRpbnN0YW5jZSA9IG5ldyBOYXRpdmVDb25zdHJ1Y3RvcigpO1xuICAgICAgdmFyIGluZGV4ID0gNTtcbiAgICAgIHdoaWxlIChpbmRleC0tKSAkaW5zdGFuY2VbQURERVJdKGluZGV4LCBpbmRleCk7XG4gICAgICByZXR1cm4gISRpbnN0YW5jZS5oYXMoLTApO1xuICAgIH0pO1xuXG4gICAgaWYgKCFBQ0NFUFRfSVRFUkFCTEVTKSB7XG4gICAgICBDb25zdHJ1Y3RvciA9IHdyYXBwZXIoZnVuY3Rpb24gKGR1bW15LCBpdGVyYWJsZSkge1xuICAgICAgICBhbkluc3RhbmNlKGR1bW15LCBDb25zdHJ1Y3RvciwgQ09OU1RSVUNUT1JfTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gaW5oZXJpdElmUmVxdWlyZWQobmV3IE5hdGl2ZUNvbnN0cnVjdG9yKCksIGR1bW15LCBDb25zdHJ1Y3Rvcik7XG4gICAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGl0ZXJhdGUoaXRlcmFibGUsIHRoYXRbQURERVJdLCB0aGF0LCBJU19NQVApO1xuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH0pO1xuICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gTmF0aXZlUHJvdG90eXBlO1xuICAgICAgTmF0aXZlUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gICAgfVxuXG4gICAgaWYgKFRIUk9XU19PTl9QUklNSVRJVkVTIHx8IEJVR0dZX1pFUk8pIHtcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XG4gICAgfVxuXG4gICAgaWYgKEJVR0dZX1pFUk8gfHwgSEFTTlRfQ0hBSU5JTkcpIGZpeE1ldGhvZChBRERFUik7XG5cbiAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIHNob3VsZCBub3QgY29udGFpbnMgLmNsZWFyIG1ldGhvZFxuICAgIGlmIChJU19XRUFLICYmIE5hdGl2ZVByb3RvdHlwZS5jbGVhcikgZGVsZXRlIE5hdGl2ZVByb3RvdHlwZS5jbGVhcjtcbiAgfVxuXG4gIGV4cG9ydGVkW0NPTlNUUlVDVE9SX05BTUVdID0gQ29uc3RydWN0b3I7XG4gICQoeyBnbG9iYWw6IHRydWUsIGZvcmNlZDogQ29uc3RydWN0b3IgIT0gTmF0aXZlQ29uc3RydWN0b3IgfSwgZXhwb3J0ZWQpO1xuXG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBDT05TVFJVQ1RPUl9OQU1FKTtcblxuICBpZiAoIUlTX1dFQUspIGNvbW1vbi5zZXRTdHJvbmcoQ29uc3RydWN0b3IsIENPTlNUUlVDVE9SX05BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEYoKSB7IC8qIGVtcHR5ICovIH1cbiAgRi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBudWxsO1xuICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKG5ldyBGKCkpICE9PSBGLnByb3RvdHlwZTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9ycy1jb3JlJykuSXRlcmF0b3JQcm90b3R5cGU7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1jcmVhdGUnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvcnMnKTtcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJdGVyYXRvckNvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIHZhciBUT19TVFJJTkdfVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICBJdGVyYXRvckNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yQ29uc3RydWN0b3IsIFRPX1NUUklOR19UQUcsIGZhbHNlLCB0cnVlKTtcbiAgSXRlcmF0b3JzW1RPX1NUUklOR19UQUddID0gcmV0dXJuVGhpcztcbiAgcmV0dXJuIEl0ZXJhdG9yQ29uc3RydWN0b3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByaW1pdGl2ZScpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBwcm9wZXJ0eUtleSA9IHRvUHJpbWl0aXZlKGtleSk7XG4gIGlmIChwcm9wZXJ0eUtleSBpbiBvYmplY3QpIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBwcm9wZXJ0eUtleSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W3Byb3BlcnR5S2V5XSA9IHZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGNyZWF0ZUl0ZXJhdG9yQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLWl0ZXJhdG9yLWNvbnN0cnVjdG9yJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1wcm90b3R5cGUtb2YnKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qtc2V0LXByb3RvdHlwZS1vZicpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgSVNfUFVSRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1wdXJlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9ycycpO1xudmFyIEl0ZXJhdG9yc0NvcmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzLWNvcmUnKTtcblxudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gSXRlcmF0b3JzQ29yZS5JdGVyYXRvclByb3RvdHlwZTtcbnZhciBCVUdHWV9TQUZBUklfSVRFUkFUT1JTID0gSXRlcmF0b3JzQ29yZS5CVUdHWV9TQUZBUklfSVRFUkFUT1JTO1xudmFyIElURVJBVE9SID0gd2VsbEtub3duU3ltYm9sKCdpdGVyYXRvcicpO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG52YXIgRU5UUklFUyA9ICdlbnRyaWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJdGVyYWJsZSwgTkFNRSwgSXRlcmF0b3JDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgY3JlYXRlSXRlcmF0b3JDb25zdHJ1Y3RvcihJdGVyYXRvckNvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcblxuICB2YXIgZ2V0SXRlcmF0aW9uTWV0aG9kID0gZnVuY3Rpb24gKEtJTkQpIHtcbiAgICBpZiAoS0lORCA9PT0gREVGQVVMVCAmJiBkZWZhdWx0SXRlcmF0b3IpIHJldHVybiBkZWZhdWx0SXRlcmF0b3I7XG4gICAgaWYgKCFCVUdHWV9TQUZBUklfSVRFUkFUT1JTICYmIEtJTkQgaW4gSXRlcmFibGVQcm90b3R5cGUpIHJldHVybiBJdGVyYWJsZVByb3RvdHlwZVtLSU5EXTtcbiAgICBzd2l0Y2ggKEtJTkQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgSXRlcmF0b3JDb25zdHJ1Y3Rvcih0aGlzLCBLSU5EKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IEl0ZXJhdG9yQ29uc3RydWN0b3IodGhpcywgS0lORCk7IH07XG4gICAgICBjYXNlIEVOVFJJRVM6IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IEl0ZXJhdG9yQ29uc3RydWN0b3IodGhpcywgS0lORCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEl0ZXJhdG9yQ29uc3RydWN0b3IodGhpcyk7IH07XG4gIH07XG5cbiAgdmFyIFRPX1NUUklOR19UQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBJTkNPUlJFQ1RfVkFMVUVTX05BTUUgPSBmYWxzZTtcbiAgdmFyIEl0ZXJhYmxlUHJvdG90eXBlID0gSXRlcmFibGUucHJvdG90eXBlO1xuICB2YXIgbmF0aXZlSXRlcmF0b3IgPSBJdGVyYWJsZVByb3RvdHlwZVtJVEVSQVRPUl1cbiAgICB8fCBJdGVyYWJsZVByb3RvdHlwZVsnQEBpdGVyYXRvciddXG4gICAgfHwgREVGQVVMVCAmJiBJdGVyYWJsZVByb3RvdHlwZVtERUZBVUxUXTtcbiAgdmFyIGRlZmF1bHRJdGVyYXRvciA9ICFCVUdHWV9TQUZBUklfSVRFUkFUT1JTICYmIG5hdGl2ZUl0ZXJhdG9yIHx8IGdldEl0ZXJhdGlvbk1ldGhvZChERUZBVUxUKTtcbiAgdmFyIGFueU5hdGl2ZUl0ZXJhdG9yID0gTkFNRSA9PSAnQXJyYXknID8gSXRlcmFibGVQcm90b3R5cGUuZW50cmllcyB8fCBuYXRpdmVJdGVyYXRvciA6IG5hdGl2ZUl0ZXJhdG9yO1xuICB2YXIgQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlLCBtZXRob2RzLCBLRVk7XG5cbiAgLy8gZml4IG5hdGl2ZVxuICBpZiAoYW55TmF0aXZlSXRlcmF0b3IpIHtcbiAgICBDdXJyZW50SXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZihhbnlOYXRpdmVJdGVyYXRvci5jYWxsKG5ldyBJdGVyYWJsZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICBpZiAoIUlTX1BVUkUgJiYgZ2V0UHJvdG90eXBlT2YoQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlKSAhPT0gSXRlcmF0b3JQcm90b3R5cGUpIHtcbiAgICAgICAgaWYgKHNldFByb3RvdHlwZU9mKSB7XG4gICAgICAgICAgc2V0UHJvdG90eXBlT2YoQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlLCBJdGVyYXRvclByb3RvdHlwZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDdXJyZW50SXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlLCBUT19TVFJJTkdfVEFHLCB0cnVlLCB0cnVlKTtcbiAgICAgIGlmIChJU19QVVJFKSBJdGVyYXRvcnNbVE9fU1RSSU5HX1RBR10gPSByZXR1cm5UaGlzO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRkFVTFQgPT0gVkFMVUVTICYmIG5hdGl2ZUl0ZXJhdG9yICYmIG5hdGl2ZUl0ZXJhdG9yLm5hbWUgIT09IFZBTFVFUykge1xuICAgIElOQ09SUkVDVF9WQUxVRVNfTkFNRSA9IHRydWU7XG4gICAgZGVmYXVsdEl0ZXJhdG9yID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmF0aXZlSXRlcmF0b3IuY2FsbCh0aGlzKTsgfTtcbiAgfVxuXG4gIC8vIGRlZmluZSBpdGVyYXRvclxuICBpZiAoKCFJU19QVVJFIHx8IEZPUkNFRCkgJiYgSXRlcmFibGVQcm90b3R5cGVbSVRFUkFUT1JdICE9PSBkZWZhdWx0SXRlcmF0b3IpIHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoSXRlcmFibGVQcm90b3R5cGUsIElURVJBVE9SLCBkZWZhdWx0SXRlcmF0b3IpO1xuICB9XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IGRlZmF1bHRJdGVyYXRvcjtcblxuICAvLyBleHBvcnQgYWRkaXRpb25hbCBtZXRob2RzXG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogZ2V0SXRlcmF0aW9uTWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyBkZWZhdWx0SXRlcmF0b3IgOiBnZXRJdGVyYXRpb25NZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiBnZXRJdGVyYXRpb25NZXRob2QoRU5UUklFUylcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoS0VZIGluIG1ldGhvZHMpIHtcbiAgICAgIGlmIChCVUdHWV9TQUZBUklfSVRFUkFUT1JTIHx8IElOQ09SUkVDVF9WQUxVRVNfTkFNRSB8fCAhKEtFWSBpbiBJdGVyYWJsZVByb3RvdHlwZSkpIHtcbiAgICAgICAgcmVkZWZpbmUoSXRlcmFibGVQcm90b3R5cGUsIEtFWSwgbWV0aG9kc1tLRVldKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgJCh7IHRhcmdldDogTkFNRSwgcHJvdG86IHRydWUsIGZvcmNlZDogQlVHR1lfU0FGQVJJX0lURVJBVE9SUyB8fCBJTkNPUlJFQ1RfVkFMVUVTX05BTUUgfSwgbWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCIvLyBpdGVyYWJsZSBET00gY29sbGVjdGlvbnNcbi8vIGZsYWcgLSBgaXRlcmFibGVgIGludGVyZmFjZSAtICdlbnRyaWVzJywgJ2tleXMnLCAndmFsdWVzJywgJ2ZvckVhY2gnIG1ldGhvZHNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBDU1NSdWxlTGlzdDogMCxcbiAgQ1NTU3R5bGVEZWNsYXJhdGlvbjogMCxcbiAgQ1NTVmFsdWVMaXN0OiAwLFxuICBDbGllbnRSZWN0TGlzdDogMCxcbiAgRE9NUmVjdExpc3Q6IDAsXG4gIERPTVN0cmluZ0xpc3Q6IDAsXG4gIERPTVRva2VuTGlzdDogMSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IDAsXG4gIEZpbGVMaXN0OiAwLFxuICBIVE1MQWxsQ29sbGVjdGlvbjogMCxcbiAgSFRNTENvbGxlY3Rpb246IDAsXG4gIEhUTUxGb3JtRWxlbWVudDogMCxcbiAgSFRNTFNlbGVjdEVsZW1lbnQ6IDAsXG4gIE1lZGlhTGlzdDogMCxcbiAgTWltZVR5cGVBcnJheTogMCxcbiAgTmFtZWROb2RlTWFwOiAwLFxuICBOb2RlTGlzdDogMSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogMCxcbiAgUGx1Z2luOiAwLFxuICBQbHVnaW5BcnJheTogMCxcbiAgU1ZHTGVuZ3RoTGlzdDogMCxcbiAgU1ZHTnVtYmVyTGlzdDogMCxcbiAgU1ZHUGF0aFNlZ0xpc3Q6IDAsXG4gIFNWR1BvaW50TGlzdDogMCxcbiAgU1ZHU3RyaW5nTGlzdDogMCxcbiAgU1ZHVHJhbnNmb3JtTGlzdDogMCxcbiAgU291cmNlQnVmZmVyTGlzdDogMCxcbiAgU3R5bGVTaGVldExpc3Q6IDAsXG4gIFRleHRUcmFja0N1ZUxpc3Q6IDAsXG4gIFRleHRUcmFja0xpc3Q6IDAsXG4gIFRvdWNoTGlzdDogMFxufTtcbiIsInZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXVzZXItYWdlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAvKGlwaG9uZXxpcG9kfGlwYWQpLiphcHBsZXdlYmtpdC9pLnRlc3QodXNlckFnZW50KTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ25hdmlnYXRvcicsICd1c2VyQWdlbnQnKSB8fCAnJztcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50Jyk7XG5cbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnM7XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52ODtcbnZhciBtYXRjaCwgdmVyc2lvbjtcblxuaWYgKHY4KSB7XG4gIG1hdGNoID0gdjguc3BsaXQoJy4nKTtcbiAgdmVyc2lvbiA9IG1hdGNoWzBdICsgbWF0Y2hbMV07XG59IGVsc2UgaWYgKHVzZXJBZ2VudCkge1xuICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvRWRnZVxcLyhcXGQrKS8pO1xuICBpZiAoIW1hdGNoIHx8IG1hdGNoWzFdID49IDc0KSB7XG4gICAgbWF0Y2ggPSB1c2VyQWdlbnQubWF0Y2goL0Nocm9tZVxcLyhcXGQrKS8pO1xuICAgIGlmIChtYXRjaCkgdmVyc2lvbiA9IG1hdGNoWzFdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmVyc2lvbiAmJiArdmVyc2lvbjtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9ycycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgSVRFUkFUT1IgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHZhciBjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGU7XG4gIGlmIChjb25zb2xlICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gY29uc29sZS5lcnJvcihhKSA6IGNvbnNvbGUuZXJyb3IoYSwgYik7XG4gIH1cbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXNldC1wcm90b3R5cGUtb2YnKTtcblxuLy8gbWFrZXMgc3ViY2xhc3Npbmcgd29yayBjb3JyZWN0IGZvciB3cmFwcGVkIGJ1aWx0LWluc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHRoaXMsIGR1bW15LCBXcmFwcGVyKSB7XG4gIHZhciBOZXdUYXJnZXQsIE5ld1RhcmdldFByb3RvdHlwZTtcbiAgaWYgKFxuICAgIC8vIGl0IGNhbiB3b3JrIG9ubHkgd2l0aCBuYXRpdmUgYHNldFByb3RvdHlwZU9mYFxuICAgIHNldFByb3RvdHlwZU9mICYmXG4gICAgLy8gd2UgaGF2ZW4ndCBjb21wbGV0ZWx5IGNvcnJlY3QgcHJlLUVTNiB3YXkgZm9yIGdldHRpbmcgYG5ldy50YXJnZXRgLCBzbyB1c2UgdGhpc1xuICAgIHR5cGVvZiAoTmV3VGFyZ2V0ID0gZHVtbXkuY29uc3RydWN0b3IpID09ICdmdW5jdGlvbicgJiZcbiAgICBOZXdUYXJnZXQgIT09IFdyYXBwZXIgJiZcbiAgICBpc09iamVjdChOZXdUYXJnZXRQcm90b3R5cGUgPSBOZXdUYXJnZXQucHJvdG90eXBlKSAmJlxuICAgIE5ld1RhcmdldFByb3RvdHlwZSAhPT0gV3JhcHBlci5wcm90b3R5cGVcbiAgKSBzZXRQcm90b3R5cGVPZigkdGhpcywgTmV3VGFyZ2V0UHJvdG90eXBlKTtcbiAgcmV0dXJuICR0aGlzO1xufTtcbiIsInZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKS5mO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcbnZhciBGUkVFWklORyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mcmVlemluZycpO1xuXG52YXIgTUVUQURBVEEgPSB1aWQoJ21ldGEnKTtcbnZhciBpZCA9IDA7XG5cbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG52YXIgc2V0TWV0YWRhdGEgPSBmdW5jdGlvbiAoaXQpIHtcbiAgZGVmaW5lUHJvcGVydHkoaXQsIE1FVEFEQVRBLCB7IHZhbHVlOiB7XG4gICAgb2JqZWN0SUQ6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHdlYWtEYXRhOiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IH0pO1xufTtcblxudmFyIGZhc3RLZXkgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICAvLyByZXR1cm4gYSBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmICghaGFzKGl0LCBNRVRBREFUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YWRhdGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFEQVRBXS5vYmplY3RJRDtcbn07XG5cbnZhciBnZXRXZWFrRGF0YSA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIGlmICghaGFzKGl0LCBNRVRBREFUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YWRhdGEoaXQpO1xuICAvLyByZXR1cm4gdGhlIHN0b3JlIG9mIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFEQVRBXS53ZWFrRGF0YTtcbn07XG5cbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChGUkVFWklORyAmJiBtZXRhLlJFUVVJUkVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQURBVEEpKSBzZXRNZXRhZGF0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG5cbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIFJFUVVJUkVEOiBmYWxzZSxcbiAgZmFzdEtleTogZmFzdEtleSxcbiAgZ2V0V2Vha0RhdGE6IGdldFdlYWtEYXRhLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07XG5cbmhpZGRlbktleXNbTUVUQURBVEFdID0gdHJ1ZTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzJyk7XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcblxuLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b3R5cGVbSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGlzQXJyYXlJdGVyYXRvck1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1hcnJheS1pdGVyYXRvci1tZXRob2QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtY29udGV4dCcpO1xudmFyIGdldEl0ZXJhdG9yTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBjYWxsV2l0aFNhZmVJdGVyYXRpb25DbG9zaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nJyk7XG5cbnZhciBSZXN1bHQgPSBmdW5jdGlvbiAoc3RvcHBlZCwgcmVzdWx0KSB7XG4gIHRoaXMuc3RvcHBlZCA9IHN0b3BwZWQ7XG4gIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xufTtcblxudmFyIGl0ZXJhdGUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZm4sIHRoYXQsIEFTX0VOVFJJRVMsIElTX0lURVJBVE9SKSB7XG4gIHZhciBib3VuZEZ1bmN0aW9uID0gYmluZChmbiwgdGhhdCwgQVNfRU5UUklFUyA/IDIgOiAxKTtcbiAgdmFyIGl0ZXJhdG9yLCBpdGVyRm4sIGluZGV4LCBsZW5ndGgsIHJlc3VsdCwgbmV4dCwgc3RlcDtcblxuICBpZiAoSVNfSVRFUkFUT1IpIHtcbiAgICBpdGVyYXRvciA9IGl0ZXJhYmxlO1xuICB9IGVsc2Uge1xuICAgIGl0ZXJGbiA9IGdldEl0ZXJhdG9yTWV0aG9kKGl0ZXJhYmxlKTtcbiAgICBpZiAodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoJ1RhcmdldCBpcyBub3QgaXRlcmFibGUnKTtcbiAgICAvLyBvcHRpbWlzYXRpb24gZm9yIGFycmF5IGl0ZXJhdG9yc1xuICAgIGlmIChpc0FycmF5SXRlcmF0b3JNZXRob2QoaXRlckZuKSkge1xuICAgICAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIHJlc3VsdCA9IEFTX0VOVFJJRVNcbiAgICAgICAgICA/IGJvdW5kRnVuY3Rpb24oYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pXG4gICAgICAgICAgOiBib3VuZEZ1bmN0aW9uKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0IGluc3RhbmNlb2YgUmVzdWx0KSByZXR1cm4gcmVzdWx0O1xuICAgICAgfSByZXR1cm4gbmV3IFJlc3VsdChmYWxzZSk7XG4gICAgfVxuICAgIGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpO1xuICB9XG5cbiAgbmV4dCA9IGl0ZXJhdG9yLm5leHQ7XG4gIHdoaWxlICghKHN0ZXAgPSBuZXh0LmNhbGwoaXRlcmF0b3IpKS5kb25lKSB7XG4gICAgcmVzdWx0ID0gY2FsbFdpdGhTYWZlSXRlcmF0aW9uQ2xvc2luZyhpdGVyYXRvciwgYm91bmRGdW5jdGlvbiwgc3RlcC52YWx1ZSwgQVNfRU5UUklFUyk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ29iamVjdCcgJiYgcmVzdWx0ICYmIHJlc3VsdCBpbnN0YW5jZW9mIFJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgfSByZXR1cm4gbmV3IFJlc3VsdChmYWxzZSk7XG59O1xuXG5pdGVyYXRlLnN0b3AgPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gIHJldHVybiBuZXcgUmVzdWx0KHRydWUsIHJlc3VsdCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcblxudmFyIElURVJBVE9SID0gd2VsbEtub3duU3ltYm9sKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgPSBmYWxzZTtcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG4vLyBgJUl0ZXJhdG9yUHJvdG90eXBlJWAgb2JqZWN0XG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy0laXRlcmF0b3Jwcm90b3R5cGUlLW9iamVjdFxudmFyIEl0ZXJhdG9yUHJvdG90eXBlLCBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUsIGFycmF5SXRlcmF0b3I7XG5cbmlmIChbXS5rZXlzKSB7XG4gIGFycmF5SXRlcmF0b3IgPSBbXS5rZXlzKCk7XG4gIC8vIFNhZmFyaSA4IGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICBpZiAoISgnbmV4dCcgaW4gYXJyYXlJdGVyYXRvcikpIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgPSB0cnVlO1xuICBlbHNlIHtcbiAgICBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZihnZXRQcm90b3R5cGVPZihhcnJheUl0ZXJhdG9yKSk7XG4gICAgaWYgKFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSkgSXRlcmF0b3JQcm90b3R5cGUgPSBQcm90b3R5cGVPZkFycmF5SXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cbn1cblxuaWYgKEl0ZXJhdG9yUHJvdG90eXBlID09IHVuZGVmaW5lZCkgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbmlmICghSVNfUFVSRSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpIHtcbiAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBJdGVyYXRvclByb3RvdHlwZTogSXRlcmF0b3JQcm90b3R5cGUsXG4gIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlM6IEJVR0dZX1NBRkFSSV9JVEVSQVRPUlNcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpLmY7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xudmFyIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90YXNrJykuc2V0O1xudmFyIElTX0lPUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtaXMtaW9zJyk7XG5cbnZhciBNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcbnZhciBJU19OT0RFID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG4vLyBOb2RlLmpzIDExIHNob3dzIEV4cGVyaW1lbnRhbFdhcm5pbmcgb24gZ2V0dGluZyBgcXVldWVNaWNyb3Rhc2tgXG52YXIgcXVldWVNaWNyb3Rhc2tEZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGdsb2JhbCwgJ3F1ZXVlTWljcm90YXNrJyk7XG52YXIgcXVldWVNaWNyb3Rhc2sgPSBxdWV1ZU1pY3JvdGFza0Rlc2NyaXB0b3IgJiYgcXVldWVNaWNyb3Rhc2tEZXNjcmlwdG9yLnZhbHVlO1xuXG52YXIgZmx1c2gsIGhlYWQsIGxhc3QsIG5vdGlmeSwgdG9nZ2xlLCBub2RlLCBwcm9taXNlLCB0aGVuO1xuXG4vLyBtb2Rlcm4gZW5naW5lcyBoYXZlIHF1ZXVlTWljcm90YXNrIG1ldGhvZFxuaWYgKCFxdWV1ZU1pY3JvdGFzaykge1xuICBmbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGFyZW50LCBmbjtcbiAgICBpZiAoSVNfTk9ERSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKSBwYXJlbnQuZXhpdCgpO1xuICAgIHdoaWxlIChoZWFkKSB7XG4gICAgICBmbiA9IGhlYWQuZm47XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChoZWFkKSBub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LmVudGVyKCk7XG4gIH07XG5cbiAgLy8gTm9kZS5qc1xuICBpZiAoSVNfTk9ERSkge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIC8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlciwgZXhjZXB0IGlPUyAtIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8zMzlcbiAgfSBlbHNlIGlmIChNdXRhdGlvbk9ic2VydmVyICYmICFJU19JT1MpIHtcbiAgICB0b2dnbGUgPSB0cnVlO1xuICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmIChQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSkge1xuICAgIC8vIFByb21pc2UucmVzb2x2ZSB3aXRob3V0IGFuIGFyZ3VtZW50IHRocm93cyBhbiBlcnJvciBpbiBMRyBXZWJPUyAyXG4gICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIHRoZW4gPSBwcm9taXNlLnRoZW47XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhlbi5jYWxsKHByb21pc2UsIGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXVlTWljcm90YXNrIHx8IGZ1bmN0aW9uIChmbikge1xuICB2YXIgdGFzayA9IHsgZm46IGZuLCBuZXh0OiB1bmRlZmluZWQgfTtcbiAgaWYgKGxhc3QpIGxhc3QubmV4dCA9IHRhc2s7XG4gIGlmICghaGVhZCkge1xuICAgIGhlYWQgPSB0YXNrO1xuICAgIG5vdGlmeSgpO1xuICB9IGxhc3QgPSB0YXNrO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLlByb21pc2U7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtZnVuY3Rpb24nKTtcblxudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKEMpIHtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24gKCQkcmVzb2x2ZSwgJCRyZWplY3QpIHtcbiAgICBpZiAocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgPSBhRnVuY3Rpb24ocmVqZWN0KTtcbn07XG5cbi8vIDI1LjQuMS41IE5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gKEMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xudmFyIHNoYXJlZEtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQta2V5Jyk7XG52YXIgQ09SUkVDVF9QUk9UT1RZUEVfR0VUVEVSID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvcnJlY3QtcHJvdG90eXBlLWdldHRlcicpO1xuXG52YXIgSUVfUFJPVE8gPSBzaGFyZWRLZXkoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLy8gYE9iamVjdC5nZXRQcm90b3R5cGVPZmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0cHJvdG90eXBlb2Zcbm1vZHVsZS5leHBvcnRzID0gQ09SUkVDVF9QUk9UT1RZUEVfR0VUVEVSID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvdHlwZSA6IG51bGw7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGFQb3NzaWJsZVByb3RvdHlwZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLXBvc3NpYmxlLXByb3RvdHlwZScpO1xuXG4vLyBgT2JqZWN0LnNldFByb3RvdHlwZU9mYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5zZXRwcm90b3R5cGVvZlxuLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gZnVuY3Rpb24gKCkge1xuICB2YXIgQ09SUkVDVF9TRVRURVIgPSBmYWxzZTtcbiAgdmFyIHRlc3QgPSB7fTtcbiAgdmFyIHNldHRlcjtcbiAgdHJ5IHtcbiAgICBzZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQ7XG4gICAgc2V0dGVyLmNhbGwodGVzdCwgW10pO1xuICAgIENPUlJFQ1RfU0VUVEVSID0gdGVzdCBpbnN0YW5jZW9mIEFycmF5O1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90bykge1xuICAgIGFuT2JqZWN0KE8pO1xuICAgIGFQb3NzaWJsZVByb3RvdHlwZShwcm90byk7XG4gICAgaWYgKENPUlJFQ1RfU0VUVEVSKSBzZXR0ZXIuY2FsbChPLCBwcm90byk7XG4gICAgZWxzZSBPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgIHJldHVybiBPO1xuICB9O1xufSgpIDogdW5kZWZpbmVkKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0Jyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mJyk7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gVE9fU1RSSU5HX1RBR19TVVBQT1JUID8ge30udG9TdHJpbmcgOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdbb2JqZWN0ICcgKyBjbGFzc29mKHRoaXMpICsgJ10nO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4geyBlcnJvcjogZmFsc2UsIHZhbHVlOiBleGVjKCkgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4geyBlcnJvcjogdHJ1ZSwgdmFsdWU6IGVycm9yIH07XG4gIH1cbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDLCB4KSB7XG4gIGFuT2JqZWN0KEMpO1xuICBpZiAoaXNPYmplY3QoeCkgJiYgeC5jb25zdHJ1Y3RvciA9PT0gQykgcmV0dXJuIHg7XG4gIHZhciBwcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5LmYoQyk7XG4gIHZhciByZXNvbHZlID0gcHJvbWlzZUNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgcmVzb2x2ZSh4KTtcbiAgcmV0dXJuIHByb21pc2VDYXBhYmlsaXR5LnByb21pc2U7XG59O1xuIiwidmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBvcHRpb25zKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSwgb3B0aW9ucyk7XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENPTlNUUlVDVE9SX05BTUUpIHtcbiAgdmFyIENvbnN0cnVjdG9yID0gZ2V0QnVpbHRJbihDT05TVFJVQ1RPUl9OQU1FKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHlNb2R1bGUuZjtcblxuICBpZiAoREVTQ1JJUFRPUlMgJiYgQ29uc3RydWN0b3IgJiYgIUNvbnN0cnVjdG9yW1NQRUNJRVNdKSB7XG4gICAgZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFNQRUNJRVMsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICAgIH0pO1xuICB9XG59O1xuIiwidmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBUQUcsIFNUQVRJQykge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IFNUQVRJQyA/IGl0IDogaXQucHJvdG90eXBlLCBUT19TVFJJTkdfVEFHKSkge1xuICAgIGRlZmluZVByb3BlcnR5KGl0LCBUT19TVFJJTkdfVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IFRBRyB9KTtcbiAgfVxufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1mdW5jdGlvbicpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xuXG4vLyBgU3BlY2llc0NvbnN0cnVjdG9yYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXNwZWNpZXNjb25zdHJ1Y3RvclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3I7XG4gIHZhciBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IGRlZmF1bHRDb25zdHJ1Y3RvciA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS57IGNvZGVQb2ludEF0LCBhdCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKENPTlZFUlRfVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIHBvcykge1xuICAgIHZhciBTID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUoJHRoaXMpKTtcbiAgICB2YXIgcG9zaXRpb24gPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgc2l6ZSA9IFMubGVuZ3RoO1xuICAgIHZhciBmaXJzdCwgc2Vjb25kO1xuICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gc2l6ZSkgcmV0dXJuIENPTlZFUlRfVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgZmlyc3QgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24pO1xuICAgIHJldHVybiBmaXJzdCA8IDB4RDgwMCB8fCBmaXJzdCA+IDB4REJGRiB8fCBwb3NpdGlvbiArIDEgPT09IHNpemVcbiAgICAgIHx8IChzZWNvbmQgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKSkgPCAweERDMDAgfHwgc2Vjb25kID4gMHhERkZGXG4gICAgICAgID8gQ09OVkVSVF9UT19TVFJJTkcgPyBTLmNoYXJBdChwb3NpdGlvbikgOiBmaXJzdFxuICAgICAgICA6IENPTlZFUlRfVE9fU1RSSU5HID8gUy5zbGljZShwb3NpdGlvbiwgcG9zaXRpb24gKyAyKSA6IChmaXJzdCAtIDB4RDgwMCA8PCAxMCkgKyAoc2Vjb25kIC0gMHhEQzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLmNvZGVwb2ludGF0XG4gIGNvZGVBdDogY3JlYXRlTWV0aG9kKGZhbHNlKSxcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUuYXRgIG1ldGhvZFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XG4gIGNoYXJBdDogY3JlYXRlTWV0aG9kKHRydWUpXG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtY29udGV4dCcpO1xudmFyIGh0bWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaHRtbCcpO1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQnKTtcbnZhciBJU19JT1MgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLWlzLWlvcycpO1xuXG52YXIgbG9jYXRpb24gPSBnbG9iYWwubG9jYXRpb247XG52YXIgc2V0ID0gZ2xvYmFsLnNldEltbWVkaWF0ZTtcbnZhciBjbGVhciA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZTtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgTWVzc2FnZUNoYW5uZWwgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWw7XG52YXIgRGlzcGF0Y2ggPSBnbG9iYWwuRGlzcGF0Y2g7XG52YXIgY291bnRlciA9IDA7XG52YXIgcXVldWUgPSB7fTtcbnZhciBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcbnZhciBkZWZlciwgY2hhbm5lbCwgcG9ydDtcblxudmFyIHJ1biA9IGZ1bmN0aW9uIChpZCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gIGlmIChxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xuXG52YXIgcnVubmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcnVuKGlkKTtcbiAgfTtcbn07XG5cbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICBydW4oZXZlbnQuZGF0YSk7XG59O1xuXG52YXIgcG9zdCA9IGZ1bmN0aW9uIChpZCkge1xuICAvLyBvbGQgZW5naW5lcyBoYXZlIG5vdCBsb2NhdGlvbi5vcmlnaW5cbiAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsIGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3QpO1xufTtcblxuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYgKCFzZXQgfHwgIWNsZWFyKSB7XG4gIHNldCA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbikge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIGkgPSAxO1xuICAgIHdoaWxlIChhcmd1bWVudHMubGVuZ3RoID4gaSkgYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgICAodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSkuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhciA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKSB7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmIChjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKHJ1bm5lcihpZCkpO1xuICAgIH07XG4gIC8vIFNwaGVyZSAoSlMgZ2FtZSBlbmdpbmUpIERpc3BhdGNoIEFQSVxuICB9IGVsc2UgaWYgKERpc3BhdGNoICYmIERpc3BhdGNoLm5vdykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBEaXNwYXRjaC5ub3cocnVubmVyKGlkKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICAvLyBleGNlcHQgaU9TIC0gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzYyNFxuICB9IGVsc2UgaWYgKE1lc3NhZ2VDaGFubmVsICYmICFJU19JT1MpIHtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgcG9ydCA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGJpbmQocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyAmJiAhZmFpbHMocG9zdCkpIHtcbiAgICBkZWZlciA9IHBvc3Q7XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZiAoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY3JlYXRlRWxlbWVudCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bihpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHNldFRpbWVvdXQocnVubmVyKGlkKSwgMCk7XG4gICAgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXQsXG4gIGNsZWFyOiBjbGVhclxufTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG52YXIgdGVzdCA9IHt9O1xuXG50ZXN0W1RPX1NUUklOR19UQUddID0gJ3onO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmluZyh0ZXN0KSA9PT0gJ1tvYmplY3Qgel0nO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgYXJyYXlTcGVjaWVzQ3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG52YXIgYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaGFzLXNwZWNpZXMtc3VwcG9ydCcpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcblxudmFyIElTX0NPTkNBVF9TUFJFQURBQkxFID0gd2VsbEtub3duU3ltYm9sKCdpc0NvbmNhdFNwcmVhZGFibGUnKTtcbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gMHgxRkZGRkZGRkZGRkZGRjtcbnZhciBNQVhJTVVNX0FMTE9XRURfSU5ERVhfRVhDRUVERUQgPSAnTWF4aW11bSBhbGxvd2VkIGluZGV4IGV4Y2VlZGVkJztcblxuLy8gV2UgY2FuJ3QgdXNlIHRoaXMgZmVhdHVyZSBkZXRlY3Rpb24gaW4gVjggc2luY2UgaXQgY2F1c2VzXG4vLyBkZW9wdGltaXphdGlvbiBhbmQgc2VyaW91cyBwZXJmb3JtYW5jZSBkZWdyYWRhdGlvblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzY3OVxudmFyIElTX0NPTkNBVF9TUFJFQURBQkxFX1NVUFBPUlQgPSBWOF9WRVJTSU9OID49IDUxIHx8ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciBhcnJheSA9IFtdO1xuICBhcnJheVtJU19DT05DQVRfU1BSRUFEQUJMRV0gPSBmYWxzZTtcbiAgcmV0dXJuIGFycmF5LmNvbmNhdCgpWzBdICE9PSBhcnJheTtcbn0pO1xuXG52YXIgU1BFQ0lFU19TVVBQT1JUID0gYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCgnY29uY2F0Jyk7XG5cbnZhciBpc0NvbmNhdFNwcmVhZGFibGUgPSBmdW5jdGlvbiAoTykge1xuICBpZiAoIWlzT2JqZWN0KE8pKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzcHJlYWRhYmxlID0gT1tJU19DT05DQVRfU1BSRUFEQUJMRV07XG4gIHJldHVybiBzcHJlYWRhYmxlICE9PSB1bmRlZmluZWQgPyAhIXNwcmVhZGFibGUgOiBpc0FycmF5KE8pO1xufTtcblxudmFyIEZPUkNFRCA9ICFJU19DT05DQVRfU1BSRUFEQUJMRV9TVVBQT1JUIHx8ICFTUEVDSUVTX1NVUFBPUlQ7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuY29uY2F0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5jb25jYXRcbi8vIHdpdGggYWRkaW5nIHN1cHBvcnQgb2YgQEBpc0NvbmNhdFNwcmVhZGFibGUgYW5kIEBAc3BlY2llc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogRk9SQ0VEIH0sIHtcbiAgY29uY2F0OiBmdW5jdGlvbiBjb25jYXQoYXJnKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICAgIHZhciBBID0gYXJyYXlTcGVjaWVzQ3JlYXRlKE8sIDApO1xuICAgIHZhciBuID0gMDtcbiAgICB2YXIgaSwgaywgbGVuZ3RoLCBsZW4sIEU7XG4gICAgZm9yIChpID0gLTEsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgRSA9IGkgPT09IC0xID8gTyA6IGFyZ3VtZW50c1tpXTtcbiAgICAgIGlmIChpc0NvbmNhdFNwcmVhZGFibGUoRSkpIHtcbiAgICAgICAgbGVuID0gdG9MZW5ndGgoRS5sZW5ndGgpO1xuICAgICAgICBpZiAobiArIGxlbiA+IE1BWF9TQUZFX0lOVEVHRVIpIHRocm93IFR5cGVFcnJvcihNQVhJTVVNX0FMTE9XRURfSU5ERVhfRVhDRUVERUQpO1xuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbGVuOyBrKyssIG4rKykgaWYgKGsgaW4gRSkgY3JlYXRlUHJvcGVydHkoQSwgbiwgRVtrXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobiA+PSBNQVhfU0FGRV9JTlRFR0VSKSB0aHJvdyBUeXBlRXJyb3IoTUFYSU1VTV9BTExPV0VEX0lOREVYX0VYQ0VFREVEKTtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkoQSwgbisrLCBFKTtcbiAgICAgIH1cbiAgICB9XG4gICAgQS5sZW5ndGggPSBuO1xuICAgIHJldHVybiBBO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyICRmaWx0ZXIgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaXRlcmF0aW9uJykuZmlsdGVyO1xudmFyIGFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWhhcy1zcGVjaWVzLXN1cHBvcnQnKTtcbnZhciBhcnJheU1ldGhvZFVzZXNUb0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtdXNlcy10by1sZW5ndGgnKTtcblxudmFyIEhBU19TUEVDSUVTX1NVUFBPUlQgPSBhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0KCdmaWx0ZXInKTtcbi8vIEVkZ2UgMTQtIGlzc3VlXG52YXIgVVNFU19UT19MRU5HVEggPSBhcnJheU1ldGhvZFVzZXNUb0xlbmd0aCgnZmlsdGVyJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuZmlsdGVyYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maWx0ZXJcbi8vIHdpdGggYWRkaW5nIHN1cHBvcnQgb2YgQEBzcGVjaWVzXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiAhSEFTX1NQRUNJRVNfU1VQUE9SVCB8fCAhVVNFU19UT19MRU5HVEggfSwge1xuICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgIHJldHVybiAkZmlsdGVyKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hZGQtdG8tdW5zY29wYWJsZXMnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xudmFyIGRlZmluZUl0ZXJhdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS1pdGVyYXRvcicpO1xuXG52YXIgQVJSQVlfSVRFUkFUT1IgPSAnQXJyYXkgSXRlcmF0b3InO1xudmFyIHNldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLnNldDtcbnZhciBnZXRJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5nZXR0ZXJGb3IoQVJSQVlfSVRFUkFUT1IpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmVudHJpZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmVudHJpZXNcbi8vIGBBcnJheS5wcm90b3R5cGUua2V5c2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUua2V5c1xuLy8gYEFycmF5LnByb3RvdHlwZS52YWx1ZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnZhbHVlc1xuLy8gYEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUtQEBpdGVyYXRvclxuLy8gYENyZWF0ZUFycmF5SXRlcmF0b3JgIGludGVybmFsIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtY3JlYXRlYXJyYXlpdGVyYXRvclxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVJdGVyYXRvcihBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gIHNldEludGVybmFsU3RhdGUodGhpcywge1xuICAgIHR5cGU6IEFSUkFZX0lURVJBVE9SLFxuICAgIHRhcmdldDogdG9JbmRleGVkT2JqZWN0KGl0ZXJhdGVkKSwgLy8gdGFyZ2V0XG4gICAgaW5kZXg6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gICAga2luZDoga2luZCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBraW5kXG4gIH0pO1xuLy8gYCVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS5uZXh0XG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhpcyk7XG4gIHZhciB0YXJnZXQgPSBzdGF0ZS50YXJnZXQ7XG4gIHZhciBraW5kID0gc3RhdGUua2luZDtcbiAgdmFyIGluZGV4ID0gc3RhdGUuaW5kZXgrKztcbiAgaWYgKCF0YXJnZXQgfHwgaW5kZXggPj0gdGFyZ2V0Lmxlbmd0aCkge1xuICAgIHN0YXRlLnRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4geyB2YWx1ZTogaW5kZXgsIGRvbmU6IGZhbHNlIH07XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4geyB2YWx1ZTogdGFyZ2V0W2luZGV4XSwgZG9uZTogZmFsc2UgfTtcbiAgcmV0dXJuIHsgdmFsdWU6IFtpbmRleCwgdGFyZ2V0W2luZGV4XV0sIGRvbmU6IGZhbHNlIH07XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJVxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtY3JlYXRldW5tYXBwZWRhcmd1bWVudHNvYmplY3Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWNyZWF0ZW1hcHBlZGFyZ3VtZW50c29iamVjdFxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAdW5zY29wYWJsZXNcbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xuXG52YXIgbmF0aXZlSm9pbiA9IFtdLmpvaW47XG5cbnZhciBFUzNfU1RSSU5HUyA9IEluZGV4ZWRPYmplY3QgIT0gT2JqZWN0O1xudmFyIFNUUklDVF9NRVRIT0QgPSBhcnJheU1ldGhvZElzU3RyaWN0KCdqb2luJywgJywnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5qb2luYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5qb2luXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBFUzNfU1RSSU5HUyB8fCAhU1RSSUNUX01FVEhPRCB9LCB7XG4gIGpvaW46IGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUpvaW4uY2FsbCh0b0luZGV4ZWRPYmplY3QodGhpcyksIHNlcGFyYXRvciA9PT0gdW5kZWZpbmVkID8gJywnIDogc2VwYXJhdG9yKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkbWFwID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLm1hcDtcbnZhciBhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LW1ldGhvZC1oYXMtc3BlY2llcy1zdXBwb3J0Jyk7XG52YXIgYXJyYXlNZXRob2RVc2VzVG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLXVzZXMtdG8tbGVuZ3RoJyk7XG5cbnZhciBIQVNfU1BFQ0lFU19TVVBQT1JUID0gYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCgnbWFwJyk7XG4vLyBGRjQ5LSBpc3N1ZVxudmFyIFVTRVNfVE9fTEVOR1RIID0gYXJyYXlNZXRob2RVc2VzVG9MZW5ndGgoJ21hcCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLm1hcGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUubWFwXG4vLyB3aXRoIGFkZGluZyBzdXBwb3J0IG9mIEBAc3BlY2llc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIUhBU19TUEVDSUVTX1NVUFBPUlQgfHwgIVVTRVNfVE9fTEVOR1RIIH0sIHtcbiAgbWFwOiBmdW5jdGlvbiBtYXAoY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgICByZXR1cm4gJG1hcCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBvYmplY3REZWZpbmVQcm9wZXJ0eU1vZGlsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnR5XG4kKHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiAhREVTQ1JJUFRPUlMsIHNoYW06ICFERVNDUklQVE9SUyB9LCB7XG4gIGRlZmluZVByb3BlcnR5OiBvYmplY3REZWZpbmVQcm9wZXJ0eU1vZGlsZS5mXG59KTtcbiIsInZhciBUT19TVFJJTkdfVEFHX1NVUFBPUlQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nLXRhZy1zdXBwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtdG8tc3RyaW5nJyk7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmdcbmlmICghVE9fU1RSSU5HX1RBR19TVVBQT1JUKSB7XG4gIHJlZGVmaW5lKE9iamVjdC5wcm90b3R5cGUsICd0b1N0cmluZycsIHRvU3RyaW5nLCB7IHVuc2FmZTogdHJ1ZSB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIElTX1BVUkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtcHVyZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIE5hdGl2ZVByb21pc2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXByb21pc2UtY29uc3RydWN0b3InKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWRlZmluZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lLWFsbCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgc2V0U3BlY2llcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtc3BlY2llcycpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWZ1bmN0aW9uJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1pbnN0YW5jZScpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcbnZhciBpbnNwZWN0U291cmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlJyk7XG52YXIgaXRlcmF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRlJyk7XG52YXIgY2hlY2tDb3JyZWN0bmVzc09mSXRlcmF0aW9uID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NoZWNrLWNvcnJlY3RuZXNzLW9mLWl0ZXJhdGlvbicpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgdGFzayA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90YXNrJykuc2V0O1xudmFyIG1pY3JvdGFzayA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9taWNyb3Rhc2snKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9wcm9taXNlLXJlc29sdmUnKTtcbnZhciBob3N0UmVwb3J0RXJyb3JzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hvc3QtcmVwb3J0LWVycm9ycycpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3BlcmZvcm0nKTtcbnZhciBJbnRlcm5hbFN0YXRlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlJyk7XG52YXIgaXNGb3JjZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtZm9yY2VkJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgVjhfVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbicpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xudmFyIFBST01JU0UgPSAnUHJvbWlzZSc7XG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyIHNldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLnNldDtcbnZhciBnZXRJbnRlcm5hbFByb21pc2VTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0dGVyRm9yKFBST01JU0UpO1xudmFyIFByb21pc2VDb25zdHJ1Y3RvciA9IE5hdGl2ZVByb21pc2U7XG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcbnZhciBkb2N1bWVudCA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgJGZldGNoID0gZ2V0QnVpbHRJbignZmV0Y2gnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmY7XG52YXIgbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHk7XG52YXIgSVNfTk9ERSA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xudmFyIERJU1BBVENIX0VWRU5UID0gISEoZG9jdW1lbnQgJiYgZG9jdW1lbnQuY3JlYXRlRXZlbnQgJiYgZ2xvYmFsLmRpc3BhdGNoRXZlbnQpO1xudmFyIFVOSEFORExFRF9SRUpFQ1RJT04gPSAndW5oYW5kbGVkcmVqZWN0aW9uJztcbnZhciBSRUpFQ1RJT05fSEFORExFRCA9ICdyZWplY3Rpb25oYW5kbGVkJztcbnZhciBQRU5ESU5HID0gMDtcbnZhciBGVUxGSUxMRUQgPSAxO1xudmFyIFJFSkVDVEVEID0gMjtcbnZhciBIQU5ETEVEID0gMTtcbnZhciBVTkhBTkRMRUQgPSAyO1xudmFyIEludGVybmFsLCBPd25Qcm9taXNlQ2FwYWJpbGl0eSwgUHJvbWlzZVdyYXBwZXIsIG5hdGl2ZVRoZW47XG5cbnZhciBGT1JDRUQgPSBpc0ZvcmNlZChQUk9NSVNFLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBHTE9CQUxfQ09SRV9KU19QUk9NSVNFID0gaW5zcGVjdFNvdXJjZShQcm9taXNlQ29uc3RydWN0b3IpICE9PSBTdHJpbmcoUHJvbWlzZUNvbnN0cnVjdG9yKTtcbiAgaWYgKCFHTE9CQUxfQ09SRV9KU19QUk9NSVNFKSB7XG4gICAgLy8gVjggNi42IChOb2RlIDEwIGFuZCBDaHJvbWUgNjYpIGhhdmUgYSBidWcgd2l0aCByZXNvbHZpbmcgY3VzdG9tIHRoZW5hYmxlc1xuICAgIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTgzMDU2NVxuICAgIC8vIFdlIGNhbid0IGRldGVjdCBpdCBzeW5jaHJvbm91c2x5LCBzbyBqdXN0IGNoZWNrIHZlcnNpb25zXG4gICAgaWYgKFY4X1ZFUlNJT04gPT09IDY2KSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBVbmhhbmRsZWQgcmVqZWN0aW9ucyB0cmFja2luZyBzdXBwb3J0LCBOb2RlSlMgUHJvbWlzZSB3aXRob3V0IGl0IGZhaWxzIEBAc3BlY2llcyB0ZXN0XG4gICAgaWYgKCFJU19OT0RFICYmIHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgIT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHRydWU7XG4gIH1cbiAgLy8gV2UgbmVlZCBQcm9taXNlI2ZpbmFsbHkgaW4gdGhlIHB1cmUgdmVyc2lvbiBmb3IgcHJldmVudGluZyBwcm90b3R5cGUgcG9sbHV0aW9uXG4gIGlmIChJU19QVVJFICYmICFQcm9taXNlQ29uc3RydWN0b3IucHJvdG90eXBlWydmaW5hbGx5J10pIHJldHVybiB0cnVlO1xuICAvLyBXZSBjYW4ndCB1c2UgQEBzcGVjaWVzIGZlYXR1cmUgZGV0ZWN0aW9uIGluIFY4IHNpbmNlIGl0IGNhdXNlc1xuICAvLyBkZW9wdGltaXphdGlvbiBhbmQgcGVyZm9ybWFuY2UgZGVncmFkYXRpb25cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzY3OVxuICBpZiAoVjhfVkVSU0lPTiA+PSA1MSAmJiAvbmF0aXZlIGNvZGUvLnRlc3QoUHJvbWlzZUNvbnN0cnVjdG9yKSkgcmV0dXJuIGZhbHNlO1xuICAvLyBEZXRlY3QgY29ycmVjdG5lc3Mgb2Ygc3ViY2xhc3Npbmcgd2l0aCBAQHNwZWNpZXMgc3VwcG9ydFxuICB2YXIgcHJvbWlzZSA9IFByb21pc2VDb25zdHJ1Y3Rvci5yZXNvbHZlKDEpO1xuICB2YXIgRmFrZVByb21pc2UgPSBmdW5jdGlvbiAoZXhlYykge1xuICAgIGV4ZWMoZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9LCBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0pO1xuICB9O1xuICB2YXIgY29uc3RydWN0b3IgPSBwcm9taXNlLmNvbnN0cnVjdG9yID0ge307XG4gIGNvbnN0cnVjdG9yW1NQRUNJRVNdID0gRmFrZVByb21pc2U7XG4gIHJldHVybiAhKHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0pIGluc3RhbmNlb2YgRmFrZVByb21pc2UpO1xufSk7XG5cbnZhciBJTkNPUlJFQ1RfSVRFUkFUSU9OID0gRk9SQ0VEIHx8ICFjaGVja0NvcnJlY3RuZXNzT2ZJdGVyYXRpb24oZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XG4gIFByb21pc2VDb25zdHJ1Y3Rvci5hbGwoaXRlcmFibGUpWydjYXRjaCddKGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfSk7XG59KTtcblxuLy8gaGVscGVyc1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG5cbnZhciBub3RpZnkgPSBmdW5jdGlvbiAocHJvbWlzZSwgc3RhdGUsIGlzUmVqZWN0KSB7XG4gIGlmIChzdGF0ZS5ub3RpZmllZCkgcmV0dXJuO1xuICBzdGF0ZS5ub3RpZmllZCA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHN0YXRlLnJlYWN0aW9ucztcbiAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBzdGF0ZS52YWx1ZTtcbiAgICB2YXIgb2sgPSBzdGF0ZS5zdGF0ZSA9PSBGVUxGSUxMRUQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHdoaWxlIChjaGFpbi5sZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFyIHJlYWN0aW9uID0gY2hhaW5baW5kZXgrK107XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsO1xuICAgICAgdmFyIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlO1xuICAgICAgdmFyIHJlamVjdCA9IHJlYWN0aW9uLnJlamVjdDtcbiAgICAgIHZhciBkb21haW4gPSByZWFjdGlvbi5kb21haW47XG4gICAgICB2YXIgcmVzdWx0LCB0aGVuLCBleGl0ZWQ7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5yZWplY3Rpb24gPT09IFVOSEFORExFRCkgb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSwgc3RhdGUpO1xuICAgICAgICAgICAgc3RhdGUucmVqZWN0aW9uID0gSEFORExFRDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhbmRsZXIgPT09IHRydWUpIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRvbWFpbikgZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTsgLy8gY2FuIHRocm93XG4gICAgICAgICAgICBpZiAoZG9tYWluKSB7XG4gICAgICAgICAgICAgIGRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgICAgIGV4aXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2UpIHtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGRvbWFpbiAmJiAhZXhpdGVkKSBkb21haW4uZXhpdCgpO1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdGF0ZS5yZWFjdGlvbnMgPSBbXTtcbiAgICBzdGF0ZS5ub3RpZmllZCA9IGZhbHNlO1xuICAgIGlmIChpc1JlamVjdCAmJiAhc3RhdGUucmVqZWN0aW9uKSBvblVuaGFuZGxlZChwcm9taXNlLCBzdGF0ZSk7XG4gIH0pO1xufTtcblxudmFyIGRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbiAobmFtZSwgcHJvbWlzZSwgcmVhc29uKSB7XG4gIHZhciBldmVudCwgaGFuZGxlcjtcbiAgaWYgKERJU1BBVENIX0VWRU5UKSB7XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBldmVudC5wcm9taXNlID0gcHJvbWlzZTtcbiAgICBldmVudC5yZWFzb24gPSByZWFzb247XG4gICAgZXZlbnQuaW5pdEV2ZW50KG5hbWUsIGZhbHNlLCB0cnVlKTtcbiAgICBnbG9iYWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH0gZWxzZSBldmVudCA9IHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiByZWFzb24gfTtcbiAgaWYgKGhhbmRsZXIgPSBnbG9iYWxbJ29uJyArIG5hbWVdKSBoYW5kbGVyKGV2ZW50KTtcbiAgZWxzZSBpZiAobmFtZSA9PT0gVU5IQU5ETEVEX1JFSkVDVElPTikgaG9zdFJlcG9ydEVycm9ycygnVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgcmVhc29uKTtcbn07XG5cbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlLCBzdGF0ZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gc3RhdGUudmFsdWU7XG4gICAgdmFyIElTX1VOSEFORExFRCA9IGlzVW5oYW5kbGVkKHN0YXRlKTtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGlmIChJU19VTkhBTkRMRUQpIHtcbiAgICAgIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoSVNfTk9ERSkge1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgZGlzcGF0Y2hFdmVudChVTkhBTkRMRURfUkVKRUNUSU9OLCBwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBzdGF0ZS5yZWplY3Rpb24gPSBJU19OT0RFIHx8IGlzVW5oYW5kbGVkKHN0YXRlKSA/IFVOSEFORExFRCA6IEhBTkRMRUQ7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB0aHJvdyByZXN1bHQudmFsdWU7XG4gICAgfVxuICB9KTtcbn07XG5cbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICByZXR1cm4gc3RhdGUucmVqZWN0aW9uICE9PSBIQU5ETEVEICYmICFzdGF0ZS5wYXJlbnQ7XG59O1xuXG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSwgc3RhdGUpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIGlmIChJU19OT0RFKSB7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgZGlzcGF0Y2hFdmVudChSRUpFQ1RJT05fSEFORExFRCwgcHJvbWlzZSwgc3RhdGUudmFsdWUpO1xuICB9KTtcbn07XG5cbnZhciBiaW5kID0gZnVuY3Rpb24gKGZuLCBwcm9taXNlLCBzdGF0ZSwgdW53cmFwKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBmbihwcm9taXNlLCBzdGF0ZSwgdmFsdWUsIHVud3JhcCk7XG4gIH07XG59O1xuXG52YXIgaW50ZXJuYWxSZWplY3QgPSBmdW5jdGlvbiAocHJvbWlzZSwgc3RhdGUsIHZhbHVlLCB1bndyYXApIHtcbiAgaWYgKHN0YXRlLmRvbmUpIHJldHVybjtcbiAgc3RhdGUuZG9uZSA9IHRydWU7XG4gIGlmICh1bndyYXApIHN0YXRlID0gdW53cmFwO1xuICBzdGF0ZS52YWx1ZSA9IHZhbHVlO1xuICBzdGF0ZS5zdGF0ZSA9IFJFSkVDVEVEO1xuICBub3RpZnkocHJvbWlzZSwgc3RhdGUsIHRydWUpO1xufTtcblxudmFyIGludGVybmFsUmVzb2x2ZSA9IGZ1bmN0aW9uIChwcm9taXNlLCBzdGF0ZSwgdmFsdWUsIHVud3JhcCkge1xuICBpZiAoc3RhdGUuZG9uZSkgcmV0dXJuO1xuICBzdGF0ZS5kb25lID0gdHJ1ZTtcbiAgaWYgKHVud3JhcCkgc3RhdGUgPSB1bndyYXA7XG4gIHRyeSB7XG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICB2YXIgdGhlbiA9IGlzVGhlbmFibGUodmFsdWUpO1xuICAgIGlmICh0aGVuKSB7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IHsgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsXG4gICAgICAgICAgICBiaW5kKGludGVybmFsUmVzb2x2ZSwgcHJvbWlzZSwgd3JhcHBlciwgc3RhdGUpLFxuICAgICAgICAgICAgYmluZChpbnRlcm5hbFJlamVjdCwgcHJvbWlzZSwgd3JhcHBlciwgc3RhdGUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBpbnRlcm5hbFJlamVjdChwcm9taXNlLCB3cmFwcGVyLCBlcnJvciwgc3RhdGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHN0YXRlLnN0YXRlID0gRlVMRklMTEVEO1xuICAgICAgbm90aWZ5KHByb21pc2UsIHN0YXRlLCBmYWxzZSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGludGVybmFsUmVqZWN0KHByb21pc2UsIHsgZG9uZTogZmFsc2UgfSwgZXJyb3IsIHN0YXRlKTtcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmIChGT1JDRUQpIHtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgUHJvbWlzZUNvbnN0cnVjdG9yID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcikge1xuICAgIGFuSW5zdGFuY2UodGhpcywgUHJvbWlzZUNvbnN0cnVjdG9yLCBQUk9NSVNFKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxTdGF0ZSh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoYmluZChpbnRlcm5hbFJlc29sdmUsIHRoaXMsIHN0YXRlKSwgYmluZChpbnRlcm5hbFJlamVjdCwgdGhpcywgc3RhdGUpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaW50ZXJuYWxSZWplY3QodGhpcywgc3RhdGUsIGVycm9yKTtcbiAgICB9XG4gIH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICBzZXRJbnRlcm5hbFN0YXRlKHRoaXMsIHtcbiAgICAgIHR5cGU6IFBST01JU0UsXG4gICAgICBkb25lOiBmYWxzZSxcbiAgICAgIG5vdGlmaWVkOiBmYWxzZSxcbiAgICAgIHBhcmVudDogZmFsc2UsXG4gICAgICByZWFjdGlvbnM6IFtdLFxuICAgICAgcmVqZWN0aW9uOiBmYWxzZSxcbiAgICAgIHN0YXRlOiBQRU5ESU5HLFxuICAgICAgdmFsdWU6IHVuZGVmaW5lZFxuICAgIH0pO1xuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZWRlZmluZUFsbChQcm9taXNlQ29uc3RydWN0b3IucHJvdG90eXBlLCB7XG4gICAgLy8gYFByb21pc2UucHJvdG90eXBlLnRoZW5gIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXByb21pc2UucHJvdG90eXBlLnRoZW5cbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFByb21pc2VTdGF0ZSh0aGlzKTtcbiAgICAgIHZhciByZWFjdGlvbiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBQcm9taXNlQ29uc3RydWN0b3IpKTtcbiAgICAgIHJlYWN0aW9uLm9rID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gSVNfTk9ERSA/IHByb2Nlc3MuZG9tYWluIDogdW5kZWZpbmVkO1xuICAgICAgc3RhdGUucGFyZW50ID0gdHJ1ZTtcbiAgICAgIHN0YXRlLnJlYWN0aW9ucy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmIChzdGF0ZS5zdGF0ZSAhPSBQRU5ESU5HKSBub3RpZnkodGhpcywgc3RhdGUsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gYFByb21pc2UucHJvdG90eXBlLmNhdGNoYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1wcm9taXNlLnByb3RvdHlwZS5jYXRjaFxuICAgICdjYXRjaCc6IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgT3duUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgSW50ZXJuYWwoKTtcbiAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHByb21pc2UpO1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5yZXNvbHZlID0gYmluZChpbnRlcm5hbFJlc29sdmUsIHByb21pc2UsIHN0YXRlKTtcbiAgICB0aGlzLnJlamVjdCA9IGJpbmQoaW50ZXJuYWxSZWplY3QsIHByb21pc2UsIHN0YXRlKTtcbiAgfTtcbiAgbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUuZiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKEMpIHtcbiAgICByZXR1cm4gQyA9PT0gUHJvbWlzZUNvbnN0cnVjdG9yIHx8IEMgPT09IFByb21pc2VXcmFwcGVyXG4gICAgICA/IG5ldyBPd25Qcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgOiBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gIH07XG5cbiAgaWYgKCFJU19QVVJFICYmIHR5cGVvZiBOYXRpdmVQcm9taXNlID09ICdmdW5jdGlvbicpIHtcbiAgICBuYXRpdmVUaGVuID0gTmF0aXZlUHJvbWlzZS5wcm90b3R5cGUudGhlbjtcblxuICAgIC8vIHdyYXAgbmF0aXZlIFByb21pc2UjdGhlbiBmb3IgbmF0aXZlIGFzeW5jIGZ1bmN0aW9uc1xuICAgIHJlZGVmaW5lKE5hdGl2ZVByb21pc2UucHJvdG90eXBlLCAndGhlbicsIGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZUNvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgbmF0aXZlVGhlbi5jYWxsKHRoYXQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvNjQwXG4gICAgfSwgeyB1bnNhZmU6IHRydWUgfSk7XG5cbiAgICAvLyB3cmFwIGZldGNoIHJlc3VsdFxuICAgIGlmICh0eXBlb2YgJGZldGNoID09ICdmdW5jdGlvbicpICQoeyBnbG9iYWw6IHRydWUsIGVudW1lcmFibGU6IHRydWUsIGZvcmNlZDogdHJ1ZSB9LCB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIGZldGNoOiBmdW5jdGlvbiBmZXRjaChpbnB1dCAvKiAsIGluaXQgKi8pIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKFByb21pc2VDb25zdHJ1Y3RvciwgJGZldGNoLmFwcGx5KGdsb2JhbCwgYXJndW1lbnRzKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuJCh7IGdsb2JhbDogdHJ1ZSwgd3JhcDogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQgfSwge1xuICBQcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3Jcbn0pO1xuXG5zZXRUb1N0cmluZ1RhZyhQcm9taXNlQ29uc3RydWN0b3IsIFBST01JU0UsIGZhbHNlLCB0cnVlKTtcbnNldFNwZWNpZXMoUFJPTUlTRSk7XG5cblByb21pc2VXcmFwcGVyID0gZ2V0QnVpbHRJbihQUk9NSVNFKTtcblxuLy8gc3RhdGljc1xuJCh7IHRhcmdldDogUFJPTUlTRSwgc3RhdDogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQgfSwge1xuICAvLyBgUHJvbWlzZS5yZWplY3RgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1wcm9taXNlLnJlamVjdFxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKSB7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKTtcbiAgICBjYXBhYmlsaXR5LnJlamVjdC5jYWxsKHVuZGVmaW5lZCwgcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG5cbiQoeyB0YXJnZXQ6IFBST01JU0UsIHN0YXQ6IHRydWUsIGZvcmNlZDogSVNfUFVSRSB8fCBGT1JDRUQgfSwge1xuICAvLyBgUHJvbWlzZS5yZXNvbHZlYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcHJvbWlzZS5yZXNvbHZlXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCkge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShJU19QVVJFICYmIHRoaXMgPT09IFByb21pc2VXcmFwcGVyID8gUHJvbWlzZUNvbnN0cnVjdG9yIDogdGhpcywgeCk7XG4gIH1cbn0pO1xuXG4kKHsgdGFyZ2V0OiBQUk9NSVNFLCBzdGF0OiB0cnVlLCBmb3JjZWQ6IElOQ09SUkVDVF9JVEVSQVRJT04gfSwge1xuICAvLyBgUHJvbWlzZS5hbGxgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1wcm9taXNlLmFsbFxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZXNvbHZlID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHByb21pc2VSZXNvbHZlID0gYUZ1bmN0aW9uKEMucmVzb2x2ZSk7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICB2YXIgcmVtYWluaW5nID0gMTtcbiAgICAgIGl0ZXJhdGUoaXRlcmFibGUsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGNvdW50ZXIrKztcbiAgICAgICAgdmFyIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgICRwcm9taXNlUmVzb2x2ZS5jYWxsKEMsIHByb21pc2UpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGFscmVhZHlDYWxsZWQpIHJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lcnJvcikgcmVqZWN0KHJlc3VsdC52YWx1ZSk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gYFByb21pc2UucmFjZWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXByb21pc2UucmFjZVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKSB7XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gICAgdmFyIHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkcHJvbWlzZVJlc29sdmUgPSBhRnVuY3Rpb24oQy5yZXNvbHZlKTtcbiAgICAgIGl0ZXJhdGUoaXRlcmFibGUsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICRwcm9taXNlUmVzb2x2ZS5jYWxsKEMsIHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lcnJvcikgcmVqZWN0KHJlc3VsdC52YWx1ZSk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY2hhckF0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N0cmluZy1tdWx0aWJ5dGUnKS5jaGFyQXQ7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xudmFyIGRlZmluZUl0ZXJhdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS1pdGVyYXRvcicpO1xuXG52YXIgU1RSSU5HX0lURVJBVE9SID0gJ1N0cmluZyBJdGVyYXRvcic7XG52YXIgc2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuc2V0O1xudmFyIGdldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldHRlckZvcihTVFJJTkdfSVRFUkFUT1IpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLUBAaXRlcmF0b3JcbmRlZmluZUl0ZXJhdG9yKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICBzZXRJbnRlcm5hbFN0YXRlKHRoaXMsIHtcbiAgICB0eXBlOiBTVFJJTkdfSVRFUkFUT1IsXG4gICAgc3RyaW5nOiBTdHJpbmcoaXRlcmF0ZWQpLFxuICAgIGluZGV4OiAwXG4gIH0pO1xuLy8gYCVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy0lc3RyaW5naXRlcmF0b3Jwcm90b3R5cGUlLm5leHRcbn0sIGZ1bmN0aW9uIG5leHQoKSB7XG4gIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhpcyk7XG4gIHZhciBzdHJpbmcgPSBzdGF0ZS5zdHJpbmc7XG4gIHZhciBpbmRleCA9IHN0YXRlLmluZGV4O1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBzdHJpbmcubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gY2hhckF0KHN0cmluZywgaW5kZXgpO1xuICBzdGF0ZS5pbmRleCArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNvbGxlY3Rpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29sbGVjdGlvbicpO1xudmFyIGNvbGxlY3Rpb25XZWFrID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvbGxlY3Rpb24td2VhaycpO1xuXG4vLyBgV2Vha1NldGAgY29uc3RydWN0b3Jcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXdlYWtzZXQtY29uc3RydWN0b3JcbmNvbGxlY3Rpb24oJ1dlYWtTZXQnLCBmdW5jdGlvbiAoaW5pdCkge1xuICByZXR1cm4gZnVuY3Rpb24gV2Vha1NldCgpIHsgcmV0dXJuIGluaXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCBjb2xsZWN0aW9uV2Vhayk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIERPTUl0ZXJhYmxlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb20taXRlcmFibGVzJyk7XG52YXIgQXJyYXlJdGVyYXRvck1ldGhvZHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2VzLmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgSVRFUkFUT1IgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG52YXIgVE9fU1RSSU5HX1RBRyA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcbnZhciBBcnJheVZhbHVlcyA9IEFycmF5SXRlcmF0b3JNZXRob2RzLnZhbHVlcztcblxuZm9yICh2YXIgQ09MTEVDVElPTl9OQU1FIGluIERPTUl0ZXJhYmxlcykge1xuICB2YXIgQ29sbGVjdGlvbiA9IGdsb2JhbFtDT0xMRUNUSU9OX05BTUVdO1xuICB2YXIgQ29sbGVjdGlvblByb3RvdHlwZSA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlKSB7XG4gICAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XG4gICAgaWYgKENvbGxlY3Rpb25Qcm90b3R5cGVbSVRFUkFUT1JdICE9PSBBcnJheVZhbHVlcykgdHJ5IHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDb2xsZWN0aW9uUHJvdG90eXBlLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDb2xsZWN0aW9uUHJvdG90eXBlW0lURVJBVE9SXSA9IEFycmF5VmFsdWVzO1xuICAgIH1cbiAgICBpZiAoIUNvbGxlY3Rpb25Qcm90b3R5cGVbVE9fU1RSSU5HX1RBR10pIHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDb2xsZWN0aW9uUHJvdG90eXBlLCBUT19TVFJJTkdfVEFHLCBDT0xMRUNUSU9OX05BTUUpO1xuICAgIH1cbiAgICBpZiAoRE9NSXRlcmFibGVzW0NPTExFQ1RJT05fTkFNRV0pIGZvciAodmFyIE1FVEhPRF9OQU1FIGluIEFycmF5SXRlcmF0b3JNZXRob2RzKSB7XG4gICAgICAvLyBzb21lIENocm9tZSB2ZXJzaW9ucyBoYXZlIG5vbi1jb25maWd1cmFibGUgbWV0aG9kcyBvbiBET01Ub2tlbkxpc3RcbiAgICAgIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlW01FVEhPRF9OQU1FXSAhPT0gQXJyYXlJdGVyYXRvck1ldGhvZHNbTUVUSE9EX05BTUVdKSB0cnkge1xuICAgICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoQ29sbGVjdGlvblByb3RvdHlwZSwgTUVUSE9EX05BTUUsIEFycmF5SXRlcmF0b3JNZXRob2RzW01FVEhPRF9OQU1FXSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBDb2xsZWN0aW9uUHJvdG90eXBlW01FVEhPRF9OQU1FXSA9IEFycmF5SXRlcmF0b3JNZXRob2RzW01FVEhPRF9OQU1FXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qXG4gKlxuICogTW9yZSBpbmZvIGF0IFt3d3cuZHJvcHpvbmVqcy5jb21dKGh0dHA6Ly93d3cuZHJvcHpvbmVqcy5jb20pXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEyLCBNYXRpYXMgTWVub1xuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG5cbi8vIFRoZSBFbWl0dGVyIGNsYXNzIHByb3ZpZGVzIHRoZSBhYmlsaXR5IHRvIGNhbGwgYC5vbigpYCBvbiBEcm9wem9uZSB0byBsaXN0ZW5cbi8vIHRvIGV2ZW50cy5cbi8vIEl0IGlzIHN0cm9uZ2x5IGJhc2VkIG9uIGNvbXBvbmVudCdzIGVtaXR0ZXIgY2xhc3MsIGFuZCBJIHJlbW92ZWQgdGhlXG4vLyBmdW5jdGlvbmFsaXR5IGJlY2F1c2Ugb2YgdGhlIGRlcGVuZGVuY3kgaGVsbCB3aXRoIGRpZmZlcmVudCBmcmFtZXdvcmtzLlxudmFyIEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEVtaXR0ZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEVtaXR0ZXIpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEVtaXR0ZXIsIFt7XG4gICAga2V5OiBcIm9uXCIsXG5cbiAgICAvLyBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGdpdmVuIGV2ZW50XG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbikge1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAgICAgLy8gQ3JlYXRlIG5hbWVzcGFjZSBmb3IgdGhpcyBldmVudFxuICAgICAgaWYgKCF0aGlzLl9jYWxsYmFja3NbZXZlbnRdKSB7XG4gICAgICAgIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NhbGxiYWNrc1tldmVudF0ucHVzaChmbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZW1pdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbWl0KGV2ZW50KSB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICAgICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IGNhbGxiYWNrcywgX2lzQXJyYXkgPSB0cnVlLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYgPSBfaXRlcmF0b3JbX2krK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pID0gX2l0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaS5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYgPSBfaS52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBfcmVmO1xuXG4gICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyIGZvciBnaXZlbiBldmVudC4gSWYgZm4gaXMgbm90IHByb3ZpZGVkLCBhbGwgZXZlbnRcbiAgICAvLyBsaXN0ZW5lcnMgZm9yIHRoYXQgZXZlbnQgd2lsbCBiZSByZW1vdmVkLiBJZiBuZWl0aGVyIGlzIHByb3ZpZGVkLCBhbGxcbiAgICAvLyBldmVudCBsaXN0ZW5lcnMgd2lsbCBiZSByZW1vdmVkLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwib2ZmXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9mZihldmVudCwgZm4pIHtcbiAgICAgIGlmICghdGhpcy5fY2FsbGJhY2tzIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBzcGVjaWZpYyBldmVudFxuICAgICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY2FsbGJhY2tzW2ldO1xuICAgICAgICBpZiAoY2FsbGJhY2sgPT09IGZuKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRW1pdHRlcjtcbn0oKTtcblxudmFyIERyb3B6b25lID0gZnVuY3Rpb24gKF9FbWl0dGVyKSB7XG4gIF9pbmhlcml0cyhEcm9wem9uZSwgX0VtaXR0ZXIpO1xuXG4gIF9jcmVhdGVDbGFzcyhEcm9wem9uZSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiaW5pdENsYXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXRDbGFzcygpIHtcblxuICAgICAgLy8gRXhwb3NpbmcgdGhlIGVtaXR0ZXIgY2xhc3MsIG1haW5seSBmb3IgdGVzdHNcbiAgICAgIHRoaXMucHJvdG90eXBlLkVtaXR0ZXIgPSBFbWl0dGVyO1xuXG4gICAgICAvKlxuICAgICAgIFRoaXMgaXMgYSBsaXN0IG9mIGFsbCBhdmFpbGFibGUgZXZlbnRzIHlvdSBjYW4gcmVnaXN0ZXIgb24gYSBkcm9wem9uZSBvYmplY3QuXG4gICAgICAgIFlvdSBjYW4gcmVnaXN0ZXIgYW4gZXZlbnQgaGFuZGxlciBsaWtlIHRoaXM6XG4gICAgICAgIGRyb3B6b25lLm9uKFwiZHJhZ0VudGVyXCIsIGZ1bmN0aW9uKCkgeyB9KTtcbiAgICAgICAgKi9cbiAgICAgIHRoaXMucHJvdG90eXBlLmV2ZW50cyA9IFtcImRyb3BcIiwgXCJkcmFnc3RhcnRcIiwgXCJkcmFnZW5kXCIsIFwiZHJhZ2VudGVyXCIsIFwiZHJhZ292ZXJcIiwgXCJkcmFnbGVhdmVcIiwgXCJhZGRlZGZpbGVcIiwgXCJhZGRlZGZpbGVzXCIsIFwicmVtb3ZlZGZpbGVcIiwgXCJ0aHVtYm5haWxcIiwgXCJlcnJvclwiLCBcImVycm9ybXVsdGlwbGVcIiwgXCJwcm9jZXNzaW5nXCIsIFwicHJvY2Vzc2luZ211bHRpcGxlXCIsIFwidXBsb2FkcHJvZ3Jlc3NcIiwgXCJ0b3RhbHVwbG9hZHByb2dyZXNzXCIsIFwic2VuZGluZ1wiLCBcInNlbmRpbmdtdWx0aXBsZVwiLCBcInN1Y2Nlc3NcIiwgXCJzdWNjZXNzbXVsdGlwbGVcIiwgXCJjYW5jZWxlZFwiLCBcImNhbmNlbGVkbXVsdGlwbGVcIiwgXCJjb21wbGV0ZVwiLCBcImNvbXBsZXRlbXVsdGlwbGVcIiwgXCJyZXNldFwiLCBcIm1heGZpbGVzZXhjZWVkZWRcIiwgXCJtYXhmaWxlc3JlYWNoZWRcIiwgXCJxdWV1ZWNvbXBsZXRlXCJdO1xuXG4gICAgICB0aGlzLnByb3RvdHlwZS5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhcyB0byBiZSBzcGVjaWZpZWQgb24gZWxlbWVudHMgb3RoZXIgdGhhbiBmb3JtIChvciB3aGVuIHRoZSBmb3JtXG4gICAgICAgICAqIGRvZXNuJ3QgaGF2ZSBhbiBgYWN0aW9uYCBhdHRyaWJ1dGUpLiBZb3UgY2FuIGFsc29cbiAgICAgICAgICogcHJvdmlkZSBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBgZmlsZXNgIGFuZFxuICAgICAgICAgKiBtdXN0IHJldHVybiB0aGUgdXJsIChzaW5jZSBgdjMuMTIuMGApXG4gICAgICAgICAqL1xuICAgICAgICB1cmw6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbiBiZSBjaGFuZ2VkIHRvIGBcInB1dFwiYCBpZiBuZWNlc3NhcnkuIFlvdSBjYW4gYWxzbyBwcm92aWRlIGEgZnVuY3Rpb25cbiAgICAgICAgICogdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIGBmaWxlc2AgYW5kIG11c3QgcmV0dXJuIHRoZSBtZXRob2QgKHNpbmNlIGB2My4xMi4wYCkuXG4gICAgICAgICAqL1xuICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaWxsIGJlIHNldCBvbiB0aGUgWEhSZXF1ZXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHRpbWVvdXQgZm9yIHRoZSBYSFIgcmVxdWVzdHMgaW4gbWlsbGlzZWNvbmRzIChzaW5jZSBgdjQuNC4wYCkuXG4gICAgICAgICAqL1xuICAgICAgICB0aW1lb3V0OiAzMDAwMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSG93IG1hbnkgZmlsZSB1cGxvYWRzIHRvIHByb2Nlc3MgaW4gcGFyYWxsZWwgKFNlZSB0aGVcbiAgICAgICAgICogRW5xdWV1aW5nIGZpbGUgdXBsb2FkcyogZG9jdW1lbnRhdGlvbiBzZWN0aW9uIGZvciBtb3JlIGluZm8pXG4gICAgICAgICAqL1xuICAgICAgICBwYXJhbGxlbFVwbG9hZHM6IDIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgdG8gc2VuZCBtdWx0aXBsZSBmaWxlcyBpbiBvbmUgcmVxdWVzdC4gSWZcbiAgICAgICAgICogdGhpcyBpdCBzZXQgdG8gdHJ1ZSwgdGhlbiB0aGUgZmFsbGJhY2sgZmlsZSBpbnB1dCBlbGVtZW50IHdpbGxcbiAgICAgICAgICogaGF2ZSB0aGUgYG11bHRpcGxlYCBhdHRyaWJ1dGUgYXMgd2VsbC4gVGhpcyBvcHRpb24gd2lsbFxuICAgICAgICAgKiBhbHNvIHRyaWdnZXIgYWRkaXRpb25hbCBldmVudHMgKGxpa2UgYHByb2Nlc3NpbmdtdWx0aXBsZWApLiBTZWUgdGhlIGV2ZW50c1xuICAgICAgICAgKiBkb2N1bWVudGF0aW9uIHNlY3Rpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB1cGxvYWRNdWx0aXBsZTogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgeW91IHdhbnQgZmlsZXMgdG8gYmUgdXBsb2FkZWQgaW4gY2h1bmtzIHRvIHlvdXIgc2VydmVyLiBUaGlzIGNhbid0IGJlXG4gICAgICAgICAqIHVzZWQgaW4gY29tYmluYXRpb24gd2l0aCBgdXBsb2FkTXVsdGlwbGVgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTZWUgW2NodW5rc1VwbG9hZGVkXSgjY29uZmlnLWNodW5rc1VwbG9hZGVkKSBmb3IgdGhlIGNhbGxiYWNrIHRvIGZpbmFsaXNlIGFuIHVwbG9hZC5cbiAgICAgICAgICovXG4gICAgICAgIGNodW5raW5nOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYGNodW5raW5nYCBpcyBlbmFibGVkLCB0aGlzIGRlZmluZXMgd2hldGhlciAqKmV2ZXJ5KiogZmlsZSBzaG91bGQgYmUgY2h1bmtlZCxcbiAgICAgICAgICogZXZlbiBpZiB0aGUgZmlsZSBzaXplIGlzIGJlbG93IGNodW5rU2l6ZS4gVGhpcyBtZWFucywgdGhhdCB0aGUgYWRkaXRpb25hbCBjaHVua1xuICAgICAgICAgKiBmb3JtIGRhdGEgd2lsbCBiZSBzdWJtaXR0ZWQgYW5kIHRoZSBgY2h1bmtzVXBsb2FkZWRgIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZvcmNlQ2h1bmtpbmc6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBgY2h1bmtpbmdgIGlzIGB0cnVlYCwgdGhlbiB0aGlzIGRlZmluZXMgdGhlIGNodW5rIHNpemUgaW4gYnl0ZXMuXG4gICAgICAgICAqL1xuICAgICAgICBjaHVua1NpemU6IDIwMDAwMDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGB0cnVlYCwgdGhlIGluZGl2aWR1YWwgY2h1bmtzIG9mIGEgZmlsZSBhcmUgYmVpbmcgdXBsb2FkZWQgc2ltdWx0YW5lb3VzbHkuXG4gICAgICAgICAqL1xuICAgICAgICBwYXJhbGxlbENodW5rVXBsb2FkczogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgYSBjaHVuayBzaG91bGQgYmUgcmV0cmllZCBpZiBpdCBmYWlscy5cbiAgICAgICAgICovXG4gICAgICAgIHJldHJ5Q2h1bmtzOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYHJldHJ5Q2h1bmtzYCBpcyB0cnVlLCBob3cgbWFueSB0aW1lcyBzaG91bGQgaXQgYmUgcmV0cmllZC5cbiAgICAgICAgICovXG4gICAgICAgIHJldHJ5Q2h1bmtzTGltaXQ6IDMsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIG5vdCBgbnVsbGAgZGVmaW5lcyBob3cgbWFueSBmaWxlcyB0aGlzIERyb3B6b25lIGhhbmRsZXMuIElmIGl0IGV4Y2VlZHMsXG4gICAgICAgICAqIHRoZSBldmVudCBgbWF4ZmlsZXNleGNlZWRlZGAgd2lsbCBiZSBjYWxsZWQuIFRoZSBkcm9wem9uZSBlbGVtZW50IGdldHMgdGhlXG4gICAgICAgICAqIGNsYXNzIGBkei1tYXgtZmlsZXMtcmVhY2hlZGAgYWNjb3JkaW5nbHkgc28geW91IGNhbiBwcm92aWRlIHZpc3VhbCBmZWVkYmFjay5cbiAgICAgICAgICovXG4gICAgICAgIG1heEZpbGVzaXplOiAyNTYsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBuYW1lIG9mIHRoZSBmaWxlIHBhcmFtIHRoYXQgZ2V0cyB0cmFuc2ZlcnJlZC5cbiAgICAgICAgICogKipOT1RFKio6IElmIHlvdSBoYXZlIHRoZSBvcHRpb24gIGB1cGxvYWRNdWx0aXBsZWAgc2V0IHRvIGB0cnVlYCwgdGhlblxuICAgICAgICAgKiBEcm9wem9uZSB3aWxsIGFwcGVuZCBgW11gIHRvIHRoZSBuYW1lLlxuICAgICAgICAgKi9cbiAgICAgICAgcGFyYW1OYW1lOiBcImZpbGVcIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciB0aHVtYm5haWxzIGZvciBpbWFnZXMgc2hvdWxkIGJlIGdlbmVyYXRlZFxuICAgICAgICAgKi9cbiAgICAgICAgY3JlYXRlSW1hZ2VUaHVtYm5haWxzOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbiBNQi4gV2hlbiB0aGUgZmlsZW5hbWUgZXhjZWVkcyB0aGlzIGxpbWl0LCB0aGUgdGh1bWJuYWlsIHdpbGwgbm90IGJlIGdlbmVyYXRlZC5cbiAgICAgICAgICovXG4gICAgICAgIG1heFRodW1ibmFpbEZpbGVzaXplOiAxMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYG51bGxgLCB0aGUgcmF0aW8gb2YgdGhlIGltYWdlIHdpbGwgYmUgdXNlZCB0byBjYWxjdWxhdGUgaXQuXG4gICAgICAgICAqL1xuICAgICAgICB0aHVtYm5haWxXaWR0aDogMTIwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2FtZSBhcyBgdGh1bWJuYWlsV2lkdGhgLiBJZiBib3RoIGFyZSBudWxsLCBpbWFnZXMgd2lsbCBub3QgYmUgcmVzaXplZC5cbiAgICAgICAgICovXG4gICAgICAgIHRodW1ibmFpbEhlaWdodDogMTIwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIb3cgdGhlIGltYWdlcyBzaG91bGQgYmUgc2NhbGVkIGRvd24gaW4gY2FzZSBib3RoLCBgdGh1bWJuYWlsV2lkdGhgIGFuZCBgdGh1bWJuYWlsSGVpZ2h0YCBhcmUgcHJvdmlkZWQuXG4gICAgICAgICAqIENhbiBiZSBlaXRoZXIgYGNvbnRhaW5gIG9yIGBjcm9wYC5cbiAgICAgICAgICovXG4gICAgICAgIHRodW1ibmFpbE1ldGhvZDogJ2Nyb3AnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBzZXQsIGltYWdlcyB3aWxsIGJlIHJlc2l6ZWQgdG8gdGhlc2UgZGltZW5zaW9ucyBiZWZvcmUgYmVpbmcgKip1cGxvYWRlZCoqLlxuICAgICAgICAgKiBJZiBvbmx5IG9uZSwgYHJlc2l6ZVdpZHRoYCAqKm9yKiogYHJlc2l6ZUhlaWdodGAgaXMgcHJvdmlkZWQsIHRoZSBvcmlnaW5hbCBhc3BlY3RcbiAgICAgICAgICogcmF0aW8gb2YgdGhlIGZpbGUgd2lsbCBiZSBwcmVzZXJ2ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBgb3B0aW9ucy50cmFuc2Zvcm1GaWxlYCBmdW5jdGlvbiB1c2VzIHRoZXNlIG9wdGlvbnMsIHNvIGlmIHRoZSBgdHJhbnNmb3JtRmlsZWAgZnVuY3Rpb25cbiAgICAgICAgICogaXMgb3ZlcnJpZGRlbiwgdGhlc2Ugb3B0aW9ucyBkb24ndCBkbyBhbnl0aGluZy5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZVdpZHRoOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWUgYHJlc2l6ZVdpZHRoYC5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZUhlaWdodDogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG1pbWUgdHlwZSBvZiB0aGUgcmVzaXplZCBpbWFnZSAoYmVmb3JlIGl0IGdldHMgdXBsb2FkZWQgdG8gdGhlIHNlcnZlcikuXG4gICAgICAgICAqIElmIGBudWxsYCB0aGUgb3JpZ2luYWwgbWltZSB0eXBlIHdpbGwgYmUgdXNlZC4gVG8gZm9yY2UganBlZywgZm9yIGV4YW1wbGUsIHVzZSBgaW1hZ2UvanBlZ2AuXG4gICAgICAgICAqIFNlZSBgcmVzaXplV2lkdGhgIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzaXplTWltZVR5cGU6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBxdWFsaXR5IG9mIHRoZSByZXNpemVkIGltYWdlcy4gU2VlIGByZXNpemVXaWR0aGAuXG4gICAgICAgICAqL1xuICAgICAgICByZXNpemVRdWFsaXR5OiAwLjgsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhvdyB0aGUgaW1hZ2VzIHNob3VsZCBiZSBzY2FsZWQgZG93biBpbiBjYXNlIGJvdGgsIGByZXNpemVXaWR0aGAgYW5kIGByZXNpemVIZWlnaHRgIGFyZSBwcm92aWRlZC5cbiAgICAgICAgICogQ2FuIGJlIGVpdGhlciBgY29udGFpbmAgb3IgYGNyb3BgLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzaXplTWV0aG9kOiAnY29udGFpbicsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBiYXNlIHRoYXQgaXMgdXNlZCB0byBjYWxjdWxhdGUgdGhlIGZpbGVzaXplLiBZb3UgY2FuIGNoYW5nZSB0aGlzIHRvXG4gICAgICAgICAqIDEwMjQgaWYgeW91IHdvdWxkIHJhdGhlciBkaXNwbGF5IGtpYmlieXRlcywgbWViaWJ5dGVzLCBldGMuLi5cbiAgICAgICAgICogMTAyNCBpcyB0ZWNobmljYWxseSBpbmNvcnJlY3QsIGJlY2F1c2UgYDEwMjQgYnl0ZXNgIGFyZSBgMSBraWJpYnl0ZWAgbm90IGAxIGtpbG9ieXRlYC5cbiAgICAgICAgICogWW91IGNhbiBjaGFuZ2UgdGhpcyB0byBgMTAyNGAgaWYgeW91IGRvbid0IGNhcmUgYWJvdXQgdmFsaWRpdHkuXG4gICAgICAgICAqL1xuICAgICAgICBmaWxlc2l6ZUJhc2U6IDEwMDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbiBiZSB1c2VkIHRvIGxpbWl0IHRoZSBtYXhpbXVtIG51bWJlciBvZiBmaWxlcyB0aGF0IHdpbGwgYmUgaGFuZGxlZCBieSB0aGlzIERyb3B6b25lXG4gICAgICAgICAqL1xuICAgICAgICBtYXhGaWxlczogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gb3B0aW9uYWwgb2JqZWN0IHRvIHNlbmQgYWRkaXRpb25hbCBoZWFkZXJzIHRvIHRoZSBzZXJ2ZXIuIEVnOlxuICAgICAgICAgKiBgeyBcIk15LUF3ZXNvbWUtSGVhZGVyXCI6IFwiaGVhZGVyIHZhbHVlXCIgfWBcbiAgICAgICAgICovXG4gICAgICAgIGhlYWRlcnM6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGB0cnVlYCwgdGhlIGRyb3B6b25lIGVsZW1lbnQgaXRzZWxmIHdpbGwgYmUgY2xpY2thYmxlLCBpZiBgZmFsc2VgXG4gICAgICAgICAqIG5vdGhpbmcgd2lsbCBiZSBjbGlja2FibGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGFuIEhUTUwgZWxlbWVudCwgYSBDU1Mgc2VsZWN0b3IgKGZvciBtdWx0aXBsZSBlbGVtZW50cylcbiAgICAgICAgICogb3IgYW4gYXJyYXkgb2YgdGhvc2UuIEluIHRoYXQgY2FzZSwgYWxsIG9mIHRob3NlIGVsZW1lbnRzIHdpbGwgdHJpZ2dlciBhblxuICAgICAgICAgKiB1cGxvYWQgd2hlbiBjbGlja2VkLlxuICAgICAgICAgKi9cbiAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIGhpZGRlbiBmaWxlcyBpbiBkaXJlY3RvcmllcyBzaG91bGQgYmUgaWdub3JlZC5cbiAgICAgICAgICovXG4gICAgICAgIGlnbm9yZUhpZGRlbkZpbGVzOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBgYWNjZXB0YCBjaGVja3MgdGhlIGZpbGUncyBtaW1lIHR5cGUgb3JcbiAgICAgICAgICogZXh0ZW5zaW9uIGFnYWluc3QgdGhpcyBsaXN0LiBUaGlzIGlzIGEgY29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgbWltZVxuICAgICAgICAgKiB0eXBlcyBvciBmaWxlIGV4dGVuc2lvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEVnLjogYGltYWdlLyosYXBwbGljYXRpb24vcGRmLC5wc2RgXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBEcm9wem9uZSBpcyBgY2xpY2thYmxlYCB0aGlzIG9wdGlvbiB3aWxsIGFsc28gYmUgdXNlZCBhc1xuICAgICAgICAgKiBbYGFjY2VwdGBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvSFRNTC9FbGVtZW50L2lucHV0I2F0dHItYWNjZXB0KVxuICAgICAgICAgKiBwYXJhbWV0ZXIgb24gdGhlIGhpZGRlbiBmaWxlIGlucHV0IGFzIHdlbGwuXG4gICAgICAgICAqL1xuICAgICAgICBhY2NlcHRlZEZpbGVzOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAqKkRlcHJlY2F0ZWQhKipcbiAgICAgICAgICogVXNlIGFjY2VwdGVkRmlsZXMgaW5zdGVhZC5cbiAgICAgICAgICovXG4gICAgICAgIGFjY2VwdGVkTWltZVR5cGVzOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBmYWxzZSwgZmlsZXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgcXVldWUgYnV0IHRoZSBxdWV1ZSB3aWxsIG5vdCBiZVxuICAgICAgICAgKiBwcm9jZXNzZWQgYXV0b21hdGljYWxseS5cbiAgICAgICAgICogVGhpcyBjYW4gYmUgdXNlZnVsIGlmIHlvdSBuZWVkIHNvbWUgYWRkaXRpb25hbCB1c2VyIGlucHV0IGJlZm9yZSBzZW5kaW5nXG4gICAgICAgICAqIGZpbGVzIChvciBpZiB5b3Ugd2FudCB3YW50IGFsbCBmaWxlcyBzZW50IGF0IG9uY2UpLlxuICAgICAgICAgKiBJZiB5b3UncmUgcmVhZHkgdG8gc2VuZCB0aGUgZmlsZSBzaW1wbHkgY2FsbCBgbXlEcm9wem9uZS5wcm9jZXNzUXVldWUoKWAuXG4gICAgICAgICAqXG4gICAgICAgICAqIFNlZSB0aGUgW2VucXVldWluZyBmaWxlIHVwbG9hZHNdKCNlbnF1ZXVpbmctZmlsZS11cGxvYWRzKSBkb2N1bWVudGF0aW9uXG4gICAgICAgICAqIHNlY3Rpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBmYWxzZSwgZmlsZXMgYWRkZWQgdG8gdGhlIGRyb3B6b25lIHdpbGwgbm90IGJlIHF1ZXVlZCBieSBkZWZhdWx0LlxuICAgICAgICAgKiBZb3UnbGwgaGF2ZSB0byBjYWxsIGBlbnF1ZXVlRmlsZShmaWxlKWAgbWFudWFsbHkuXG4gICAgICAgICAqL1xuICAgICAgICBhdXRvUXVldWU6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGB0cnVlYCwgdGhpcyB3aWxsIGFkZCBhIGxpbmsgdG8gZXZlcnkgZmlsZSBwcmV2aWV3IHRvIHJlbW92ZSBvciBjYW5jZWwgKGlmXG4gICAgICAgICAqIGFscmVhZHkgdXBsb2FkaW5nKSB0aGUgZmlsZS4gVGhlIGBkaWN0Q2FuY2VsVXBsb2FkYCwgYGRpY3RDYW5jZWxVcGxvYWRDb25maXJtYXRpb25gXG4gICAgICAgICAqIGFuZCBgZGljdFJlbW92ZUZpbGVgIG9wdGlvbnMgYXJlIHVzZWQgZm9yIHRoZSB3b3JkaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgYWRkUmVtb3ZlTGlua3M6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZpbmVzIHdoZXJlIHRvIGRpc3BsYXkgdGhlIGZpbGUgcHJldmlld3Mg4oCTIGlmIGBudWxsYCB0aGVcbiAgICAgICAgICogRHJvcHpvbmUgZWxlbWVudCBpdHNlbGYgaXMgdXNlZC4gQ2FuIGJlIGEgcGxhaW4gYEhUTUxFbGVtZW50YCBvciBhIENTU1xuICAgICAgICAgKiBzZWxlY3Rvci4gVGhlIGVsZW1lbnQgc2hvdWxkIGhhdmUgdGhlIGBkcm9wem9uZS1wcmV2aWV3c2AgY2xhc3Mgc29cbiAgICAgICAgICogdGhlIHByZXZpZXdzIGFyZSBkaXNwbGF5ZWQgcHJvcGVybHkuXG4gICAgICAgICAqL1xuICAgICAgICBwcmV2aWV3c0NvbnRhaW5lcjogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBpcyB0aGUgZWxlbWVudCB0aGUgaGlkZGVuIGlucHV0IGZpZWxkICh3aGljaCBpcyB1c2VkIHdoZW4gY2xpY2tpbmcgb24gdGhlXG4gICAgICAgICAqIGRyb3B6b25lIHRvIHRyaWdnZXIgZmlsZSBzZWxlY3Rpb24pIHdpbGwgYmUgYXBwZW5kZWQgdG8uIFRoaXMgbWlnaHRcbiAgICAgICAgICogYmUgaW1wb3J0YW50IGluIGNhc2UgeW91IHVzZSBmcmFtZXdvcmtzIHRvIHN3aXRjaCB0aGUgY29udGVudCBvZiB5b3VyIHBhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIENhbiBiZSBhIHNlbGVjdG9yIHN0cmluZywgb3IgYW4gZWxlbWVudCBkaXJlY3RseS5cbiAgICAgICAgICovXG4gICAgICAgIGhpZGRlbklucHV0Q29udGFpbmVyOiBcImJvZHlcIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgbnVsbCwgbm8gY2FwdHVyZSB0eXBlIHdpbGwgYmUgc3BlY2lmaWVkXG4gICAgICAgICAqIElmIGNhbWVyYSwgbW9iaWxlIGRldmljZXMgd2lsbCBza2lwIHRoZSBmaWxlIHNlbGVjdGlvbiBhbmQgY2hvb3NlIGNhbWVyYVxuICAgICAgICAgKiBJZiBtaWNyb3Bob25lLCBtb2JpbGUgZGV2aWNlcyB3aWxsIHNraXAgdGhlIGZpbGUgc2VsZWN0aW9uIGFuZCBjaG9vc2UgdGhlIG1pY3JvcGhvbmVcbiAgICAgICAgICogSWYgY2FtY29yZGVyLCBtb2JpbGUgZGV2aWNlcyB3aWxsIHNraXAgdGhlIGZpbGUgc2VsZWN0aW9uIGFuZCBjaG9vc2UgdGhlIGNhbWVyYSBpbiB2aWRlbyBtb2RlXG4gICAgICAgICAqIE9uIGFwcGxlIGRldmljZXMgbXVsdGlwbGUgbXVzdCBiZSBzZXQgdG8gZmFsc2UuICBBY2NlcHRlZEZpbGVzIG1heSBuZWVkIHRvXG4gICAgICAgICAqIGJlIHNldCB0byBhbiBhcHByb3ByaWF0ZSBtaW1lIHR5cGUgKGUuZy4gXCJpbWFnZS8qXCIsIFwiYXVkaW8vKlwiLCBvciBcInZpZGVvLypcIikuXG4gICAgICAgICAqL1xuICAgICAgICBjYXB0dXJlOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAqKkRlcHJlY2F0ZWQqKi4gVXNlIGByZW5hbWVGaWxlYCBpbnN0ZWFkLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVuYW1lRmlsZW5hbWU6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIGJlZm9yZSB0aGUgZmlsZSBpcyB1cGxvYWRlZCB0byB0aGUgc2VydmVyIGFuZCByZW5hbWVzIHRoZSBmaWxlLlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIGdldHMgdGhlIGBGaWxlYCBhcyBhcmd1bWVudCBhbmQgY2FuIHVzZSB0aGUgYGZpbGUubmFtZWAuIFRoZSBhY3R1YWwgbmFtZSBvZiB0aGVcbiAgICAgICAgICogZmlsZSB0aGF0IGdldHMgdXNlZCBkdXJpbmcgdGhlIHVwbG9hZCBjYW4gYmUgYWNjZXNzZWQgdGhyb3VnaCBgZmlsZS51cGxvYWQuZmlsZW5hbWVgLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVuYW1lRmlsZTogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYHRydWVgIHRoZSBmYWxsYmFjayB3aWxsIGJlIGZvcmNlZC4gVGhpcyBpcyB2ZXJ5IHVzZWZ1bCB0byB0ZXN0IHlvdXIgc2VydmVyXG4gICAgICAgICAqIGltcGxlbWVudGF0aW9ucyBmaXJzdCBhbmQgbWFrZSBzdXJlIHRoYXQgZXZlcnl0aGluZyB3b3JrcyBhc1xuICAgICAgICAgKiBleHBlY3RlZCB3aXRob3V0IGRyb3B6b25lIGlmIHlvdSBleHBlcmllbmNlIHByb2JsZW1zLCBhbmQgdG8gdGVzdFxuICAgICAgICAgKiBob3cgeW91ciBmYWxsYmFja3Mgd2lsbCBsb29rLlxuICAgICAgICAgKi9cbiAgICAgICAgZm9yY2VGYWxsYmFjazogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0ZXh0IHVzZWQgYmVmb3JlIGFueSBmaWxlcyBhcmUgZHJvcHBlZC5cbiAgICAgICAgICovXG4gICAgICAgIGRpY3REZWZhdWx0TWVzc2FnZTogXCJEcm9wIGZpbGVzIGhlcmUgdG8gdXBsb2FkXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0ZXh0IHRoYXQgcmVwbGFjZXMgdGhlIGRlZmF1bHQgbWVzc2FnZSB0ZXh0IGl0IHRoZSBicm93c2VyIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0RmFsbGJhY2tNZXNzYWdlOiBcIllvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGRyYWcnbidkcm9wIGZpbGUgdXBsb2Fkcy5cIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHRleHQgdGhhdCB3aWxsIGJlIGFkZGVkIGJlZm9yZSB0aGUgZmFsbGJhY2sgZm9ybS5cbiAgICAgICAgICogSWYgeW91IHByb3ZpZGUgYSAgZmFsbGJhY2sgZWxlbWVudCB5b3Vyc2VsZiwgb3IgaWYgdGhpcyBvcHRpb24gaXMgYG51bGxgIHRoaXMgd2lsbFxuICAgICAgICAgKiBiZSBpZ25vcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdEZhbGxiYWNrVGV4dDogXCJQbGVhc2UgdXNlIHRoZSBmYWxsYmFjayBmb3JtIGJlbG93IHRvIHVwbG9hZCB5b3VyIGZpbGVzIGxpa2UgaW4gdGhlIG9sZGVuIGRheXMuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZSBmaWxlc2l6ZSBpcyB0b28gYmlnLlxuICAgICAgICAgKiBge3tmaWxlc2l6ZX19YCBhbmQgYHt7bWF4RmlsZXNpemV9fWAgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSByZXNwZWN0aXZlIGNvbmZpZ3VyYXRpb24gdmFsdWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdEZpbGVUb29CaWc6IFwiRmlsZSBpcyB0b28gYmlnICh7e2ZpbGVzaXplfX1NaUIpLiBNYXggZmlsZXNpemU6IHt7bWF4RmlsZXNpemV9fU1pQi5cIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhlIGZpbGUgZG9lc24ndCBtYXRjaCB0aGUgZmlsZSB0eXBlLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdEludmFsaWRGaWxlVHlwZTogXCJZb3UgY2FuJ3QgdXBsb2FkIGZpbGVzIG9mIHRoaXMgdHlwZS5cIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhlIHNlcnZlciByZXNwb25zZSB3YXMgaW52YWxpZC5cbiAgICAgICAgICogYHt7c3RhdHVzQ29kZX19YCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHNlcnZlcnMgc3RhdHVzIGNvZGUuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0UmVzcG9uc2VFcnJvcjogXCJTZXJ2ZXIgcmVzcG9uZGVkIHdpdGgge3tzdGF0dXNDb2RlfX0gY29kZS5cIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYGFkZFJlbW92ZUxpbmtzYCBpcyB0cnVlLCB0aGUgdGV4dCB0byBiZSB1c2VkIGZvciB0aGUgY2FuY2VsIHVwbG9hZCBsaW5rLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdENhbmNlbFVwbG9hZDogXCJDYW5jZWwgdXBsb2FkXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0ZXh0IHRoYXQgaXMgZGlzcGxheWVkIGlmIGFuIHVwbG9hZCB3YXMgbWFudWFsbHkgY2FuY2VsZWRcbiAgICAgICAgICovXG4gICAgICAgIGRpY3RVcGxvYWRDYW5jZWxlZDogXCJVcGxvYWQgY2FuY2VsZWQuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGBhZGRSZW1vdmVMaW5rc2AgaXMgdHJ1ZSwgdGhlIHRleHQgdG8gYmUgdXNlZCBmb3IgY29uZmlybWF0aW9uIHdoZW4gY2FuY2VsbGluZyB1cGxvYWQuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0Q2FuY2VsVXBsb2FkQ29uZmlybWF0aW9uOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBjYW5jZWwgdGhpcyB1cGxvYWQ/XCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGBhZGRSZW1vdmVMaW5rc2AgaXMgdHJ1ZSwgdGhlIHRleHQgdG8gYmUgdXNlZCB0byByZW1vdmUgYSBmaWxlLlxuICAgICAgICAgKi9cbiAgICAgICAgZGljdFJlbW92ZUZpbGU6IFwiUmVtb3ZlIGZpbGVcIixcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhpcyBpcyBub3QgbnVsbCwgdGhlbiB0aGUgdXNlciB3aWxsIGJlIHByb21wdGVkIGJlZm9yZSByZW1vdmluZyBhIGZpbGUuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0UmVtb3ZlRmlsZUNvbmZpcm1hdGlvbjogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGxheWVkIGlmIGBtYXhGaWxlc2AgaXMgc3QgYW5kIGV4Y2VlZGVkLlxuICAgICAgICAgKiBUaGUgc3RyaW5nIGB7e21heEZpbGVzfX1gIHdpbGwgYmUgcmVwbGFjZWQgYnkgdGhlIGNvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0TWF4RmlsZXNFeGNlZWRlZDogXCJZb3UgY2FuIG5vdCB1cGxvYWQgYW55IG1vcmUgZmlsZXMuXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFsbG93cyB5b3UgdG8gdHJhbnNsYXRlIHRoZSBkaWZmZXJlbnQgdW5pdHMuIFN0YXJ0aW5nIHdpdGggYHRiYCBmb3IgdGVyYWJ5dGVzIGFuZCBnb2luZyBkb3duIHRvXG4gICAgICAgICAqIGBiYCBmb3IgYnl0ZXMuXG4gICAgICAgICAqL1xuICAgICAgICBkaWN0RmlsZVNpemVVbml0czogeyB0YjogXCJUQlwiLCBnYjogXCJHQlwiLCBtYjogXCJNQlwiLCBrYjogXCJLQlwiLCBiOiBcImJcIiB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsbGVkIHdoZW4gZHJvcHpvbmUgaW5pdGlhbGl6ZWRcbiAgICAgICAgICogWW91IGNhbiBhZGQgZXZlbnQgbGlzdGVuZXJzIGhlcmVcbiAgICAgICAgICovXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7fSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYW4gYmUgYW4gKipvYmplY3QqKiBvZiBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgdG8gdHJhbnNmZXIgdG8gdGhlIHNlcnZlciwgKipvcioqIGEgYEZ1bmN0aW9uYFxuICAgICAgICAgKiB0aGF0IGdldHMgaW52b2tlZCB3aXRoIHRoZSBgZmlsZXNgLCBgeGhyYCBhbmQsIGlmIGl0J3MgYSBjaHVua2VkIHVwbG9hZCwgYGNodW5rYCBhcmd1bWVudHMuIEluIGNhc2VcbiAgICAgICAgICogb2YgYSBmdW5jdGlvbiwgdGhpcyBuZWVkcyB0byByZXR1cm4gYSBtYXAuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGRvZXMgbm90aGluZyBmb3Igbm9ybWFsIHVwbG9hZHMsIGJ1dCBhZGRzIHJlbGV2YW50IGluZm9ybWF0aW9uIGZvclxuICAgICAgICAgKiBjaHVua2VkIHVwbG9hZHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIHNhbWUgYXMgYWRkaW5nIGhpZGRlbiBpbnB1dCBmaWVsZHMgaW4gdGhlIGZvcm0gZWxlbWVudC5cbiAgICAgICAgICovXG4gICAgICAgIHBhcmFtczogZnVuY3Rpb24gcGFyYW1zKGZpbGVzLCB4aHIsIGNodW5rKSB7XG4gICAgICAgICAgaWYgKGNodW5rKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBkenV1aWQ6IGNodW5rLmZpbGUudXBsb2FkLnV1aWQsXG4gICAgICAgICAgICAgIGR6Y2h1bmtpbmRleDogY2h1bmsuaW5kZXgsXG4gICAgICAgICAgICAgIGR6dG90YWxmaWxlc2l6ZTogY2h1bmsuZmlsZS5zaXplLFxuICAgICAgICAgICAgICBkemNodW5rc2l6ZTogdGhpcy5vcHRpb25zLmNodW5rU2l6ZSxcbiAgICAgICAgICAgICAgZHp0b3RhbGNodW5rY291bnQ6IGNodW5rLmZpbGUudXBsb2FkLnRvdGFsQ2h1bmtDb3VudCxcbiAgICAgICAgICAgICAgZHpjaHVua2J5dGVvZmZzZXQ6IGNodW5rLmluZGV4ICogdGhpcy5vcHRpb25zLmNodW5rU2l6ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBmdW5jdGlvbiB0aGF0IGdldHMgYSBbZmlsZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9ET00vRmlsZSlcbiAgICAgICAgICogYW5kIGEgYGRvbmVgIGZ1bmN0aW9uIGFzIHBhcmFtZXRlcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBkb25lIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIHRoZSBmaWxlIGlzIFwiYWNjZXB0ZWRcIiBhbmQgd2lsbFxuICAgICAgICAgKiBiZSBwcm9jZXNzZWQuIElmIHlvdSBwYXNzIGFuIGVycm9yIG1lc3NhZ2UsIHRoZSBmaWxlIGlzIHJlamVjdGVkLCBhbmQgdGhlIGVycm9yXG4gICAgICAgICAqIG1lc3NhZ2Ugd2lsbCBiZSBkaXNwbGF5ZWQuXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBub3QgYmUgY2FsbGVkIGlmIHRoZSBmaWxlIGlzIHRvbyBiaWcgb3IgZG9lc24ndCBtYXRjaCB0aGUgbWltZSB0eXBlcy5cbiAgICAgICAgICovXG4gICAgICAgIGFjY2VwdDogZnVuY3Rpb24gYWNjZXB0KGZpbGUsIGRvbmUpIHtcbiAgICAgICAgICByZXR1cm4gZG9uZSgpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIGFsbCBjaHVua3MgaGF2ZSBiZWVuIHVwbG9hZGVkIGZvciBhIGZpbGUuXG4gICAgICAgICAqIEl0IGdldHMgdGhlIGZpbGUgZm9yIHdoaWNoIHRoZSBjaHVua3MgaGF2ZSBiZWVuIHVwbG9hZGVkIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIsXG4gICAgICAgICAqIGFuZCB0aGUgYGRvbmVgIGZ1bmN0aW9uIGFzIHNlY29uZC4gYGRvbmUoKWAgbmVlZHMgdG8gYmUgaW52b2tlZCB3aGVuIGV2ZXJ5dGhpbmdcbiAgICAgICAgICogbmVlZGVkIHRvIGZpbmlzaCB0aGUgdXBsb2FkIHByb2Nlc3MgaXMgZG9uZS5cbiAgICAgICAgICovXG4gICAgICAgIGNodW5rc1VwbG9hZGVkOiBmdW5jdGlvbiBjaHVua3NVcGxvYWRlZChmaWxlLCBkb25lKSB7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGNhbGxlZCB3aGVuIHRoZSBicm93c2VyIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgICAgICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIHNob3dzIHRoZSBmYWxsYmFjayBpbnB1dCBmaWVsZCBhbmQgYWRkc1xuICAgICAgICAgKiBhIHRleHQuXG4gICAgICAgICAqL1xuICAgICAgICBmYWxsYmFjazogZnVuY3Rpb24gZmFsbGJhY2soKSB7XG4gICAgICAgICAgLy8gVGhpcyBjb2RlIHNob3VsZCBwYXNzIGluIElFNy4uLiA6KFxuICAgICAgICAgIHZhciBtZXNzYWdlRWxlbWVudCA9IHZvaWQgMDtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lID0gdGhpcy5lbGVtZW50LmNsYXNzTmFtZSArIFwiIGR6LWJyb3dzZXItbm90LXN1cHBvcnRlZFwiO1xuXG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRpdlwiKSwgX2lzQXJyYXkyID0gdHJ1ZSwgX2kyID0gMCwgX2l0ZXJhdG9yMiA9IF9pc0FycmF5MiA/IF9pdGVyYXRvcjIgOiBfaXRlcmF0b3IyW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjI7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheTIpIHtcbiAgICAgICAgICAgICAgaWYgKF9pMiA+PSBfaXRlcmF0b3IyLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWYyID0gX2l0ZXJhdG9yMltfaTIrK107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfaTIgPSBfaXRlcmF0b3IyLm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pMi5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZjIgPSBfaTIudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjaGlsZCA9IF9yZWYyO1xuXG4gICAgICAgICAgICBpZiAoLyhefCApZHotbWVzc2FnZSgkfCApLy50ZXN0KGNoaWxkLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnQgPSBjaGlsZDtcbiAgICAgICAgICAgICAgY2hpbGQuY2xhc3NOYW1lID0gXCJkei1tZXNzYWdlXCI7IC8vIFJlbW92ZXMgdGhlICdkei1kZWZhdWx0JyBjbGFzc1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFtZXNzYWdlRWxlbWVudCkge1xuICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnQgPSBEcm9wem9uZS5jcmVhdGVFbGVtZW50KFwiPGRpdiBjbGFzcz1cXFwiZHotbWVzc2FnZVxcXCI+PHNwYW4+PC9zcGFuPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHNwYW4gPSBtZXNzYWdlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNwYW5cIilbMF07XG4gICAgICAgICAgaWYgKHNwYW4pIHtcbiAgICAgICAgICAgIGlmIChzcGFuLnRleHRDb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5kaWN0RmFsbGJhY2tNZXNzYWdlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzcGFuLmlubmVyVGV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHNwYW4uaW5uZXJUZXh0ID0gdGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja01lc3NhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmdldEZhbGxiYWNrRm9ybSgpKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGNhbGxlZCB0byBjYWxjdWxhdGUgdGhlIHRodW1ibmFpbCBkaW1lbnNpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJdCBnZXRzIGBmaWxlYCwgYHdpZHRoYCBhbmQgYGhlaWdodGAgKGJvdGggbWF5IGJlIGBudWxsYCkgYXMgcGFyYW1ldGVycyBhbmQgbXVzdCByZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmc6XG4gICAgICAgICAqXG4gICAgICAgICAqICAtIGBzcmNXaWR0aGAgJiBgc3JjSGVpZ2h0YCAocmVxdWlyZWQpXG4gICAgICAgICAqICAtIGB0cmdXaWR0aGAgJiBgdHJnSGVpZ2h0YCAocmVxdWlyZWQpXG4gICAgICAgICAqICAtIGBzcmNYYCAmIGBzcmNZYCAob3B0aW9uYWwsIGRlZmF1bHQgYDBgKVxuICAgICAgICAgKiAgLSBgdHJnWGAgJiBgdHJnWWAgKG9wdGlvbmFsLCBkZWZhdWx0IGAwYClcbiAgICAgICAgICpcbiAgICAgICAgICogVGhvc2UgdmFsdWVzIGFyZSBnb2luZyB0byBiZSB1c2VkIGJ5IGBjdHguZHJhd0ltYWdlKClgLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzaXplOiBmdW5jdGlvbiByZXNpemUoZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kKSB7XG4gICAgICAgICAgdmFyIGluZm8gPSB7XG4gICAgICAgICAgICBzcmNYOiAwLFxuICAgICAgICAgICAgc3JjWTogMCxcbiAgICAgICAgICAgIHNyY1dpZHRoOiBmaWxlLndpZHRoLFxuICAgICAgICAgICAgc3JjSGVpZ2h0OiBmaWxlLmhlaWdodFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgc3JjUmF0aW8gPSBmaWxlLndpZHRoIC8gZmlsZS5oZWlnaHQ7XG5cbiAgICAgICAgICAvLyBBdXRvbWF0aWNhbGx5IGNhbGN1bGF0ZSBkaW1lbnNpb25zIGlmIG5vdCBzcGVjaWZpZWRcbiAgICAgICAgICBpZiAod2lkdGggPT0gbnVsbCAmJiBoZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgd2lkdGggPSBpbmZvLnNyY1dpZHRoO1xuICAgICAgICAgICAgaGVpZ2h0ID0gaW5mby5zcmNIZWlnaHQ7XG4gICAgICAgICAgfSBlbHNlIGlmICh3aWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICB3aWR0aCA9IGhlaWdodCAqIHNyY1JhdGlvO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gc3JjUmF0aW87XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTWFrZSBzdXJlIGltYWdlcyBhcmVuJ3QgdXBzY2FsZWRcbiAgICAgICAgICB3aWR0aCA9IE1hdGgubWluKHdpZHRoLCBpbmZvLnNyY1dpZHRoKTtcbiAgICAgICAgICBoZWlnaHQgPSBNYXRoLm1pbihoZWlnaHQsIGluZm8uc3JjSGVpZ2h0KTtcblxuICAgICAgICAgIHZhciB0cmdSYXRpbyA9IHdpZHRoIC8gaGVpZ2h0O1xuXG4gICAgICAgICAgaWYgKGluZm8uc3JjV2lkdGggPiB3aWR0aCB8fCBpbmZvLnNyY0hlaWdodCA+IGhlaWdodCkge1xuICAgICAgICAgICAgLy8gSW1hZ2UgaXMgYmlnZ2VyIGFuZCBuZWVkcyByZXNjYWxpbmdcbiAgICAgICAgICAgIGlmIChyZXNpemVNZXRob2QgPT09ICdjcm9wJykge1xuICAgICAgICAgICAgICBpZiAoc3JjUmF0aW8gPiB0cmdSYXRpbykge1xuICAgICAgICAgICAgICAgIGluZm8uc3JjSGVpZ2h0ID0gZmlsZS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgaW5mby5zcmNXaWR0aCA9IGluZm8uc3JjSGVpZ2h0ICogdHJnUmF0aW87XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5mby5zcmNXaWR0aCA9IGZpbGUud2lkdGg7XG4gICAgICAgICAgICAgICAgaW5mby5zcmNIZWlnaHQgPSBpbmZvLnNyY1dpZHRoIC8gdHJnUmF0aW87XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzaXplTWV0aG9kID09PSAnY29udGFpbicpIHtcbiAgICAgICAgICAgICAgLy8gTWV0aG9kICdjb250YWluJ1xuICAgICAgICAgICAgICBpZiAoc3JjUmF0aW8gPiB0cmdSYXRpbykge1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IHdpZHRoIC8gc3JjUmF0aW87XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd2lkdGggPSBoZWlnaHQgKiBzcmNSYXRpbztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biByZXNpemVNZXRob2QgJ1wiICsgcmVzaXplTWV0aG9kICsgXCInXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGluZm8uc3JjWCA9IChmaWxlLndpZHRoIC0gaW5mby5zcmNXaWR0aCkgLyAyO1xuICAgICAgICAgIGluZm8uc3JjWSA9IChmaWxlLmhlaWdodCAtIGluZm8uc3JjSGVpZ2h0KSAvIDI7XG5cbiAgICAgICAgICBpbmZvLnRyZ1dpZHRoID0gd2lkdGg7XG4gICAgICAgICAgaW5mby50cmdIZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYW4gYmUgdXNlZCB0byB0cmFuc2Zvcm0gdGhlIGZpbGUgKGZvciBleGFtcGxlLCByZXNpemUgYW4gaW1hZ2UgaWYgbmVjZXNzYXJ5KS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gdXNlcyBgcmVzaXplV2lkdGhgIGFuZCBgcmVzaXplSGVpZ2h0YCAoaWYgcHJvdmlkZWQpIGFuZCByZXNpemVzXG4gICAgICAgICAqIGltYWdlcyBhY2NvcmRpbmcgdG8gdGhvc2UgZGltZW5zaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogR2V0cyB0aGUgYGZpbGVgIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIsIGFuZCBhIGBkb25lKClgIGZ1bmN0aW9uIGFzIHRoZSBzZWNvbmQsIHRoYXQgbmVlZHNcbiAgICAgICAgICogdG8gYmUgaW52b2tlZCB3aXRoIHRoZSBmaWxlIHdoZW4gdGhlIHRyYW5zZm9ybWF0aW9uIGlzIGRvbmUuXG4gICAgICAgICAqL1xuICAgICAgICB0cmFuc2Zvcm1GaWxlOiBmdW5jdGlvbiB0cmFuc2Zvcm1GaWxlKGZpbGUsIGRvbmUpIHtcbiAgICAgICAgICBpZiAoKHRoaXMub3B0aW9ucy5yZXNpemVXaWR0aCB8fCB0aGlzLm9wdGlvbnMucmVzaXplSGVpZ2h0KSAmJiBmaWxlLnR5cGUubWF0Y2goL2ltYWdlLiovKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzaXplSW1hZ2UoZmlsZSwgdGhpcy5vcHRpb25zLnJlc2l6ZVdpZHRoLCB0aGlzLm9wdGlvbnMucmVzaXplSGVpZ2h0LCB0aGlzLm9wdGlvbnMucmVzaXplTWV0aG9kLCBkb25lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRvbmUoZmlsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgc3RyaW5nIHRoYXQgY29udGFpbnMgdGhlIHRlbXBsYXRlIHVzZWQgZm9yIGVhY2ggZHJvcHBlZFxuICAgICAgICAgKiBmaWxlLiBDaGFuZ2UgaXQgdG8gZnVsZmlsbCB5b3VyIG5lZWRzIGJ1dCBtYWtlIHN1cmUgdG8gcHJvcGVybHlcbiAgICAgICAgICogcHJvdmlkZSBhbGwgZWxlbWVudHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHlvdSB3YW50IHRvIHVzZSBhbiBhY3R1YWwgSFRNTCBlbGVtZW50IGluc3RlYWQgb2YgcHJvdmlkaW5nIGEgU3RyaW5nXG4gICAgICAgICAqIGFzIGEgY29uZmlnIG9wdGlvbiwgeW91IGNvdWxkIGNyZWF0ZSBhIGRpdiB3aXRoIHRoZSBpZCBgdHBsYCxcbiAgICAgICAgICogcHV0IHRoZSB0ZW1wbGF0ZSBpbnNpZGUgaXQgYW5kIHByb3ZpZGUgdGhlIGVsZW1lbnQgbGlrZSB0aGlzOlxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgZG9jdW1lbnRcbiAgICAgICAgICogICAgICAgLnF1ZXJ5U2VsZWN0b3IoJyN0cGwnKVxuICAgICAgICAgKiAgICAgICAuaW5uZXJIVE1MXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBwcmV2aWV3VGVtcGxhdGU6IFwiPGRpdiBjbGFzcz1cXFwiZHotcHJldmlldyBkei1maWxlLXByZXZpZXdcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotaW1hZ2VcXFwiPjxpbWcgZGF0YS1kei10aHVtYm5haWwgLz48L2Rpdj5cXG4gIDxkaXYgY2xhc3M9XFxcImR6LWRldGFpbHNcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJkei1zaXplXFxcIj48c3BhbiBkYXRhLWR6LXNpemU+PC9zcGFuPjwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJkei1maWxlbmFtZVxcXCI+PHNwYW4gZGF0YS1kei1uYW1lPjwvc3Bhbj48L2Rpdj5cXG4gIDwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotcHJvZ3Jlc3NcXFwiPjxzcGFuIGNsYXNzPVxcXCJkei11cGxvYWRcXFwiIGRhdGEtZHotdXBsb2FkcHJvZ3Jlc3M+PC9zcGFuPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotZXJyb3ItbWVzc2FnZVxcXCI+PHNwYW4gZGF0YS1kei1lcnJvcm1lc3NhZ2U+PC9zcGFuPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotc3VjY2Vzcy1tYXJrXFxcIj5cXG4gICAgPHN2ZyB3aWR0aD1cXFwiNTRweFxcXCIgaGVpZ2h0PVxcXCI1NHB4XFxcIiB2aWV3Qm94PVxcXCIwIDAgNTQgNTRcXFwiIHZlcnNpb249XFxcIjEuMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgeG1sbnM6c2tldGNoPVxcXCJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnNcXFwiPlxcbiAgICAgIDx0aXRsZT5DaGVjazwvdGl0bGU+XFxuICAgICAgPGRlZnM+PC9kZWZzPlxcbiAgICAgIDxnIGlkPVxcXCJQYWdlLTFcXFwiIHN0cm9rZT1cXFwibm9uZVxcXCIgc3Ryb2tlLXdpZHRoPVxcXCIxXFxcIiBmaWxsPVxcXCJub25lXFxcIiBmaWxsLXJ1bGU9XFxcImV2ZW5vZGRcXFwiIHNrZXRjaDp0eXBlPVxcXCJNU1BhZ2VcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTIzLjUsMzEuODQzMTQ1OCBMMTcuNTg1MjQxOSwyNS45MjgzODc3IEMxNi4wMjQ4MjUzLDI0LjM2Nzk3MTEgMTMuNDkxMDI5NCwyNC4zNjY4MzUgMTEuOTI4OTMyMiwyNS45Mjg5MzIyIEMxMC4zNzAwMTM2LDI3LjQ4Nzg1MDggMTAuMzY2NTkxMiwzMC4wMjM0NDU1IDExLjkyODM4NzcsMzEuNTg1MjQxOSBMMjAuNDE0NzU4MSw0MC4wNzE2MTIzIEMyMC41MTMzOTk5LDQwLjE3MDI1NDEgMjAuNjE1OTMxNSw0MC4yNjI2NjQ5IDIwLjcyMTg2MTUsNDAuMzQ4ODQzNSBDMjIuMjgzNTY2OSw0MS44NzI1NjUxIDI0Ljc5NDIzNCw0MS44NjI2MjAyIDI2LjM0NjE1NjQsNDAuMzEwNjk3OCBMNDMuMzEwNjk3OCwyMy4zNDYxNTY0IEM0NC44NzcxMDIxLDIxLjc3OTc1MjEgNDQuODc1ODA1NywxOS4yNDgzODg3IDQzLjMxMzcwODUsMTcuNjg2MjkxNSBDNDEuNzU0Nzg5OSwxNi4xMjczNzI5IDM5LjIxNzYwMzUsMTYuMTI1NTQyMiAzNy42NTM4NDM2LDE3LjY4OTMwMjIgTDIzLjUsMzEuODQzMTQ1OCBaIE0yNyw1MyBDNDEuMzU5NDAzNSw1MyA1Myw0MS4zNTk0MDM1IDUzLDI3IEM1MywxMi42NDA1OTY1IDQxLjM1OTQwMzUsMSAyNywxIEMxMi42NDA1OTY1LDEgMSwxMi42NDA1OTY1IDEsMjcgQzEsNDEuMzU5NDAzNSAxMi42NDA1OTY1LDUzIDI3LDUzIFpcXFwiIGlkPVxcXCJPdmFsLTJcXFwiIHN0cm9rZS1vcGFjaXR5PVxcXCIwLjE5ODc5NDE1OFxcXCIgc3Ryb2tlPVxcXCIjNzQ3NDc0XFxcIiBmaWxsLW9wYWNpdHk9XFxcIjAuODE2NTE5NDc1XFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNTaGFwZUdyb3VwXFxcIj48L3BhdGg+XFxuICAgICAgPC9nPlxcbiAgICA8L3N2Zz5cXG4gIDwvZGl2PlxcbiAgPGRpdiBjbGFzcz1cXFwiZHotZXJyb3ItbWFya1xcXCI+XFxuICAgIDxzdmcgd2lkdGg9XFxcIjU0cHhcXFwiIGhlaWdodD1cXFwiNTRweFxcXCIgdmlld0JveD1cXFwiMCAwIDU0IDU0XFxcIiB2ZXJzaW9uPVxcXCIxLjFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHhtbG5zOnNrZXRjaD1cXFwiaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zXFxcIj5cXG4gICAgICA8dGl0bGU+RXJyb3I8L3RpdGxlPlxcbiAgICAgIDxkZWZzPjwvZGVmcz5cXG4gICAgICA8ZyBpZD1cXFwiUGFnZS0xXFxcIiBzdHJva2U9XFxcIm5vbmVcXFwiIHN0cm9rZS13aWR0aD1cXFwiMVxcXCIgZmlsbD1cXFwibm9uZVxcXCIgZmlsbC1ydWxlPVxcXCJldmVub2RkXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNQYWdlXFxcIj5cXG4gICAgICAgIDxnIGlkPVxcXCJDaGVjay0rLU92YWwtMlxcXCIgc2tldGNoOnR5cGU9XFxcIk1TTGF5ZXJHcm91cFxcXCIgc3Ryb2tlPVxcXCIjNzQ3NDc0XFxcIiBzdHJva2Utb3BhY2l0eT1cXFwiMC4xOTg3OTQxNThcXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZpbGwtb3BhY2l0eT1cXFwiMC44MTY1MTk0NzVcXFwiPlxcbiAgICAgICAgICA8cGF0aCBkPVxcXCJNMzIuNjU2ODU0MiwyOSBMMzguMzEwNjk3OCwyMy4zNDYxNTY0IEMzOS44NzcxMDIxLDIxLjc3OTc1MjEgMzkuODc1ODA1NywxOS4yNDgzODg3IDM4LjMxMzcwODUsMTcuNjg2MjkxNSBDMzYuNzU0Nzg5OSwxNi4xMjczNzI5IDM0LjIxNzYwMzUsMTYuMTI1NTQyMiAzMi42NTM4NDM2LDE3LjY4OTMwMjIgTDI3LDIzLjM0MzE0NTggTDIxLjM0NjE1NjQsMTcuNjg5MzAyMiBDMTkuNzgyMzk2NSwxNi4xMjU1NDIyIDE3LjI0NTIxMDEsMTYuMTI3MzcyOSAxNS42ODYyOTE1LDE3LjY4NjI5MTUgQzE0LjEyNDE5NDMsMTkuMjQ4Mzg4NyAxNC4xMjI4OTc5LDIxLjc3OTc1MjEgMTUuNjg5MzAyMiwyMy4zNDYxNTY0IEwyMS4zNDMxNDU4LDI5IEwxNS42ODkzMDIyLDM0LjY1Mzg0MzYgQzE0LjEyMjg5NzksMzYuMjIwMjQ3OSAxNC4xMjQxOTQzLDM4Ljc1MTYxMTMgMTUuNjg2MjkxNSw0MC4zMTM3MDg1IEMxNy4yNDUyMTAxLDQxLjg3MjYyNzEgMTkuNzgyMzk2NSw0MS44NzQ0NTc4IDIxLjM0NjE1NjQsNDAuMzEwNjk3OCBMMjcsMzQuNjU2ODU0MiBMMzIuNjUzODQzNiw0MC4zMTA2OTc4IEMzNC4yMTc2MDM1LDQxLjg3NDQ1NzggMzYuNzU0Nzg5OSw0MS44NzI2MjcxIDM4LjMxMzcwODUsNDAuMzEzNzA4NSBDMzkuODc1ODA1NywzOC43NTE2MTEzIDM5Ljg3NzEwMjEsMzYuMjIwMjQ3OSAzOC4zMTA2OTc4LDM0LjY1Mzg0MzYgTDMyLjY1Njg1NDIsMjkgWiBNMjcsNTMgQzQxLjM1OTQwMzUsNTMgNTMsNDEuMzU5NDAzNSA1MywyNyBDNTMsMTIuNjQwNTk2NSA0MS4zNTk0MDM1LDEgMjcsMSBDMTIuNjQwNTk2NSwxIDEsMTIuNjQwNTk2NSAxLDI3IEMxLDQxLjM1OTQwMzUgMTIuNjQwNTk2NSw1MyAyNyw1MyBaXFxcIiBpZD1cXFwiT3ZhbC0yXFxcIiBza2V0Y2g6dHlwZT1cXFwiTVNTaGFwZUdyb3VwXFxcIj48L3BhdGg+XFxuICAgICAgICA8L2c+XFxuICAgICAgPC9nPlxcbiAgICA8L3N2Zz5cXG4gIDwvZGl2PlxcbjwvZGl2PlwiLFxuXG4gICAgICAgIC8vIEVORCBPUFRJT05TXG4gICAgICAgIC8vIChSZXF1aXJlZCBieSB0aGUgZHJvcHpvbmUgZG9jdW1lbnRhdGlvbiBwYXJzZXIpXG5cblxuICAgICAgICAvKlxuICAgICAgICAgVGhvc2UgZnVuY3Rpb25zIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgdG8gdGhlIGV2ZW50cyBvbiBpbml0IGFuZCBoYW5kbGUgYWxsXG4gICAgICAgICB0aGUgdXNlciBpbnRlcmZhY2Ugc3BlY2lmaWMgc3R1ZmYuIE92ZXJ3cml0aW5nIHRoZW0gd29uJ3QgYnJlYWsgdGhlIHVwbG9hZFxuICAgICAgICAgYnV0IGNhbiBicmVhayB0aGUgd2F5IGl0J3MgZGlzcGxheWVkLlxuICAgICAgICAgWW91IGNhbiBvdmVyd3JpdGUgdGhlbSBpZiB5b3UgZG9uJ3QgbGlrZSB0aGUgZGVmYXVsdCBiZWhhdmlvci4gSWYgeW91IGp1c3RcbiAgICAgICAgIHdhbnQgdG8gYWRkIGFuIGFkZGl0aW9uYWwgZXZlbnQgaGFuZGxlciwgcmVnaXN0ZXIgaXQgb24gdGhlIGRyb3B6b25lIG9iamVjdFxuICAgICAgICAgYW5kIGRvbid0IG92ZXJ3cml0ZSB0aG9zZSBvcHRpb25zLlxuICAgICAgICAgKi9cblxuICAgICAgICAvLyBUaG9zZSBhcmUgc2VsZiBleHBsYW5hdG9yeSBhbmQgc2ltcGx5IGNvbmNlcm4gdGhlIERyYWduRHJvcC5cbiAgICAgICAgZHJvcDogZnVuY3Rpb24gZHJvcChlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotZHJhZy1ob3ZlclwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZHJhZ3N0YXJ0OiBmdW5jdGlvbiBkcmFnc3RhcnQoZSkge30sXG4gICAgICAgIGRyYWdlbmQ6IGZ1bmN0aW9uIGRyYWdlbmQoZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGRyYWdlbnRlcjogZnVuY3Rpb24gZHJhZ2VudGVyKGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgICB9LFxuICAgICAgICBkcmFnb3ZlcjogZnVuY3Rpb24gZHJhZ292ZXIoZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LWRyYWctaG92ZXJcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGRyYWdsZWF2ZTogZnVuY3Rpb24gZHJhZ2xlYXZlKGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1kcmFnLWhvdmVyXCIpO1xuICAgICAgICB9LFxuICAgICAgICBwYXN0ZTogZnVuY3Rpb24gcGFzdGUoZSkge30sXG5cblxuICAgICAgICAvLyBDYWxsZWQgd2hlbmV2ZXIgdGhlcmUgYXJlIG5vIGZpbGVzIGxlZnQgaW4gdGhlIGRyb3B6b25lIGFueW1vcmUsIGFuZCB0aGVcbiAgICAgICAgLy8gZHJvcHpvbmUgc2hvdWxkIGJlIGRpc3BsYXllZCBhcyBpZiBpbiB0aGUgaW5pdGlhbCBzdGF0ZS5cbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImR6LXN0YXJ0ZWRcIik7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyBDYWxsZWQgd2hlbiBhIGZpbGUgaXMgYWRkZWQgdG8gdGhlIHF1ZXVlXG4gICAgICAgIC8vIFJlY2VpdmVzIGBmaWxlYFxuICAgICAgICBhZGRlZGZpbGU6IGZ1bmN0aW9uIGFkZGVkZmlsZShmaWxlKSB7XG4gICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICBpZiAodGhpcy5lbGVtZW50ID09PSB0aGlzLnByZXZpZXdzQ29udGFpbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LXN0YXJ0ZWRcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMucHJldmlld3NDb250YWluZXIpIHtcbiAgICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQgPSBEcm9wem9uZS5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5wcmV2aWV3VGVtcGxhdGUudHJpbSgpKTtcbiAgICAgICAgICAgIGZpbGUucHJldmlld1RlbXBsYXRlID0gZmlsZS5wcmV2aWV3RWxlbWVudDsgLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3c0NvbnRhaW5lci5hcHBlbmRDaGlsZChmaWxlLnByZXZpZXdFbGVtZW50KTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjMgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1uYW1lXVwiKSwgX2lzQXJyYXkzID0gdHJ1ZSwgX2kzID0gMCwgX2l0ZXJhdG9yMyA9IF9pc0FycmF5MyA/IF9pdGVyYXRvcjMgOiBfaXRlcmF0b3IzW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmMztcblxuICAgICAgICAgICAgICBpZiAoX2lzQXJyYXkzKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pMyA+PSBfaXRlcmF0b3IzLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjMgPSBfaXRlcmF0b3IzW19pMysrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTMgPSBfaXRlcmF0b3IzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2kzLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWYzID0gX2kzLnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIG5vZGUgPSBfcmVmMztcblxuICAgICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gZmlsZS5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yNCA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXNpemVdXCIpLCBfaXNBcnJheTQgPSB0cnVlLCBfaTQgPSAwLCBfaXRlcmF0b3I0ID0gX2lzQXJyYXk0ID8gX2l0ZXJhdG9yNCA6IF9pdGVyYXRvcjRbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgaWYgKF9pc0FycmF5NCkge1xuICAgICAgICAgICAgICAgIGlmIChfaTQgPj0gX2l0ZXJhdG9yNC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBfaXRlcmF0b3I0W19pNCsrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTQgPSBfaXRlcmF0b3I0Lm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2k0LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBfaTQudmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBub2RlLmlubmVySFRNTCA9IHRoaXMuZmlsZXNpemUoZmlsZS5zaXplKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGRSZW1vdmVMaW5rcykge1xuICAgICAgICAgICAgICBmaWxlLl9yZW1vdmVMaW5rID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxhIGNsYXNzPVxcXCJkei1yZW1vdmVcXFwiIGhyZWY9XFxcImphdmFzY3JpcHQ6dW5kZWZpbmVkO1xcXCIgZGF0YS1kei1yZW1vdmU+XCIgKyB0aGlzLm9wdGlvbnMuZGljdFJlbW92ZUZpbGUgKyBcIjwvYT5cIik7XG4gICAgICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQuYXBwZW5kQ2hpbGQoZmlsZS5fcmVtb3ZlTGluayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZW1vdmVGaWxlRXZlbnQgPSBmdW5jdGlvbiByZW1vdmVGaWxlRXZlbnQoZSkge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgIGlmIChmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuVVBMT0FESU5HKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIERyb3B6b25lLmNvbmZpcm0oX3RoaXMyLm9wdGlvbnMuZGljdENhbmNlbFVwbG9hZENvbmZpcm1hdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzMi5yZW1vdmVGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpczIub3B0aW9ucy5kaWN0UmVtb3ZlRmlsZUNvbmZpcm1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIERyb3B6b25lLmNvbmZpcm0oX3RoaXMyLm9wdGlvbnMuZGljdFJlbW92ZUZpbGVDb25maXJtYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzMi5yZW1vdmVGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjUgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei1yZW1vdmVdXCIpLCBfaXNBcnJheTUgPSB0cnVlLCBfaTUgPSAwLCBfaXRlcmF0b3I1ID0gX2lzQXJyYXk1ID8gX2l0ZXJhdG9yNSA6IF9pdGVyYXRvcjVbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgdmFyIF9yZWY0O1xuXG4gICAgICAgICAgICAgIGlmIChfaXNBcnJheTUpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2k1ID49IF9pdGVyYXRvcjUubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmNCA9IF9pdGVyYXRvcjVbX2k1KytdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9pNSA9IF9pdGVyYXRvcjUubmV4dCgpO1xuICAgICAgICAgICAgICAgIGlmIChfaTUuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjQgPSBfaTUudmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgcmVtb3ZlTGluayA9IF9yZWY0O1xuXG4gICAgICAgICAgICAgIHJlbW92ZUxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92ZUZpbGVFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW5ldmVyIGEgZmlsZSBpcyByZW1vdmVkLlxuICAgICAgICByZW1vdmVkZmlsZTogZnVuY3Rpb24gcmVtb3ZlZGZpbGUoZmlsZSkge1xuICAgICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50ICE9IG51bGwgJiYgZmlsZS5wcmV2aWV3RWxlbWVudC5wYXJlbnROb2RlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZpbGUucHJldmlld0VsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmaWxlLnByZXZpZXdFbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZU1heEZpbGVzUmVhY2hlZENsYXNzKCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvLyBDYWxsZWQgd2hlbiBhIHRodW1ibmFpbCBoYXMgYmVlbiBnZW5lcmF0ZWRcbiAgICAgICAgLy8gUmVjZWl2ZXMgYGZpbGVgIGFuZCBgZGF0YVVybGBcbiAgICAgICAgdGh1bWJuYWlsOiBmdW5jdGlvbiB0aHVtYm5haWwoZmlsZSwgZGF0YVVybCkge1xuICAgICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1maWxlLXByZXZpZXdcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3I2ID0gZmlsZS5wcmV2aWV3RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZHotdGh1bWJuYWlsXVwiKSwgX2lzQXJyYXk2ID0gdHJ1ZSwgX2k2ID0gMCwgX2l0ZXJhdG9yNiA9IF9pc0FycmF5NiA/IF9pdGVyYXRvcjYgOiBfaXRlcmF0b3I2W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmNTtcblxuICAgICAgICAgICAgICBpZiAoX2lzQXJyYXk2KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pNiA+PSBfaXRlcmF0b3I2Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjUgPSBfaXRlcmF0b3I2W19pNisrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTYgPSBfaXRlcmF0b3I2Lm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2k2LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWY1ID0gX2k2LnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHRodW1ibmFpbEVsZW1lbnQgPSBfcmVmNTtcblxuICAgICAgICAgICAgICB0aHVtYm5haWxFbGVtZW50LmFsdCA9IGZpbGUubmFtZTtcbiAgICAgICAgICAgICAgdGh1bWJuYWlsRWxlbWVudC5zcmMgPSBkYXRhVXJsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1pbWFnZS1wcmV2aWV3XCIpO1xuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW5ldmVyIGFuIGVycm9yIG9jY3Vyc1xuICAgICAgICAvLyBSZWNlaXZlcyBgZmlsZWAgYW5kIGBtZXNzYWdlYFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoZmlsZSwgbWVzc2FnZSkge1xuICAgICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgICBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1lcnJvclwiKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSAhPT0gXCJTdHJpbmdcIiAmJiBtZXNzYWdlLmVycm9yKSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLmVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yNyA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LWVycm9ybWVzc2FnZV1cIiksIF9pc0FycmF5NyA9IHRydWUsIF9pNyA9IDAsIF9pdGVyYXRvcjcgPSBfaXNBcnJheTcgPyBfaXRlcmF0b3I3IDogX2l0ZXJhdG9yN1tTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICB2YXIgX3JlZjY7XG5cbiAgICAgICAgICAgICAgaWYgKF9pc0FycmF5Nykge1xuICAgICAgICAgICAgICAgIGlmIChfaTcgPj0gX2l0ZXJhdG9yNy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWY2ID0gX2l0ZXJhdG9yN1tfaTcrK107XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2k3ID0gX2l0ZXJhdG9yNy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pNy5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmNiA9IF9pNy52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBub2RlID0gX3JlZjY7XG5cbiAgICAgICAgICAgICAgbm9kZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcm11bHRpcGxlOiBmdW5jdGlvbiBlcnJvcm11bHRpcGxlKCkge30sXG5cblxuICAgICAgICAvLyBDYWxsZWQgd2hlbiBhIGZpbGUgZ2V0cyBwcm9jZXNzZWQuIFNpbmNlIHRoZXJlIGlzIGEgY3VlLCBub3QgYWxsIGFkZGVkXG4gICAgICAgIC8vIGZpbGVzIGFyZSBwcm9jZXNzZWQgaW1tZWRpYXRlbHkuXG4gICAgICAgIC8vIFJlY2VpdmVzIGBmaWxlYFxuICAgICAgICBwcm9jZXNzaW5nOiBmdW5jdGlvbiBwcm9jZXNzaW5nKGZpbGUpIHtcbiAgICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgICAgZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotcHJvY2Vzc2luZ1wiKTtcbiAgICAgICAgICAgIGlmIChmaWxlLl9yZW1vdmVMaW5rKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmaWxlLl9yZW1vdmVMaW5rLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5kaWN0Q2FuY2VsVXBsb2FkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHJvY2Vzc2luZ211bHRpcGxlOiBmdW5jdGlvbiBwcm9jZXNzaW5nbXVsdGlwbGUoKSB7fSxcblxuXG4gICAgICAgIC8vIENhbGxlZCB3aGVuZXZlciB0aGUgdXBsb2FkIHByb2dyZXNzIGdldHMgdXBkYXRlZC5cbiAgICAgICAgLy8gUmVjZWl2ZXMgYGZpbGVgLCBgcHJvZ3Jlc3NgIChwZXJjZW50YWdlIDAtMTAwKSBhbmQgYGJ5dGVzU2VudGAuXG4gICAgICAgIC8vIFRvIGdldCB0aGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzIG9mIHRoZSBmaWxlLCB1c2UgYGZpbGUuc2l6ZWBcbiAgICAgICAgdXBsb2FkcHJvZ3Jlc3M6IGZ1bmN0aW9uIHVwbG9hZHByb2dyZXNzKGZpbGUsIHByb2dyZXNzLCBieXRlc1NlbnQpIHtcbiAgICAgICAgICBpZiAoZmlsZS5wcmV2aWV3RWxlbWVudCkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yOCA9IGZpbGUucHJldmlld0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWR6LXVwbG9hZHByb2dyZXNzXVwiKSwgX2lzQXJyYXk4ID0gdHJ1ZSwgX2k4ID0gMCwgX2l0ZXJhdG9yOCA9IF9pc0FycmF5OCA/IF9pdGVyYXRvcjggOiBfaXRlcmF0b3I4W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmNztcblxuICAgICAgICAgICAgICBpZiAoX2lzQXJyYXk4KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pOCA+PSBfaXRlcmF0b3I4Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjcgPSBfaXRlcmF0b3I4W19pOCsrXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaTggPSBfaXRlcmF0b3I4Lm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2k4LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWY3ID0gX2k4LnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIG5vZGUgPSBfcmVmNztcblxuICAgICAgICAgICAgICBub2RlLm5vZGVOYW1lID09PSAnUFJPR1JFU1MnID8gbm9kZS52YWx1ZSA9IHByb2dyZXNzIDogbm9kZS5zdHlsZS53aWR0aCA9IHByb2dyZXNzICsgXCIlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW5ldmVyIHRoZSB0b3RhbCB1cGxvYWQgcHJvZ3Jlc3MgZ2V0cyB1cGRhdGVkLlxuICAgICAgICAvLyBDYWxsZWQgd2l0aCB0b3RhbFVwbG9hZFByb2dyZXNzICgwLTEwMCksIHRvdGFsQnl0ZXMgYW5kIHRvdGFsQnl0ZXNTZW50XG4gICAgICAgIHRvdGFsdXBsb2FkcHJvZ3Jlc3M6IGZ1bmN0aW9uIHRvdGFsdXBsb2FkcHJvZ3Jlc3MoKSB7fSxcblxuXG4gICAgICAgIC8vIENhbGxlZCBqdXN0IGJlZm9yZSB0aGUgZmlsZSBpcyBzZW50LiBHZXRzIHRoZSBgeGhyYCBvYmplY3QgYXMgc2Vjb25kXG4gICAgICAgIC8vIHBhcmFtZXRlciwgc28geW91IGNhbiBtb2RpZnkgaXQgKGZvciBleGFtcGxlIHRvIGFkZCBhIENTUkYgdG9rZW4pIGFuZCBhXG4gICAgICAgIC8vIGBmb3JtRGF0YWAgb2JqZWN0IHRvIGFkZCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgICAgICBzZW5kaW5nOiBmdW5jdGlvbiBzZW5kaW5nKCkge30sXG4gICAgICAgIHNlbmRpbmdtdWx0aXBsZTogZnVuY3Rpb24gc2VuZGluZ211bHRpcGxlKCkge30sXG5cblxuICAgICAgICAvLyBXaGVuIHRoZSBjb21wbGV0ZSB1cGxvYWQgaXMgZmluaXNoZWQgYW5kIHN1Y2Nlc3NmdWxcbiAgICAgICAgLy8gUmVjZWl2ZXMgYGZpbGVgXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MoZmlsZSkge1xuICAgICAgICAgIGlmIChmaWxlLnByZXZpZXdFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotc3VjY2Vzc1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3NtdWx0aXBsZTogZnVuY3Rpb24gc3VjY2Vzc211bHRpcGxlKCkge30sXG5cblxuICAgICAgICAvLyBXaGVuIHRoZSB1cGxvYWQgaXMgY2FuY2VsZWQuXG4gICAgICAgIGNhbmNlbGVkOiBmdW5jdGlvbiBjYW5jZWxlZChmaWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZW1pdChcImVycm9yXCIsIGZpbGUsIHRoaXMub3B0aW9ucy5kaWN0VXBsb2FkQ2FuY2VsZWQpO1xuICAgICAgICB9LFxuICAgICAgICBjYW5jZWxlZG11bHRpcGxlOiBmdW5jdGlvbiBjYW5jZWxlZG11bHRpcGxlKCkge30sXG5cblxuICAgICAgICAvLyBXaGVuIHRoZSB1cGxvYWQgaXMgZmluaXNoZWQsIGVpdGhlciB3aXRoIHN1Y2Nlc3Mgb3IgYW4gZXJyb3IuXG4gICAgICAgIC8vIFJlY2VpdmVzIGBmaWxlYFxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoZmlsZSkge1xuICAgICAgICAgIGlmIChmaWxlLl9yZW1vdmVMaW5rKSB7XG4gICAgICAgICAgICBmaWxlLl9yZW1vdmVMaW5rLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5kaWN0UmVtb3ZlRmlsZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlLnByZXZpZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkei1jb21wbGV0ZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlbXVsdGlwbGU6IGZ1bmN0aW9uIGNvbXBsZXRlbXVsdGlwbGUoKSB7fSxcbiAgICAgICAgbWF4ZmlsZXNleGNlZWRlZDogZnVuY3Rpb24gbWF4ZmlsZXNleGNlZWRlZCgpIHt9LFxuICAgICAgICBtYXhmaWxlc3JlYWNoZWQ6IGZ1bmN0aW9uIG1heGZpbGVzcmVhY2hlZCgpIHt9LFxuICAgICAgICBxdWV1ZWNvbXBsZXRlOiBmdW5jdGlvbiBxdWV1ZWNvbXBsZXRlKCkge30sXG4gICAgICAgIGFkZGVkZmlsZXM6IGZ1bmN0aW9uIGFkZGVkZmlsZXMoKSB7fVxuICAgICAgfTtcblxuICAgICAgdGhpcy5wcm90b3R5cGUuX3RodW1ibmFpbFF1ZXVlID0gW107XG4gICAgICB0aGlzLnByb3RvdHlwZS5fcHJvY2Vzc2luZ1RodW1ibmFpbCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGdsb2JhbCB1dGlsaXR5XG5cbiAgfSwge1xuICAgIGtleTogXCJleHRlbmRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCkge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBvYmplY3RzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBvYmplY3RzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3I5ID0gb2JqZWN0cywgX2lzQXJyYXk5ID0gdHJ1ZSwgX2k5ID0gMCwgX2l0ZXJhdG9yOSA9IF9pc0FycmF5OSA/IF9pdGVyYXRvcjkgOiBfaXRlcmF0b3I5W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmODtcblxuICAgICAgICBpZiAoX2lzQXJyYXk5KSB7XG4gICAgICAgICAgaWYgKF9pOSA+PSBfaXRlcmF0b3I5Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjggPSBfaXRlcmF0b3I5W19pOSsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTkgPSBfaXRlcmF0b3I5Lm5leHQoKTtcbiAgICAgICAgICBpZiAoX2k5LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWY4ID0gX2k5LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iamVjdCA9IF9yZWY4O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICB2YXIgdmFsID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICB9XSk7XG5cbiAgZnVuY3Rpb24gRHJvcHpvbmUoZWwsIG9wdGlvbnMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRHJvcHpvbmUpO1xuXG4gICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKERyb3B6b25lLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRHJvcHpvbmUpKS5jYWxsKHRoaXMpKTtcblxuICAgIHZhciBmYWxsYmFjayA9IHZvaWQgMCxcbiAgICAgICAgbGVmdCA9IHZvaWQgMDtcbiAgICBfdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgLy8gRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHNpbmNlIHRoZSB2ZXJzaW9uIHdhcyBpbiB0aGUgcHJvdG90eXBlIHByZXZpb3VzbHlcbiAgICBfdGhpcy52ZXJzaW9uID0gRHJvcHpvbmUudmVyc2lvbjtcblxuICAgIF90aGlzLmRlZmF1bHRPcHRpb25zLnByZXZpZXdUZW1wbGF0ZSA9IF90aGlzLmRlZmF1bHRPcHRpb25zLnByZXZpZXdUZW1wbGF0ZS5yZXBsYWNlKC9cXG4qL2csIFwiXCIpO1xuXG4gICAgX3RoaXMuY2xpY2thYmxlRWxlbWVudHMgPSBbXTtcbiAgICBfdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICBfdGhpcy5maWxlcyA9IFtdOyAvLyBBbGwgZmlsZXNcblxuICAgIGlmICh0eXBlb2YgX3RoaXMuZWxlbWVudCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgX3RoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoX3RoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy8gTm90IGNoZWNraW5nIGlmIGluc3RhbmNlIG9mIEhUTUxFbGVtZW50IG9yIEVsZW1lbnQgc2luY2UgSUU5IGlzIGV4dHJlbWVseSB3ZWlyZC5cbiAgICBpZiAoIV90aGlzLmVsZW1lbnQgfHwgX3RoaXMuZWxlbWVudC5ub2RlVHlwZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGRyb3B6b25lIGVsZW1lbnQuXCIpO1xuICAgIH1cblxuICAgIGlmIChfdGhpcy5lbGVtZW50LmRyb3B6b25lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEcm9wem9uZSBhbHJlYWR5IGF0dGFjaGVkLlwiKTtcbiAgICB9XG5cbiAgICAvLyBOb3cgYWRkIHRoaXMgZHJvcHpvbmUgdG8gdGhlIGluc3RhbmNlcy5cbiAgICBEcm9wem9uZS5pbnN0YW5jZXMucHVzaChfdGhpcyk7XG5cbiAgICAvLyBQdXQgdGhlIGRyb3B6b25lIGluc2lkZSB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgX3RoaXMuZWxlbWVudC5kcm9wem9uZSA9IF90aGlzO1xuXG4gICAgdmFyIGVsZW1lbnRPcHRpb25zID0gKGxlZnQgPSBEcm9wem9uZS5vcHRpb25zRm9yRWxlbWVudChfdGhpcy5lbGVtZW50KSkgIT0gbnVsbCA/IGxlZnQgOiB7fTtcblxuICAgIF90aGlzLm9wdGlvbnMgPSBEcm9wem9uZS5leHRlbmQoe30sIF90aGlzLmRlZmF1bHRPcHRpb25zLCBlbGVtZW50T3B0aW9ucywgb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9KTtcblxuICAgIC8vIElmIHRoZSBicm93c2VyIGZhaWxlZCwganVzdCBjYWxsIHRoZSBmYWxsYmFjayBhbmQgbGVhdmVcbiAgICBpZiAoX3RoaXMub3B0aW9ucy5mb3JjZUZhbGxiYWNrIHx8ICFEcm9wem9uZS5pc0Jyb3dzZXJTdXBwb3J0ZWQoKSkge1xuICAgICAgdmFyIF9yZXQ7XG5cbiAgICAgIHJldHVybiBfcmV0ID0gX3RoaXMub3B0aW9ucy5mYWxsYmFjay5jYWxsKF90aGlzKSwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oX3RoaXMsIF9yZXQpO1xuICAgIH1cblxuICAgIC8vIEBvcHRpb25zLnVybCA9IEBlbGVtZW50LmdldEF0dHJpYnV0ZSBcImFjdGlvblwiIHVubGVzcyBAb3B0aW9ucy51cmw/XG4gICAgaWYgKF90aGlzLm9wdGlvbnMudXJsID09IG51bGwpIHtcbiAgICAgIF90aGlzLm9wdGlvbnMudXJsID0gX3RoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhY3Rpb25cIik7XG4gICAgfVxuXG4gICAgaWYgKCFfdGhpcy5vcHRpb25zLnVybCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gVVJMIHByb3ZpZGVkLlwiKTtcbiAgICB9XG5cbiAgICBpZiAoX3RoaXMub3B0aW9ucy5hY2NlcHRlZEZpbGVzICYmIF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBjYW4ndCBwcm92aWRlIGJvdGggJ2FjY2VwdGVkRmlsZXMnIGFuZCAnYWNjZXB0ZWRNaW1lVHlwZXMnLiAnYWNjZXB0ZWRNaW1lVHlwZXMnIGlzIGRlcHJlY2F0ZWQuXCIpO1xuICAgIH1cblxuICAgIGlmIChfdGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlICYmIF90aGlzLm9wdGlvbnMuY2h1bmtpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbm5vdCBzZXQgYm90aDogdXBsb2FkTXVsdGlwbGUgYW5kIGNodW5raW5nLicpO1xuICAgIH1cblxuICAgIC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgaWYgKF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXMpIHtcbiAgICAgIF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcyA9IF90aGlzLm9wdGlvbnMuYWNjZXB0ZWRNaW1lVHlwZXM7XG4gICAgICBkZWxldGUgX3RoaXMub3B0aW9ucy5hY2NlcHRlZE1pbWVUeXBlcztcbiAgICB9XG5cbiAgICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIGlmIChfdGhpcy5vcHRpb25zLnJlbmFtZUZpbGVuYW1lICE9IG51bGwpIHtcbiAgICAgIF90aGlzLm9wdGlvbnMucmVuYW1lRmlsZSA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5vcHRpb25zLnJlbmFtZUZpbGVuYW1lLmNhbGwoX3RoaXMsIGZpbGUubmFtZSwgZmlsZSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIF90aGlzLm9wdGlvbnMubWV0aG9kID0gX3RoaXMub3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKTtcblxuICAgIGlmICgoZmFsbGJhY2sgPSBfdGhpcy5nZXRFeGlzdGluZ0ZhbGxiYWNrKCkpICYmIGZhbGxiYWNrLnBhcmVudE5vZGUpIHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgZmFsbGJhY2tcbiAgICAgIGZhbGxiYWNrLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZmFsbGJhY2spO1xuICAgIH1cblxuICAgIC8vIERpc3BsYXkgcHJldmlld3MgaW4gdGhlIHByZXZpZXdzQ29udGFpbmVyIGVsZW1lbnQgb3IgdGhlIERyb3B6b25lIGVsZW1lbnQgdW5sZXNzIGV4cGxpY2l0bHkgc2V0IHRvIGZhbHNlXG4gICAgaWYgKF90aGlzLm9wdGlvbnMucHJldmlld3NDb250YWluZXIgIT09IGZhbHNlKSB7XG4gICAgICBpZiAoX3RoaXMub3B0aW9ucy5wcmV2aWV3c0NvbnRhaW5lcikge1xuICAgICAgICBfdGhpcy5wcmV2aWV3c0NvbnRhaW5lciA9IERyb3B6b25lLmdldEVsZW1lbnQoX3RoaXMub3B0aW9ucy5wcmV2aWV3c0NvbnRhaW5lciwgXCJwcmV2aWV3c0NvbnRhaW5lclwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLnByZXZpZXdzQ29udGFpbmVyID0gX3RoaXMuZWxlbWVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoX3RoaXMub3B0aW9ucy5jbGlja2FibGUpIHtcbiAgICAgIGlmIChfdGhpcy5vcHRpb25zLmNsaWNrYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICBfdGhpcy5jbGlja2FibGVFbGVtZW50cyA9IFtfdGhpcy5lbGVtZW50XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLmNsaWNrYWJsZUVsZW1lbnRzID0gRHJvcHpvbmUuZ2V0RWxlbWVudHMoX3RoaXMub3B0aW9ucy5jbGlja2FibGUsIFwiY2xpY2thYmxlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF90aGlzLmluaXQoKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICAvLyBSZXR1cm5zIGFsbCBmaWxlcyB0aGF0IGhhdmUgYmVlbiBhY2NlcHRlZFxuXG5cbiAgX2NyZWF0ZUNsYXNzKERyb3B6b25lLCBbe1xuICAgIGtleTogXCJnZXRBY2NlcHRlZEZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFjY2VwdGVkRmlsZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUuYWNjZXB0ZWQ7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGFsbCBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZWplY3RlZFxuICAgIC8vIE5vdCBzdXJlIHdoZW4gdGhhdCdzIGdvaW5nIHRvIGJlIHVzZWZ1bCwgYnV0IGFkZGVkIGZvciBjb21wbGV0ZW5lc3MuXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRSZWplY3RlZEZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFJlamVjdGVkRmlsZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuICFmaWxlLmFjY2VwdGVkO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEZpbGVzV2l0aFN0YXR1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRGaWxlc1dpdGhTdGF0dXMoc3RhdHVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWxlcy5maWx0ZXIoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUuc3RhdHVzID09PSBzdGF0dXM7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGFsbCBmaWxlcyB0aGF0IGFyZSBpbiB0aGUgcXVldWVcblxuICB9LCB7XG4gICAga2V5OiBcImdldFF1ZXVlZEZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFF1ZXVlZEZpbGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZXNXaXRoU3RhdHVzKERyb3B6b25lLlFVRVVFRCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFVwbG9hZGluZ0ZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFVwbG9hZGluZ0ZpbGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RmlsZXNXaXRoU3RhdHVzKERyb3B6b25lLlVQTE9BRElORyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEFkZGVkRmlsZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QWRkZWRGaWxlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEZpbGVzV2l0aFN0YXR1cyhEcm9wem9uZS5BRERFRCk7XG4gICAgfVxuXG4gICAgLy8gRmlsZXMgdGhhdCBhcmUgZWl0aGVyIHF1ZXVlZCBvciB1cGxvYWRpbmdcblxuICB9LCB7XG4gICAga2V5OiBcImdldEFjdGl2ZUZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFjdGl2ZUZpbGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsZXMuZmlsdGVyKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuVVBMT0FESU5HIHx8IGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5RVUVVRUQ7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCB3aGVuIERyb3B6b25lIGlzIGluaXRpYWxpemVkLiBZb3VcbiAgICAvLyBjYW4gKGFuZCBzaG91bGQpIHNldHVwIGV2ZW50IGxpc3RlbmVycyBpbnNpZGUgdGhpcyBmdW5jdGlvbi5cblxuICB9LCB7XG4gICAga2V5OiBcImluaXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAvLyBJbiBjYXNlIGl0IGlzbid0IHNldCBhbHJlYWR5XG4gICAgICBpZiAodGhpcy5lbGVtZW50LnRhZ05hbWUgPT09IFwiZm9ybVwiKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJlbmN0eXBlXCIsIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJkcm9wem9uZVwiKSAmJiAhdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZHotbWVzc2FnZVwiKSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxkaXYgY2xhc3M9XFxcImR6LWRlZmF1bHQgZHotbWVzc2FnZVxcXCI+PHNwYW4+XCIgKyB0aGlzLm9wdGlvbnMuZGljdERlZmF1bHRNZXNzYWdlICsgXCI8L3NwYW4+PC9kaXY+XCIpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2xpY2thYmxlRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBzZXR1cEhpZGRlbkZpbGVJbnB1dCA9IGZ1bmN0aW9uIHNldHVwSGlkZGVuRmlsZUlucHV0KCkge1xuICAgICAgICAgIGlmIChfdGhpczMuaGlkZGVuRmlsZUlucHV0KSB7XG4gICAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoX3RoaXMzLmhpZGRlbkZpbGVJbnB1dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiZmlsZVwiKTtcbiAgICAgICAgICBpZiAoX3RoaXMzLm9wdGlvbnMubWF4RmlsZXMgPT09IG51bGwgfHwgX3RoaXMzLm9wdGlvbnMubWF4RmlsZXMgPiAxKSB7XG4gICAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnNldEF0dHJpYnV0ZShcIm11bHRpcGxlXCIsIFwibXVsdGlwbGVcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuY2xhc3NOYW1lID0gXCJkei1oaWRkZW4taW5wdXRcIjtcblxuICAgICAgICAgIGlmIChfdGhpczMub3B0aW9ucy5hY2NlcHRlZEZpbGVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnNldEF0dHJpYnV0ZShcImFjY2VwdFwiLCBfdGhpczMub3B0aW9ucy5hY2NlcHRlZEZpbGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF90aGlzMy5vcHRpb25zLmNhcHR1cmUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuc2V0QXR0cmlidXRlKFwiY2FwdHVyZVwiLCBfdGhpczMub3B0aW9ucy5jYXB0dXJlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOb3Qgc2V0dGluZyBgZGlzcGxheT1cIm5vbmVcImAgYmVjYXVzZSBzb21lIGJyb3dzZXJzIGRvbid0IGFjY2VwdCBjbGlja3NcbiAgICAgICAgICAvLyBvbiBlbGVtZW50cyB0aGF0IGFyZW4ndCBkaXNwbGF5ZWQuXG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuc3R5bGUudG9wID0gXCIwXCI7XG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS5sZWZ0ID0gXCIwXCI7XG4gICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5zdHlsZS5oZWlnaHQgPSBcIjBcIjtcbiAgICAgICAgICBfdGhpczMuaGlkZGVuRmlsZUlucHV0LnN0eWxlLndpZHRoID0gXCIwXCI7XG4gICAgICAgICAgRHJvcHpvbmUuZ2V0RWxlbWVudChfdGhpczMub3B0aW9ucy5oaWRkZW5JbnB1dENvbnRhaW5lciwgJ2hpZGRlbklucHV0Q29udGFpbmVyJykuYXBwZW5kQ2hpbGQoX3RoaXMzLmhpZGRlbkZpbGVJbnB1dCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzMy5oaWRkZW5GaWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBfdGhpczMuaGlkZGVuRmlsZUlucHV0LmZpbGVzO1xuXG4gICAgICAgICAgICBpZiAoZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjEwID0gZmlsZXMsIF9pc0FycmF5MTAgPSB0cnVlLCBfaTEwID0gMCwgX2l0ZXJhdG9yMTAgPSBfaXNBcnJheTEwID8gX2l0ZXJhdG9yMTAgOiBfaXRlcmF0b3IxMFtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICAgIHZhciBfcmVmOTtcblxuICAgICAgICAgICAgICAgIGlmIChfaXNBcnJheTEwKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX2kxMCA+PSBfaXRlcmF0b3IxMC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgX3JlZjkgPSBfaXRlcmF0b3IxMFtfaTEwKytdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBfaTEwID0gX2l0ZXJhdG9yMTAubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgaWYgKF9pMTAuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBfcmVmOSA9IF9pMTAudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGZpbGUgPSBfcmVmOTtcblxuICAgICAgICAgICAgICAgIF90aGlzMy5hZGRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpczMuZW1pdChcImFkZGVkZmlsZXNcIiwgZmlsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIHNldHVwSGlkZGVuRmlsZUlucHV0KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHNldHVwSGlkZGVuRmlsZUlucHV0KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuVVJMID0gd2luZG93LlVSTCAhPT0gbnVsbCA/IHdpbmRvdy5VUkwgOiB3aW5kb3cud2Via2l0VVJMO1xuXG4gICAgICAvLyBTZXR1cCBhbGwgZXZlbnQgbGlzdGVuZXJzIG9uIHRoZSBEcm9wem9uZSBvYmplY3QgaXRzZWxmLlxuICAgICAgLy8gVGhleSdyZSBub3QgaW4gQHNldHVwRXZlbnRMaXN0ZW5lcnMoKSBiZWNhdXNlIHRoZXkgc2hvdWxkbid0IGJlIHJlbW92ZWRcbiAgICAgIC8vIGFnYWluIHdoZW4gdGhlIGRyb3B6b25lIGdldHMgZGlzYWJsZWQuXG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IxMSA9IHRoaXMuZXZlbnRzLCBfaXNBcnJheTExID0gdHJ1ZSwgX2kxMSA9IDAsIF9pdGVyYXRvcjExID0gX2lzQXJyYXkxMSA/IF9pdGVyYXRvcjExIDogX2l0ZXJhdG9yMTFbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYxMDtcblxuICAgICAgICBpZiAoX2lzQXJyYXkxMSkge1xuICAgICAgICAgIGlmIChfaTExID49IF9pdGVyYXRvcjExLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjEwID0gX2l0ZXJhdG9yMTFbX2kxMSsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTExID0gX2l0ZXJhdG9yMTEubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTExLmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxMCA9IF9pMTEudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXZlbnROYW1lID0gX3JlZjEwO1xuXG4gICAgICAgIHRoaXMub24oZXZlbnROYW1lLCB0aGlzLm9wdGlvbnNbZXZlbnROYW1lXSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub24oXCJ1cGxvYWRwcm9ncmVzc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpczMudXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzcygpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub24oXCJyZW1vdmVkZmlsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpczMudXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzcygpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMub24oXCJjYW5jZWxlZFwiLCBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMzLmVtaXQoXCJjb21wbGV0ZVwiLCBmaWxlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBFbWl0IGEgYHF1ZXVlY29tcGxldGVgIGV2ZW50IGlmIGFsbCBmaWxlcyBmaW5pc2hlZCB1cGxvYWRpbmcuXG4gICAgICB0aGlzLm9uKFwiY29tcGxldGVcIiwgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgaWYgKF90aGlzMy5nZXRBZGRlZEZpbGVzKCkubGVuZ3RoID09PSAwICYmIF90aGlzMy5nZXRVcGxvYWRpbmdGaWxlcygpLmxlbmd0aCA9PT0gMCAmJiBfdGhpczMuZ2V0UXVldWVkRmlsZXMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGRlZmVycmVkIHNvIHRoYXQgYHF1ZXVlY29tcGxldGVgIHJlYWxseSB0cmlnZ2VycyBhZnRlciBgY29tcGxldGVgXG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzMy5lbWl0KFwicXVldWVjb21wbGV0ZVwiKTtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBub1Byb3BhZ2F0aW9uID0gZnVuY3Rpb24gbm9Qcm9wYWdhdGlvbihlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIGxpc3RlbmVyc1xuICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbe1xuICAgICAgICBlbGVtZW50OiB0aGlzLmVsZW1lbnQsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgIFwiZHJhZ3N0YXJ0XCI6IGZ1bmN0aW9uIGRyYWdzdGFydChlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLmVtaXQoXCJkcmFnc3RhcnRcIiwgZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRyYWdlbnRlclwiOiBmdW5jdGlvbiBkcmFnZW50ZXIoZSkge1xuICAgICAgICAgICAgbm9Qcm9wYWdhdGlvbihlKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczMuZW1pdChcImRyYWdlbnRlclwiLCBlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHJhZ292ZXJcIjogZnVuY3Rpb24gZHJhZ292ZXIoZSkge1xuICAgICAgICAgICAgLy8gTWFrZXMgaXQgcG9zc2libGUgdG8gZHJhZyBmaWxlcyBmcm9tIGNocm9tZSdzIGRvd25sb2FkIGJhclxuICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTUyNjQzMC9kcmFnLWFuZC1kcm9wLWZpbGUtdXBsb2Fkcy1mcm9tLWNocm9tZS1kb3dubG9hZHMtYmFyXG4gICAgICAgICAgICAvLyBUcnkgaXMgcmVxdWlyZWQgdG8gcHJldmVudCBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTEgKFNDUklQVDY1NTM1IGV4Y2VwdGlvbilcbiAgICAgICAgICAgIHZhciBlZmN0ID0gdm9pZCAwO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZWZjdCA9IGUuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQ7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbW92ZScgPT09IGVmY3QgfHwgJ2xpbmtNb3ZlJyA9PT0gZWZjdCA/ICdtb3ZlJyA6ICdjb3B5JztcblxuICAgICAgICAgICAgbm9Qcm9wYWdhdGlvbihlKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczMuZW1pdChcImRyYWdvdmVyXCIsIGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkcmFnbGVhdmVcIjogZnVuY3Rpb24gZHJhZ2xlYXZlKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczMuZW1pdChcImRyYWdsZWF2ZVwiLCBlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHJvcFwiOiBmdW5jdGlvbiBkcm9wKGUpIHtcbiAgICAgICAgICAgIG5vUHJvcGFnYXRpb24oZSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLmRyb3AoZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRyYWdlbmRcIjogZnVuY3Rpb24gZHJhZ2VuZChlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMzLmVtaXQoXCJkcmFnZW5kXCIsIGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgaXMgZGlzYWJsZWQgcmlnaHQgbm93LCBiZWNhdXNlIHRoZSBicm93c2VycyBkb24ndCBpbXBsZW1lbnQgaXQgcHJvcGVybHkuXG4gICAgICAgICAgLy8gXCJwYXN0ZVwiOiAoZSkgPT5cbiAgICAgICAgICAvLyAgIG5vUHJvcGFnYXRpb24gZVxuICAgICAgICAgIC8vICAgQHBhc3RlIGVcbiAgICAgICAgfSB9XTtcblxuICAgICAgdGhpcy5jbGlja2FibGVFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjbGlja2FibGVFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBfdGhpczMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgIGVsZW1lbnQ6IGNsaWNrYWJsZUVsZW1lbnQsXG4gICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICBcImNsaWNrXCI6IGZ1bmN0aW9uIGNsaWNrKGV2dCkge1xuICAgICAgICAgICAgICAvLyBPbmx5IHRoZSBhY3R1YWwgZHJvcHpvbmUgb3IgdGhlIG1lc3NhZ2UgZWxlbWVudCBzaG91bGQgdHJpZ2dlciBmaWxlIHNlbGVjdGlvblxuICAgICAgICAgICAgICBpZiAoY2xpY2thYmxlRWxlbWVudCAhPT0gX3RoaXMzLmVsZW1lbnQgfHwgZXZ0LnRhcmdldCA9PT0gX3RoaXMzLmVsZW1lbnQgfHwgRHJvcHpvbmUuZWxlbWVudEluc2lkZShldnQudGFyZ2V0LCBfdGhpczMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmR6LW1lc3NhZ2VcIikpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMzLmhpZGRlbkZpbGVJbnB1dC5jbGljaygpOyAvLyBGb3J3YXJkIHRoZSBjbGlja1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5lbmFibGUoKTtcblxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5pbml0LmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGZ1bGx5IHRlc3RlZCB5ZXRcblxuICB9LCB7XG4gICAga2V5OiBcImRlc3Ryb3lcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgdGhpcy5yZW1vdmVBbGxGaWxlcyh0cnVlKTtcbiAgICAgIGlmICh0aGlzLmhpZGRlbkZpbGVJbnB1dCAhPSBudWxsID8gdGhpcy5oaWRkZW5GaWxlSW5wdXQucGFyZW50Tm9kZSA6IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmhpZGRlbkZpbGVJbnB1dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuaGlkZGVuRmlsZUlucHV0KTtcbiAgICAgICAgdGhpcy5oaWRkZW5GaWxlSW5wdXQgPSBudWxsO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudC5kcm9wem9uZTtcbiAgICAgIHJldHVybiBEcm9wem9uZS5pbnN0YW5jZXMuc3BsaWNlKERyb3B6b25lLmluc3RhbmNlcy5pbmRleE9mKHRoaXMpLCAxKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidXBkYXRlVG90YWxVcGxvYWRQcm9ncmVzc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVUb3RhbFVwbG9hZFByb2dyZXNzKCkge1xuICAgICAgdmFyIHRvdGFsVXBsb2FkUHJvZ3Jlc3MgPSB2b2lkIDA7XG4gICAgICB2YXIgdG90YWxCeXRlc1NlbnQgPSAwO1xuICAgICAgdmFyIHRvdGFsQnl0ZXMgPSAwO1xuXG4gICAgICB2YXIgYWN0aXZlRmlsZXMgPSB0aGlzLmdldEFjdGl2ZUZpbGVzKCk7XG5cbiAgICAgIGlmIChhY3RpdmVGaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTIgPSB0aGlzLmdldEFjdGl2ZUZpbGVzKCksIF9pc0FycmF5MTIgPSB0cnVlLCBfaTEyID0gMCwgX2l0ZXJhdG9yMTIgPSBfaXNBcnJheTEyID8gX2l0ZXJhdG9yMTIgOiBfaXRlcmF0b3IxMltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgIHZhciBfcmVmMTE7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXkxMikge1xuICAgICAgICAgICAgaWYgKF9pMTIgPj0gX2l0ZXJhdG9yMTIubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYxMSA9IF9pdGVyYXRvcjEyW19pMTIrK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pMTIgPSBfaXRlcmF0b3IxMi5uZXh0KCk7XG4gICAgICAgICAgICBpZiAoX2kxMi5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYxMSA9IF9pMTIudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGZpbGUgPSBfcmVmMTE7XG5cbiAgICAgICAgICB0b3RhbEJ5dGVzU2VudCArPSBmaWxlLnVwbG9hZC5ieXRlc1NlbnQ7XG4gICAgICAgICAgdG90YWxCeXRlcyArPSBmaWxlLnVwbG9hZC50b3RhbDtcbiAgICAgICAgfVxuICAgICAgICB0b3RhbFVwbG9hZFByb2dyZXNzID0gMTAwICogdG90YWxCeXRlc1NlbnQgLyB0b3RhbEJ5dGVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG90YWxVcGxvYWRQcm9ncmVzcyA9IDEwMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZW1pdChcInRvdGFsdXBsb2FkcHJvZ3Jlc3NcIiwgdG90YWxVcGxvYWRQcm9ncmVzcywgdG90YWxCeXRlcywgdG90YWxCeXRlc1NlbnQpO1xuICAgIH1cblxuICAgIC8vIEBvcHRpb25zLnBhcmFtTmFtZSBjYW4gYmUgYSBmdW5jdGlvbiB0YWtpbmcgb25lIHBhcmFtZXRlciByYXRoZXIgdGhhbiBhIHN0cmluZy5cbiAgICAvLyBBIHBhcmFtZXRlciBuYW1lIGZvciBhIGZpbGUgaXMgb2J0YWluZWQgc2ltcGx5IGJ5IGNhbGxpbmcgdGhpcyB3aXRoIGFuIGluZGV4IG51bWJlci5cblxuICB9LCB7XG4gICAga2V5OiBcIl9nZXRQYXJhbU5hbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFBhcmFtTmFtZShuKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5wYXJhbU5hbWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnBhcmFtTmFtZShuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIlwiICsgdGhpcy5vcHRpb25zLnBhcmFtTmFtZSArICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUgPyBcIltcIiArIG4gKyBcIl1cIiA6IFwiXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIEBvcHRpb25zLnJlbmFtZUZpbGUgaXMgYSBmdW5jdGlvbixcbiAgICAvLyB0aGUgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIHRvIHJlbmFtZSB0aGUgZmlsZS5uYW1lIGJlZm9yZSBhcHBlbmRpbmcgaXQgdG8gdGhlIGZvcm1EYXRhXG5cbiAgfSwge1xuICAgIGtleTogXCJfcmVuYW1lRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVuYW1lRmlsZShmaWxlKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5yZW5hbWVGaWxlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUubmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucmVuYW1lRmlsZShmaWxlKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGEgZm9ybSB0aGF0IGNhbiBiZSB1c2VkIGFzIGZhbGxiYWNrIGlmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgRHJhZ25Ecm9wXG4gICAgLy9cbiAgICAvLyBJZiB0aGUgZHJvcHpvbmUgaXMgYWxyZWFkeSBhIGZvcm0sIG9ubHkgdGhlIGlucHV0IGZpZWxkIGFuZCBidXR0b24gYXJlIHJldHVybmVkLiBPdGhlcndpc2UgYSBjb21wbGV0ZSBmb3JtIGVsZW1lbnQgaXMgcHJvdmlkZWQuXG4gICAgLy8gVGhpcyBjb2RlIGhhcyB0byBwYXNzIGluIElFNyA6KFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RmFsbGJhY2tGb3JtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZhbGxiYWNrRm9ybSgpIHtcbiAgICAgIHZhciBleGlzdGluZ0ZhbGxiYWNrID0gdm9pZCAwLFxuICAgICAgICAgIGZvcm0gPSB2b2lkIDA7XG4gICAgICBpZiAoZXhpc3RpbmdGYWxsYmFjayA9IHRoaXMuZ2V0RXhpc3RpbmdGYWxsYmFjaygpKSB7XG4gICAgICAgIHJldHVybiBleGlzdGluZ0ZhbGxiYWNrO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmllbGRzU3RyaW5nID0gXCI8ZGl2IGNsYXNzPVxcXCJkei1mYWxsYmFja1xcXCI+XCI7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRpY3RGYWxsYmFja1RleHQpIHtcbiAgICAgICAgZmllbGRzU3RyaW5nICs9IFwiPHA+XCIgKyB0aGlzLm9wdGlvbnMuZGljdEZhbGxiYWNrVGV4dCArIFwiPC9wPlwiO1xuICAgICAgfVxuICAgICAgZmllbGRzU3RyaW5nICs9IFwiPGlucHV0IHR5cGU9XFxcImZpbGVcXFwiIG5hbWU9XFxcIlwiICsgdGhpcy5fZ2V0UGFyYW1OYW1lKDApICsgXCJcXFwiIFwiICsgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSA/ICdtdWx0aXBsZT1cIm11bHRpcGxlXCInIDogdW5kZWZpbmVkKSArIFwiIC8+PGlucHV0IHR5cGU9XFxcInN1Ym1pdFxcXCIgdmFsdWU9XFxcIlVwbG9hZCFcXFwiPjwvZGl2PlwiO1xuXG4gICAgICB2YXIgZmllbGRzID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChmaWVsZHNTdHJpbmcpO1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lICE9PSBcIkZPUk1cIikge1xuICAgICAgICBmb3JtID0gRHJvcHpvbmUuY3JlYXRlRWxlbWVudChcIjxmb3JtIGFjdGlvbj1cXFwiXCIgKyB0aGlzLm9wdGlvbnMudXJsICsgXCJcXFwiIGVuY3R5cGU9XFxcIm11bHRpcGFydC9mb3JtLWRhdGFcXFwiIG1ldGhvZD1cXFwiXCIgKyB0aGlzLm9wdGlvbnMubWV0aG9kICsgXCJcXFwiPjwvZm9ybT5cIik7XG4gICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoZmllbGRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBlbmN0eXBlIGFuZCBtZXRob2QgYXR0cmlidXRlcyBhcmUgc2V0IHByb3Blcmx5XG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJlbmN0eXBlXCIsIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcIm1ldGhvZFwiLCB0aGlzLm9wdGlvbnMubWV0aG9kKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmb3JtICE9IG51bGwgPyBmb3JtIDogZmllbGRzO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgdGhlIGZhbGxiYWNrIGVsZW1lbnRzIGlmIHRoZXkgZXhpc3QgYWxyZWFkeVxuICAgIC8vXG4gICAgLy8gVGhpcyBjb2RlIGhhcyB0byBwYXNzIGluIElFNyA6KFxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RXhpc3RpbmdGYWxsYmFja1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRFeGlzdGluZ0ZhbGxiYWNrKCkge1xuICAgICAgdmFyIGdldEZhbGxiYWNrID0gZnVuY3Rpb24gZ2V0RmFsbGJhY2soZWxlbWVudHMpIHtcbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTMgPSBlbGVtZW50cywgX2lzQXJyYXkxMyA9IHRydWUsIF9pMTMgPSAwLCBfaXRlcmF0b3IxMyA9IF9pc0FycmF5MTMgPyBfaXRlcmF0b3IxMyA6IF9pdGVyYXRvcjEzW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYxMjtcblxuICAgICAgICAgIGlmIChfaXNBcnJheTEzKSB7XG4gICAgICAgICAgICBpZiAoX2kxMyA+PSBfaXRlcmF0b3IxMy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjEyID0gX2l0ZXJhdG9yMTNbX2kxMysrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kxMyA9IF9pdGVyYXRvcjEzLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTEzLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjEyID0gX2kxMy52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZWwgPSBfcmVmMTI7XG5cbiAgICAgICAgICBpZiAoLyhefCApZmFsbGJhY2soJHwgKS8udGVzdChlbC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgX2FyciA9IFtcImRpdlwiLCBcImZvcm1cIl07XG4gICAgICBmb3IgKHZhciBfaTE0ID0gMDsgX2kxNCA8IF9hcnIubGVuZ3RoOyBfaTE0KyspIHtcbiAgICAgICAgdmFyIHRhZ05hbWUgPSBfYXJyW19pMTRdO1xuICAgICAgICB2YXIgZmFsbGJhY2s7XG4gICAgICAgIGlmIChmYWxsYmFjayA9IGdldEZhbGxiYWNrKHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWdOYW1lKSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBY3RpdmF0ZXMgYWxsIGxpc3RlbmVycyBzdG9yZWQgaW4gQGxpc3RlbmVyc1xuXG4gIH0sIHtcbiAgICBrZXk6IFwic2V0dXBFdmVudExpc3RlbmVyc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzLm1hcChmdW5jdGlvbiAoZWxlbWVudExpc3RlbmVycykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICBmb3IgKHZhciBldmVudCBpbiBlbGVtZW50TGlzdGVuZXJzLmV2ZW50cykge1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gZWxlbWVudExpc3RlbmVycy5ldmVudHNbZXZlbnRdO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goZWxlbWVudExpc3RlbmVycy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBEZWFjdGl2YXRlcyBhbGwgbGlzdGVuZXJzIHN0b3JlZCBpbiBAbGlzdGVuZXJzXG5cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVFdmVudExpc3RlbmVyc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVycy5tYXAoZnVuY3Rpb24gKGVsZW1lbnRMaXN0ZW5lcnMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgZm9yICh2YXIgZXZlbnQgaW4gZWxlbWVudExpc3RlbmVycy5ldmVudHMpIHtcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGVsZW1lbnRMaXN0ZW5lcnMuZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVsZW1lbnRMaXN0ZW5lcnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlcyBhbGwgZXZlbnQgbGlzdGVuZXJzIGFuZCBjYW5jZWxzIGFsbCBmaWxlcyBpbiB0aGUgcXVldWUgb3IgYmVpbmcgcHJvY2Vzc2VkLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzYWJsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlKCkge1xuICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotY2xpY2thYmxlXCIpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgICAgcmV0dXJuIHRoaXMuZmlsZXMubWFwKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHJldHVybiBfdGhpczQuY2FuY2VsVXBsb2FkKGZpbGUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImVuYWJsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgICBkZWxldGUgdGhpcy5kaXNhYmxlZDtcbiAgICAgIHRoaXMuY2xpY2thYmxlRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotY2xpY2thYmxlXCIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhIG5pY2VseSBmb3JtYXR0ZWQgZmlsZXNpemVcblxuICB9LCB7XG4gICAga2V5OiBcImZpbGVzaXplXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpbGVzaXplKHNpemUpIHtcbiAgICAgIHZhciBzZWxlY3RlZFNpemUgPSAwO1xuICAgICAgdmFyIHNlbGVjdGVkVW5pdCA9IFwiYlwiO1xuXG4gICAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgICAgdmFyIHVuaXRzID0gWyd0YicsICdnYicsICdtYicsICdrYicsICdiJ107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bml0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB1bml0ID0gdW5pdHNbaV07XG4gICAgICAgICAgdmFyIGN1dG9mZiA9IE1hdGgucG93KHRoaXMub3B0aW9ucy5maWxlc2l6ZUJhc2UsIDQgLSBpKSAvIDEwO1xuXG4gICAgICAgICAgaWYgKHNpemUgPj0gY3V0b2ZmKSB7XG4gICAgICAgICAgICBzZWxlY3RlZFNpemUgPSBzaXplIC8gTWF0aC5wb3codGhpcy5vcHRpb25zLmZpbGVzaXplQmFzZSwgNCAtIGkpO1xuICAgICAgICAgICAgc2VsZWN0ZWRVbml0ID0gdW5pdDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGVjdGVkU2l6ZSA9IE1hdGgucm91bmQoMTAgKiBzZWxlY3RlZFNpemUpIC8gMTA7IC8vIEN1dHRpbmcgb2YgZGlnaXRzXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBcIjxzdHJvbmc+XCIgKyBzZWxlY3RlZFNpemUgKyBcIjwvc3Ryb25nPiBcIiArIHRoaXMub3B0aW9ucy5kaWN0RmlsZVNpemVVbml0c1tzZWxlY3RlZFVuaXRdO1xuICAgIH1cblxuICAgIC8vIEFkZHMgb3IgcmVtb3ZlcyB0aGUgYGR6LW1heC1maWxlcy1yZWFjaGVkYCBjbGFzcyBmcm9tIHRoZSBmb3JtLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3VwZGF0ZU1heEZpbGVzUmVhY2hlZENsYXNzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF91cGRhdGVNYXhGaWxlc1JlYWNoZWRDbGFzcygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RmlsZXMgIT0gbnVsbCAmJiB0aGlzLmdldEFjY2VwdGVkRmlsZXMoKS5sZW5ndGggPj0gdGhpcy5vcHRpb25zLm1heEZpbGVzKSB7XG4gICAgICAgIGlmICh0aGlzLmdldEFjY2VwdGVkRmlsZXMoKS5sZW5ndGggPT09IHRoaXMub3B0aW9ucy5tYXhGaWxlcykge1xuICAgICAgICAgIHRoaXMuZW1pdCgnbWF4ZmlsZXNyZWFjaGVkJywgdGhpcy5maWxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZHotbWF4LWZpbGVzLXJlYWNoZWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkei1tYXgtZmlsZXMtcmVhY2hlZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHJvcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkcm9wKGUpIHtcbiAgICAgIGlmICghZS5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KFwiZHJvcFwiLCBlKTtcblxuICAgICAgLy8gQ29udmVydCB0aGUgRmlsZUxpc3QgdG8gYW4gQXJyYXlcbiAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBJRTExXG4gICAgICB2YXIgZmlsZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZS5kYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZmlsZXNbaV0gPSBlLmRhdGFUcmFuc2Zlci5maWxlc1tpXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KFwiYWRkZWRmaWxlc1wiLCBmaWxlcyk7XG5cbiAgICAgIC8vIEV2ZW4gaWYgaXQncyBhIGZvbGRlciwgZmlsZXMubGVuZ3RoIHdpbGwgY29udGFpbiB0aGUgZm9sZGVycy5cbiAgICAgIGlmIChmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGl0ZW1zID0gZS5kYXRhVHJhbnNmZXIuaXRlbXM7XG5cbiAgICAgICAgaWYgKGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCAmJiBpdGVtc1swXS53ZWJraXRHZXRBc0VudHJ5ICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBUaGUgYnJvd3NlciBzdXBwb3J0cyBkcm9wcGluZyBvZiBmb2xkZXJzLCBzbyBoYW5kbGUgaXRlbXMgaW5zdGVhZCBvZiBmaWxlc1xuICAgICAgICAgIHRoaXMuX2FkZEZpbGVzRnJvbUl0ZW1zKGl0ZW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUZpbGVzKGZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwYXN0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXN0ZShlKSB7XG4gICAgICBpZiAoX19ndWFyZF9fKGUgIT0gbnVsbCA/IGUuY2xpcGJvYXJkRGF0YSA6IHVuZGVmaW5lZCwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIHguaXRlbXM7XG4gICAgICB9KSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0KFwicGFzdGVcIiwgZSk7XG4gICAgICB2YXIgaXRlbXMgPSBlLmNsaXBib2FyZERhdGEuaXRlbXM7XG5cblxuICAgICAgaWYgKGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkRmlsZXNGcm9tSXRlbXMoaXRlbXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVGaWxlcyhmaWxlcykge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMTQgPSBmaWxlcywgX2lzQXJyYXkxNCA9IHRydWUsIF9pMTUgPSAwLCBfaXRlcmF0b3IxNCA9IF9pc0FycmF5MTQgPyBfaXRlcmF0b3IxNCA6IF9pdGVyYXRvcjE0W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMTM7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MTQpIHtcbiAgICAgICAgICBpZiAoX2kxNSA+PSBfaXRlcmF0b3IxNC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxMyA9IF9pdGVyYXRvcjE0W19pMTUrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kxNSA9IF9pdGVyYXRvcjE0Lm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kxNS5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMTMgPSBfaTE1LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGUgPSBfcmVmMTM7XG5cbiAgICAgICAgdGhpcy5hZGRGaWxlKGZpbGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdoZW4gYSBmb2xkZXIgaXMgZHJvcHBlZCAob3IgZmlsZXMgYXJlIHBhc3RlZCksIGl0ZW1zIG11c3QgYmUgaGFuZGxlZFxuICAgIC8vIGluc3RlYWQgb2YgZmlsZXMuXG5cbiAgfSwge1xuICAgIGtleTogXCJfYWRkRmlsZXNGcm9tSXRlbXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2FkZEZpbGVzRnJvbUl0ZW1zKGl0ZW1zKSB7XG4gICAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IxNSA9IGl0ZW1zLCBfaXNBcnJheTE1ID0gdHJ1ZSwgX2kxNiA9IDAsIF9pdGVyYXRvcjE1ID0gX2lzQXJyYXkxNSA/IF9pdGVyYXRvcjE1IDogX2l0ZXJhdG9yMTVbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjE0O1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MTUpIHtcbiAgICAgICAgICAgIGlmIChfaTE2ID49IF9pdGVyYXRvcjE1Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTQgPSBfaXRlcmF0b3IxNVtfaTE2KytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTE2ID0gX2l0ZXJhdG9yMTUubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMTYuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTQgPSBfaTE2LnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBpdGVtID0gX3JlZjE0O1xuXG4gICAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICAgIGlmIChpdGVtLndlYmtpdEdldEFzRW50cnkgIT0gbnVsbCAmJiAoZW50cnkgPSBpdGVtLndlYmtpdEdldEFzRW50cnkoKSkpIHtcbiAgICAgICAgICAgIGlmIChlbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2goX3RoaXM1LmFkZEZpbGUoaXRlbS5nZXRBc0ZpbGUoKSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbnRyeS5pc0RpcmVjdG9yeSkge1xuICAgICAgICAgICAgICAvLyBBcHBlbmQgYWxsIGZpbGVzIGZyb20gdGhhdCBkaXJlY3RvcnkgdG8gZmlsZXNcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2goX3RoaXM1Ll9hZGRGaWxlc0Zyb21EaXJlY3RvcnkoZW50cnksIGVudHJ5Lm5hbWUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmdldEFzRmlsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5raW5kID09IG51bGwgfHwgaXRlbS5raW5kID09PSBcImZpbGVcIikge1xuICAgICAgICAgICAgICByZXN1bHQucHVzaChfdGhpczUuYWRkRmlsZShpdGVtLmdldEFzRmlsZSgpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSgpO1xuICAgIH1cblxuICAgIC8vIEdvZXMgdGhyb3VnaCB0aGUgZGlyZWN0b3J5LCBhbmQgYWRkcyBlYWNoIGZpbGUgaXQgZmluZHMgcmVjdXJzaXZlbHlcblxuICB9LCB7XG4gICAga2V5OiBcIl9hZGRGaWxlc0Zyb21EaXJlY3RvcnlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2FkZEZpbGVzRnJvbURpcmVjdG9yeShkaXJlY3RvcnksIHBhdGgpIHtcbiAgICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgICB2YXIgZGlyUmVhZGVyID0gZGlyZWN0b3J5LmNyZWF0ZVJlYWRlcigpO1xuXG4gICAgICB2YXIgZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gZXJyb3JIYW5kbGVyKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBfX2d1YXJkTWV0aG9kX18oY29uc29sZSwgJ2xvZycsIGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgcmV0dXJuIG8ubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgcmVhZEVudHJpZXMgPSBmdW5jdGlvbiByZWFkRW50cmllcygpIHtcbiAgICAgICAgcmV0dXJuIGRpclJlYWRlci5yZWFkRW50cmllcyhmdW5jdGlvbiAoZW50cmllcykge1xuICAgICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjE2ID0gZW50cmllcywgX2lzQXJyYXkxNiA9IHRydWUsIF9pMTcgPSAwLCBfaXRlcmF0b3IxNiA9IF9pc0FycmF5MTYgPyBfaXRlcmF0b3IxNiA6IF9pdGVyYXRvcjE2W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgIHZhciBfcmVmMTU7XG5cbiAgICAgICAgICAgICAgaWYgKF9pc0FycmF5MTYpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2kxNyA+PSBfaXRlcmF0b3IxNi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWYxNSA9IF9pdGVyYXRvcjE2W19pMTcrK107XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2kxNyA9IF9pdGVyYXRvcjE2Lm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoX2kxNy5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmMTUgPSBfaTE3LnZhbHVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gX3JlZjE1O1xuXG4gICAgICAgICAgICAgIGlmIChlbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgICAgICAgICBlbnRyeS5maWxlKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX3RoaXM2Lm9wdGlvbnMuaWdub3JlSGlkZGVuRmlsZXMgJiYgZmlsZS5uYW1lLnN1YnN0cmluZygwLCAxKSA9PT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGZpbGUuZnVsbFBhdGggPSBwYXRoICsgXCIvXCIgKyBmaWxlLm5hbWU7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM2LmFkZEZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgICAgICAgICBfdGhpczYuX2FkZEZpbGVzRnJvbURpcmVjdG9yeShlbnRyeSwgcGF0aCArIFwiL1wiICsgZW50cnkubmFtZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVjdXJzaXZlbHkgY2FsbCByZWFkRW50cmllcygpIGFnYWluLCBzaW5jZSBicm93c2VyIG9ubHkgaGFuZGxlXG4gICAgICAgICAgICAvLyB0aGUgZmlyc3QgMTAwIGVudHJpZXMuXG4gICAgICAgICAgICAvLyBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9EaXJlY3RvcnlSZWFkZXIjcmVhZEVudHJpZXNcbiAgICAgICAgICAgIHJlYWRFbnRyaWVzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LCBlcnJvckhhbmRsZXIpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHJlYWRFbnRyaWVzKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgYGRvbmUoKWAgaXMgY2FsbGVkIHdpdGhvdXQgYXJndW1lbnQgdGhlIGZpbGUgaXMgYWNjZXB0ZWRcbiAgICAvLyBJZiB5b3UgY2FsbCBpdCB3aXRoIGFuIGVycm9yIG1lc3NhZ2UsIHRoZSBmaWxlIGlzIHJlamVjdGVkXG4gICAgLy8gKFRoaXMgYWxsb3dzIGZvciBhc3luY2hyb25vdXMgdmFsaWRhdGlvbilcbiAgICAvL1xuICAgIC8vIFRoaXMgZnVuY3Rpb24gY2hlY2tzIHRoZSBmaWxlc2l6ZSwgYW5kIGlmIHRoZSBmaWxlLnR5cGUgcGFzc2VzIHRoZVxuICAgIC8vIGBhY2NlcHRlZEZpbGVzYCBjaGVjay5cblxuICB9LCB7XG4gICAga2V5OiBcImFjY2VwdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhY2NlcHQoZmlsZSwgZG9uZSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5tYXhGaWxlc2l6ZSAmJiBmaWxlLnNpemUgPiB0aGlzLm9wdGlvbnMubWF4RmlsZXNpemUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICByZXR1cm4gZG9uZSh0aGlzLm9wdGlvbnMuZGljdEZpbGVUb29CaWcucmVwbGFjZShcInt7ZmlsZXNpemV9fVwiLCBNYXRoLnJvdW5kKGZpbGUuc2l6ZSAvIDEwMjQgLyAxMC4yNCkgLyAxMDApLnJlcGxhY2UoXCJ7e21heEZpbGVzaXplfX1cIiwgdGhpcy5vcHRpb25zLm1heEZpbGVzaXplKSk7XG4gICAgICB9IGVsc2UgaWYgKCFEcm9wem9uZS5pc1ZhbGlkRmlsZShmaWxlLCB0aGlzLm9wdGlvbnMuYWNjZXB0ZWRGaWxlcykpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUodGhpcy5vcHRpb25zLmRpY3RJbnZhbGlkRmlsZVR5cGUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMubWF4RmlsZXMgIT0gbnVsbCAmJiB0aGlzLmdldEFjY2VwdGVkRmlsZXMoKS5sZW5ndGggPj0gdGhpcy5vcHRpb25zLm1heEZpbGVzKSB7XG4gICAgICAgIGRvbmUodGhpcy5vcHRpb25zLmRpY3RNYXhGaWxlc0V4Y2VlZGVkLnJlcGxhY2UoXCJ7e21heEZpbGVzfX1cIiwgdGhpcy5vcHRpb25zLm1heEZpbGVzKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXQoXCJtYXhmaWxlc2V4Y2VlZGVkXCIsIGZpbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5hY2NlcHQuY2FsbCh0aGlzLCBmaWxlLCBkb25lKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRGaWxlKGZpbGUpIHtcbiAgICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgICBmaWxlLnVwbG9hZCA9IHtcbiAgICAgICAgdXVpZDogRHJvcHpvbmUudXVpZHY0KCksXG4gICAgICAgIHByb2dyZXNzOiAwLFxuICAgICAgICAvLyBTZXR0aW5nIHRoZSB0b3RhbCB1cGxvYWQgc2l6ZSB0byBmaWxlLnNpemUgZm9yIHRoZSBiZWdpbm5pbmdcbiAgICAgICAgLy8gSXQncyBhY3R1YWwgZGlmZmVyZW50IHRoYW4gdGhlIHNpemUgdG8gYmUgdHJhbnNtaXR0ZWQuXG4gICAgICAgIHRvdGFsOiBmaWxlLnNpemUsXG4gICAgICAgIGJ5dGVzU2VudDogMCxcbiAgICAgICAgZmlsZW5hbWU6IHRoaXMuX3JlbmFtZUZpbGUoZmlsZSksXG4gICAgICAgIGNodW5rZWQ6IHRoaXMub3B0aW9ucy5jaHVua2luZyAmJiAodGhpcy5vcHRpb25zLmZvcmNlQ2h1bmtpbmcgfHwgZmlsZS5zaXplID4gdGhpcy5vcHRpb25zLmNodW5rU2l6ZSksXG4gICAgICAgIHRvdGFsQ2h1bmtDb3VudDogTWF0aC5jZWlsKGZpbGUuc2l6ZSAvIHRoaXMub3B0aW9ucy5jaHVua1NpemUpXG4gICAgICB9O1xuICAgICAgdGhpcy5maWxlcy5wdXNoKGZpbGUpO1xuXG4gICAgICBmaWxlLnN0YXR1cyA9IERyb3B6b25lLkFEREVEO1xuXG4gICAgICB0aGlzLmVtaXQoXCJhZGRlZGZpbGVcIiwgZmlsZSk7XG5cbiAgICAgIHRoaXMuX2VucXVldWVUaHVtYm5haWwoZmlsZSk7XG5cbiAgICAgIHJldHVybiB0aGlzLmFjY2VwdChmaWxlLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgZmlsZS5hY2NlcHRlZCA9IGZhbHNlO1xuICAgICAgICAgIF90aGlzNy5fZXJyb3JQcm9jZXNzaW5nKFtmaWxlXSwgZXJyb3IpOyAvLyBXaWxsIHNldCB0aGUgZmlsZS5zdGF0dXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlLmFjY2VwdGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoX3RoaXM3Lm9wdGlvbnMuYXV0b1F1ZXVlKSB7XG4gICAgICAgICAgICBfdGhpczcuZW5xdWV1ZUZpbGUoZmlsZSk7XG4gICAgICAgICAgfSAvLyBXaWxsIHNldCAuYWNjZXB0ZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF90aGlzNy5fdXBkYXRlTWF4RmlsZXNSZWFjaGVkQ2xhc3MoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdyYXBwZXIgZm9yIGVucXVldWVGaWxlXG5cbiAgfSwge1xuICAgIGtleTogXCJlbnF1ZXVlRmlsZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5xdWV1ZUZpbGVzKGZpbGVzKSB7XG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IxNyA9IGZpbGVzLCBfaXNBcnJheTE3ID0gdHJ1ZSwgX2kxOCA9IDAsIF9pdGVyYXRvcjE3ID0gX2lzQXJyYXkxNyA/IF9pdGVyYXRvcjE3IDogX2l0ZXJhdG9yMTdbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYxNjtcblxuICAgICAgICBpZiAoX2lzQXJyYXkxNykge1xuICAgICAgICAgIGlmIChfaTE4ID49IF9pdGVyYXRvcjE3Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjE2ID0gX2l0ZXJhdG9yMTdbX2kxOCsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTE4ID0gX2l0ZXJhdG9yMTcubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTE4LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxNiA9IF9pMTgudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZSA9IF9yZWYxNjtcblxuICAgICAgICB0aGlzLmVucXVldWVGaWxlKGZpbGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImVucXVldWVGaWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVucXVldWVGaWxlKGZpbGUpIHtcbiAgICAgIHZhciBfdGhpczggPSB0aGlzO1xuXG4gICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLkFEREVEICYmIGZpbGUuYWNjZXB0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5RVUVVRUQ7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1Byb2Nlc3NRdWV1ZSkge1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczgucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICAgICAgfSwgMCk7IC8vIERlZmVycmluZyB0aGUgY2FsbFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGZpbGUgY2FuJ3QgYmUgcXVldWVkIGJlY2F1c2UgaXQgaGFzIGFscmVhZHkgYmVlbiBwcm9jZXNzZWQgb3Igd2FzIHJlamVjdGVkLlwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2VucXVldWVUaHVtYm5haWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2VucXVldWVUaHVtYm5haWwoZmlsZSkge1xuICAgICAgdmFyIF90aGlzOSA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3JlYXRlSW1hZ2VUaHVtYm5haWxzICYmIGZpbGUudHlwZS5tYXRjaCgvaW1hZ2UuKi8pICYmIGZpbGUuc2l6ZSA8PSB0aGlzLm9wdGlvbnMubWF4VGh1bWJuYWlsRmlsZXNpemUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgICB0aGlzLl90aHVtYm5haWxRdWV1ZS5wdXNoKGZpbGUpO1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzOS5fcHJvY2Vzc1RodW1ibmFpbFF1ZXVlKCk7XG4gICAgICAgIH0sIDApOyAvLyBEZWZlcnJpbmcgdGhlIGNhbGxcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX3Byb2Nlc3NUaHVtYm5haWxRdWV1ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcHJvY2Vzc1RodW1ibmFpbFF1ZXVlKCkge1xuICAgICAgdmFyIF90aGlzMTAgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy5fcHJvY2Vzc2luZ1RodW1ibmFpbCB8fCB0aGlzLl90aHVtYm5haWxRdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wcm9jZXNzaW5nVGh1bWJuYWlsID0gdHJ1ZTtcbiAgICAgIHZhciBmaWxlID0gdGhpcy5fdGh1bWJuYWlsUXVldWUuc2hpZnQoKTtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVRodW1ibmFpbChmaWxlLCB0aGlzLm9wdGlvbnMudGh1bWJuYWlsV2lkdGgsIHRoaXMub3B0aW9ucy50aHVtYm5haWxIZWlnaHQsIHRoaXMub3B0aW9ucy50aHVtYm5haWxNZXRob2QsIHRydWUsIGZ1bmN0aW9uIChkYXRhVXJsKSB7XG4gICAgICAgIF90aGlzMTAuZW1pdChcInRodW1ibmFpbFwiLCBmaWxlLCBkYXRhVXJsKTtcbiAgICAgICAgX3RoaXMxMC5fcHJvY2Vzc2luZ1RodW1ibmFpbCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gX3RoaXMxMC5fcHJvY2Vzc1RodW1ibmFpbFF1ZXVlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDYW4gYmUgY2FsbGVkIGJ5IHRoZSB1c2VyIHRvIHJlbW92ZSBhIGZpbGVcblxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZUZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRmlsZShmaWxlKSB7XG4gICAgICBpZiAoZmlsZS5zdGF0dXMgPT09IERyb3B6b25lLlVQTE9BRElORykge1xuICAgICAgICB0aGlzLmNhbmNlbFVwbG9hZChmaWxlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsZXMgPSB3aXRob3V0KHRoaXMuZmlsZXMsIGZpbGUpO1xuXG4gICAgICB0aGlzLmVtaXQoXCJyZW1vdmVkZmlsZVwiLCBmaWxlKTtcbiAgICAgIGlmICh0aGlzLmZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0KFwicmVzZXRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlcyBhbGwgZmlsZXMgdGhhdCBhcmVuJ3QgY3VycmVudGx5IHByb2Nlc3NlZCBmcm9tIHRoZSBsaXN0XG5cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVBbGxGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVBbGxGaWxlcyhjYW5jZWxJZk5lY2Vzc2FyeSkge1xuICAgICAgLy8gQ3JlYXRlIGEgY29weSBvZiBmaWxlcyBzaW5jZSByZW1vdmVGaWxlKCkgY2hhbmdlcyB0aGUgQGZpbGVzIGFycmF5LlxuICAgICAgaWYgKGNhbmNlbElmTmVjZXNzYXJ5ID09IG51bGwpIHtcbiAgICAgICAgY2FuY2VsSWZOZWNlc3NhcnkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjE4ID0gdGhpcy5maWxlcy5zbGljZSgpLCBfaXNBcnJheTE4ID0gdHJ1ZSwgX2kxOSA9IDAsIF9pdGVyYXRvcjE4ID0gX2lzQXJyYXkxOCA/IF9pdGVyYXRvcjE4IDogX2l0ZXJhdG9yMThbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYxNztcblxuICAgICAgICBpZiAoX2lzQXJyYXkxOCkge1xuICAgICAgICAgIGlmIChfaTE5ID49IF9pdGVyYXRvcjE4Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjE3ID0gX2l0ZXJhdG9yMThbX2kxOSsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTE5ID0gX2l0ZXJhdG9yMTgubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTE5LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYxNyA9IF9pMTkudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZSA9IF9yZWYxNztcblxuICAgICAgICBpZiAoZmlsZS5zdGF0dXMgIT09IERyb3B6b25lLlVQTE9BRElORyB8fCBjYW5jZWxJZk5lY2Vzc2FyeSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlRmlsZShmaWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gUmVzaXplcyBhbiBpbWFnZSBiZWZvcmUgaXQgZ2V0cyBzZW50IHRvIHRoZSBzZXJ2ZXIuIFRoaXMgZnVuY3Rpb24gaXMgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2ZcbiAgICAvLyBgb3B0aW9ucy50cmFuc2Zvcm1GaWxlYCBpZiBgcmVzaXplV2lkdGhgIG9yIGByZXNpemVIZWlnaHRgIGFyZSBzZXQuIFRoZSBjYWxsYmFjayBpcyBpbnZva2VkIHdpdGhcbiAgICAvLyB0aGUgcmVzaXplZCBibG9iLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVzaXplSW1hZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzaXplSW1hZ2UoZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kLCBjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzMTEgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVUaHVtYm5haWwoZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kLCB0cnVlLCBmdW5jdGlvbiAoZGF0YVVybCwgY2FudmFzKSB7XG4gICAgICAgIGlmIChjYW52YXMgPT0gbnVsbCkge1xuICAgICAgICAgIC8vIFRoZSBpbWFnZSBoYXMgbm90IGJlZW4gcmVzaXplZFxuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhmaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcmVzaXplTWltZVR5cGUgPSBfdGhpczExLm9wdGlvbnMucmVzaXplTWltZVR5cGU7XG5cbiAgICAgICAgICBpZiAocmVzaXplTWltZVR5cGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzaXplTWltZVR5cGUgPSBmaWxlLnR5cGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciByZXNpemVkRGF0YVVSTCA9IGNhbnZhcy50b0RhdGFVUkwocmVzaXplTWltZVR5cGUsIF90aGlzMTEub3B0aW9ucy5yZXNpemVRdWFsaXR5KTtcbiAgICAgICAgICBpZiAocmVzaXplTWltZVR5cGUgPT09ICdpbWFnZS9qcGVnJyB8fCByZXNpemVNaW1lVHlwZSA9PT0gJ2ltYWdlL2pwZycpIHtcbiAgICAgICAgICAgIC8vIE5vdyBhZGQgdGhlIG9yaWdpbmFsIEVYSUYgaW5mb3JtYXRpb25cbiAgICAgICAgICAgIHJlc2l6ZWREYXRhVVJMID0gRXhpZlJlc3RvcmUucmVzdG9yZShmaWxlLmRhdGFVUkwsIHJlc2l6ZWREYXRhVVJMKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKERyb3B6b25lLmRhdGFVUkl0b0Jsb2IocmVzaXplZERhdGFVUkwpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZVRodW1ibmFpbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVUaHVtYm5haWwoZmlsZSwgd2lkdGgsIGhlaWdodCwgcmVzaXplTWV0aG9kLCBmaXhPcmllbnRhdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpczEyID0gdGhpcztcblxuICAgICAgdmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBmaWxlLmRhdGFVUkwgPSBmaWxlUmVhZGVyLnJlc3VsdDtcblxuICAgICAgICAvLyBEb24ndCBib3RoZXIgY3JlYXRpbmcgYSB0aHVtYm5haWwgZm9yIFNWRyBpbWFnZXMgc2luY2UgdGhleSdyZSB2ZWN0b3JcbiAgICAgICAgaWYgKGZpbGUudHlwZSA9PT0gXCJpbWFnZS9zdmcreG1sXCIpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FsbGJhY2soZmlsZVJlYWRlci5yZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RoaXMxMi5jcmVhdGVUaHVtYm5haWxGcm9tVXJsKGZpbGUsIHdpZHRoLCBoZWlnaHQsIHJlc2l6ZU1ldGhvZCwgZml4T3JpZW50YXRpb24sIGNhbGxiYWNrKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZVRodW1ibmFpbEZyb21VcmxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlVGh1bWJuYWlsRnJvbVVybChmaWxlLCB3aWR0aCwgaGVpZ2h0LCByZXNpemVNZXRob2QsIGZpeE9yaWVudGF0aW9uLCBjYWxsYmFjaywgY3Jvc3NPcmlnaW4pIHtcbiAgICAgIHZhciBfdGhpczEzID0gdGhpcztcblxuICAgICAgLy8gTm90IHVzaW5nIGBuZXcgSW1hZ2VgIGhlcmUgYmVjYXVzZSBvZiBhIGJ1ZyBpbiBsYXRlc3QgQ2hyb21lIHZlcnNpb25zLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbnlvL2Ryb3B6b25lL3B1bGwvMjI2XG4gICAgICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblxuICAgICAgaWYgKGNyb3NzT3JpZ2luKSB7XG4gICAgICAgIGltZy5jcm9zc09yaWdpbiA9IGNyb3NzT3JpZ2luO1xuICAgICAgfVxuXG4gICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbG9hZEV4aWYgPSBmdW5jdGlvbiBsb2FkRXhpZihjYWxsYmFjaykge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjaygxKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBFWElGICE9PSAndW5kZWZpbmVkJyAmJiBFWElGICE9PSBudWxsICYmIGZpeE9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgbG9hZEV4aWYgPSBmdW5jdGlvbiBsb2FkRXhpZihjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIEVYSUYuZ2V0RGF0YShpbWcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKEVYSUYuZ2V0VGFnKHRoaXMsICdPcmllbnRhdGlvbicpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9hZEV4aWYoZnVuY3Rpb24gKG9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgZmlsZS53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgICBmaWxlLmhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICAgICAgICB2YXIgcmVzaXplSW5mbyA9IF90aGlzMTMub3B0aW9ucy5yZXNpemUuY2FsbChfdGhpczEzLCBmaWxlLCB3aWR0aCwgaGVpZ2h0LCByZXNpemVNZXRob2QpO1xuXG4gICAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgICAgICBjYW52YXMud2lkdGggPSByZXNpemVJbmZvLnRyZ1dpZHRoO1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSByZXNpemVJbmZvLnRyZ0hlaWdodDtcblxuICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA+IDQpIHtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHJlc2l6ZUluZm8udHJnSGVpZ2h0O1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHJlc2l6ZUluZm8udHJnV2lkdGg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3dpdGNoIChvcmllbnRhdGlvbikge1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAvLyBob3Jpem9udGFsIGZsaXBcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShjYW52YXMud2lkdGgsIDApO1xuICAgICAgICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgLy8gMTgwwrAgcm90YXRlIGxlZnRcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgICBjdHgucm90YXRlKE1hdGguUEkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgLy8gdmVydGljYWwgZmxpcFxuICAgICAgICAgICAgICBjdHgudHJhbnNsYXRlKDAsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgLy8gdmVydGljYWwgZmxpcCArIDkwIHJvdGF0ZSByaWdodFxuICAgICAgICAgICAgICBjdHgucm90YXRlKDAuNSAqIE1hdGguUEkpO1xuICAgICAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgLy8gOTDCsCByb3RhdGUgcmlnaHRcbiAgICAgICAgICAgICAgY3R4LnJvdGF0ZSgwLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtY2FudmFzLndpZHRoKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgIC8vIGhvcml6b250YWwgZmxpcCArIDkwIHJvdGF0ZSByaWdodFxuICAgICAgICAgICAgICBjdHgucm90YXRlKDAuNSAqIE1hdGguUEkpO1xuICAgICAgICAgICAgICBjdHgudHJhbnNsYXRlKGNhbnZhcy5oZWlnaHQsIC1jYW52YXMud2lkdGgpO1xuICAgICAgICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgLy8gOTDCsCByb3RhdGUgbGVmdFxuICAgICAgICAgICAgICBjdHgucm90YXRlKC0wLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSgtY2FudmFzLmhlaWdodCwgMCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgaXMgYSBidWdmaXggZm9yIGlPUycgc2NhbGluZyBidWcuXG4gICAgICAgICAgZHJhd0ltYWdlSU9TRml4KGN0eCwgaW1nLCByZXNpemVJbmZvLnNyY1ggIT0gbnVsbCA/IHJlc2l6ZUluZm8uc3JjWCA6IDAsIHJlc2l6ZUluZm8uc3JjWSAhPSBudWxsID8gcmVzaXplSW5mby5zcmNZIDogMCwgcmVzaXplSW5mby5zcmNXaWR0aCwgcmVzaXplSW5mby5zcmNIZWlnaHQsIHJlc2l6ZUluZm8udHJnWCAhPSBudWxsID8gcmVzaXplSW5mby50cmdYIDogMCwgcmVzaXplSW5mby50cmdZICE9IG51bGwgPyByZXNpemVJbmZvLnRyZ1kgOiAwLCByZXNpemVJbmZvLnRyZ1dpZHRoLCByZXNpemVJbmZvLnRyZ0hlaWdodCk7XG5cbiAgICAgICAgICB2YXIgdGh1bWJuYWlsID0gY2FudmFzLnRvRGF0YVVSTChcImltYWdlL3BuZ1wiKTtcblxuICAgICAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodGh1bWJuYWlsLCBjYW52YXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICBpbWcub25lcnJvciA9IGNhbGxiYWNrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW1nLnNyYyA9IGZpbGUuZGF0YVVSTDtcbiAgICB9XG5cbiAgICAvLyBHb2VzIHRocm91Z2ggdGhlIHF1ZXVlIGFuZCBwcm9jZXNzZXMgZmlsZXMgaWYgdGhlcmUgYXJlbid0IHRvbyBtYW55IGFscmVhZHkuXG5cbiAgfSwge1xuICAgIGtleTogXCJwcm9jZXNzUXVldWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2Vzc1F1ZXVlKCkge1xuICAgICAgdmFyIHBhcmFsbGVsVXBsb2FkcyA9IHRoaXMub3B0aW9ucy5wYXJhbGxlbFVwbG9hZHM7XG5cbiAgICAgIHZhciBwcm9jZXNzaW5nTGVuZ3RoID0gdGhpcy5nZXRVcGxvYWRpbmdGaWxlcygpLmxlbmd0aDtcbiAgICAgIHZhciBpID0gcHJvY2Vzc2luZ0xlbmd0aDtcblxuICAgICAgLy8gVGhlcmUgYXJlIGFscmVhZHkgYXQgbGVhc3QgYXMgbWFueSBmaWxlcyB1cGxvYWRpbmcgdGhhbiBzaG91bGQgYmVcbiAgICAgIGlmIChwcm9jZXNzaW5nTGVuZ3RoID49IHBhcmFsbGVsVXBsb2Fkcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBxdWV1ZWRGaWxlcyA9IHRoaXMuZ2V0UXVldWVkRmlsZXMoKTtcblxuICAgICAgaWYgKCEocXVldWVkRmlsZXMubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgIC8vIFRoZSBmaWxlcyBzaG91bGQgYmUgdXBsb2FkZWQgaW4gb25lIHJlcXVlc3RcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0ZpbGVzKHF1ZXVlZEZpbGVzLnNsaWNlKDAsIHBhcmFsbGVsVXBsb2FkcyAtIHByb2Nlc3NpbmdMZW5ndGgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChpIDwgcGFyYWxsZWxVcGxvYWRzKSB7XG4gICAgICAgICAgaWYgKCFxdWV1ZWRGaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IC8vIE5vdGhpbmcgbGVmdCB0byBwcm9jZXNzXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRmlsZShxdWV1ZWRGaWxlcy5zaGlmdCgpKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXcmFwcGVyIGZvciBgcHJvY2Vzc0ZpbGVzYFxuXG4gIH0sIHtcbiAgICBrZXk6IFwicHJvY2Vzc0ZpbGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2Vzc0ZpbGUoZmlsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0ZpbGVzKFtmaWxlXSk7XG4gICAgfVxuXG4gICAgLy8gTG9hZHMgdGhlIGZpbGUsIHRoZW4gY2FsbHMgZmluaXNoZWRMb2FkaW5nKClcblxuICB9LCB7XG4gICAga2V5OiBcInByb2Nlc3NGaWxlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9jZXNzRmlsZXMoZmlsZXMpIHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjE5ID0gZmlsZXMsIF9pc0FycmF5MTkgPSB0cnVlLCBfaTIwID0gMCwgX2l0ZXJhdG9yMTkgPSBfaXNBcnJheTE5ID8gX2l0ZXJhdG9yMTkgOiBfaXRlcmF0b3IxOVtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICB2YXIgX3JlZjE4O1xuXG4gICAgICAgIGlmIChfaXNBcnJheTE5KSB7XG4gICAgICAgICAgaWYgKF9pMjAgPj0gX2l0ZXJhdG9yMTkubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICBfcmVmMTggPSBfaXRlcmF0b3IxOVtfaTIwKytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMjAgPSBfaXRlcmF0b3IxOS5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMjAuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgX3JlZjE4ID0gX2kyMC52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlID0gX3JlZjE4O1xuXG4gICAgICAgIGZpbGUucHJvY2Vzc2luZyA9IHRydWU7IC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuVVBMT0FESU5HO1xuXG4gICAgICAgIHRoaXMuZW1pdChcInByb2Nlc3NpbmdcIiwgZmlsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwicHJvY2Vzc2luZ211bHRpcGxlXCIsIGZpbGVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudXBsb2FkRmlsZXMoZmlsZXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZ2V0RmlsZXNXaXRoWGhyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRGaWxlc1dpdGhYaHIoeGhyKSB7XG4gICAgICB2YXIgZmlsZXMgPSB2b2lkIDA7XG4gICAgICByZXR1cm4gZmlsZXMgPSB0aGlzLmZpbGVzLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gZmlsZS54aHIgPT09IHhocjtcbiAgICAgIH0pLm1hcChmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIENhbmNlbHMgdGhlIGZpbGUgdXBsb2FkIGFuZCBzZXRzIHRoZSBzdGF0dXMgdG8gQ0FOQ0VMRURcbiAgICAvLyAqKmlmKiogdGhlIGZpbGUgaXMgYWN0dWFsbHkgYmVpbmcgdXBsb2FkZWQuXG4gICAgLy8gSWYgaXQncyBzdGlsbCBpbiB0aGUgcXVldWUsIHRoZSBmaWxlIGlzIGJlaW5nIHJlbW92ZWQgZnJvbSBpdCBhbmQgdGhlIHN0YXR1c1xuICAgIC8vIHNldCB0byBDQU5DRUxFRC5cblxuICB9LCB7XG4gICAga2V5OiBcImNhbmNlbFVwbG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWxVcGxvYWQoZmlsZSkge1xuICAgICAgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5VUExPQURJTkcpIHtcbiAgICAgICAgdmFyIGdyb3VwZWRGaWxlcyA9IHRoaXMuX2dldEZpbGVzV2l0aFhocihmaWxlLnhocik7XG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIwID0gZ3JvdXBlZEZpbGVzLCBfaXNBcnJheTIwID0gdHJ1ZSwgX2kyMSA9IDAsIF9pdGVyYXRvcjIwID0gX2lzQXJyYXkyMCA/IF9pdGVyYXRvcjIwIDogX2l0ZXJhdG9yMjBbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjE5O1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MjApIHtcbiAgICAgICAgICAgIGlmIChfaTIxID49IF9pdGVyYXRvcjIwLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTkgPSBfaXRlcmF0b3IyMFtfaTIxKytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTIxID0gX2l0ZXJhdG9yMjAubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMjEuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMTkgPSBfaTIxLnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBncm91cGVkRmlsZSA9IF9yZWYxOTtcblxuICAgICAgICAgIGdyb3VwZWRGaWxlLnN0YXR1cyA9IERyb3B6b25lLkNBTkNFTEVEO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZmlsZS54aHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgZmlsZS54aHIuYWJvcnQoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyMSA9IGdyb3VwZWRGaWxlcywgX2lzQXJyYXkyMSA9IHRydWUsIF9pMjIgPSAwLCBfaXRlcmF0b3IyMSA9IF9pc0FycmF5MjEgPyBfaXRlcmF0b3IyMSA6IF9pdGVyYXRvcjIxW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYyMDtcblxuICAgICAgICAgIGlmIChfaXNBcnJheTIxKSB7XG4gICAgICAgICAgICBpZiAoX2kyMiA+PSBfaXRlcmF0b3IyMS5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjIwID0gX2l0ZXJhdG9yMjFbX2kyMisrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kyMiA9IF9pdGVyYXRvcjIxLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTIyLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjIwID0gX2kyMi52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2dyb3VwZWRGaWxlID0gX3JlZjIwO1xuXG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRcIiwgX2dyb3VwZWRGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRtdWx0aXBsZVwiLCBncm91cGVkRmlsZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGZpbGUuc3RhdHVzID09PSBEcm9wem9uZS5BRERFRCB8fCBmaWxlLnN0YXR1cyA9PT0gRHJvcHpvbmUuUVVFVUVEKSB7XG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuQ0FOQ0VMRUQ7XG4gICAgICAgIHRoaXMuZW1pdChcImNhbmNlbGVkXCIsIGZpbGUpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2FuY2VsZWRtdWx0aXBsZVwiLCBbZmlsZV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1Byb2Nlc3NRdWV1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzUXVldWUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVzb2x2ZU9wdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXNvbHZlT3B0aW9uKG9wdGlvbikge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgICAgIGFyZ3NbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidXBsb2FkRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGxvYWRGaWxlKGZpbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnVwbG9hZEZpbGVzKFtmaWxlXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwbG9hZEZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZEZpbGVzKGZpbGVzKSB7XG4gICAgICB2YXIgX3RoaXMxNCA9IHRoaXM7XG5cbiAgICAgIHRoaXMuX3RyYW5zZm9ybUZpbGVzKGZpbGVzLCBmdW5jdGlvbiAodHJhbnNmb3JtZWRGaWxlcykge1xuICAgICAgICBpZiAoZmlsZXNbMF0udXBsb2FkLmNodW5rZWQpIHtcbiAgICAgICAgICAvLyBUaGlzIGZpbGUgc2hvdWxkIGJlIHNlbnQgaW4gY2h1bmtzIVxuXG4gICAgICAgICAgLy8gSWYgdGhlIGNodW5raW5nIG9wdGlvbiBpcyBzZXQsIHdlICoqa25vdyoqIHRoYXQgdGhlcmUgY2FuIG9ubHkgYmUgKipvbmUqKiBmaWxlLCBzaW5jZVxuICAgICAgICAgIC8vIHVwbG9hZE11bHRpcGxlIGlzIG5vdCBhbGxvd2VkIHdpdGggdGhpcyBvcHRpb24uXG4gICAgICAgICAgdmFyIGZpbGUgPSBmaWxlc1swXTtcbiAgICAgICAgICB2YXIgdHJhbnNmb3JtZWRGaWxlID0gdHJhbnNmb3JtZWRGaWxlc1swXTtcbiAgICAgICAgICB2YXIgc3RhcnRlZENodW5rQ291bnQgPSAwO1xuXG4gICAgICAgICAgZmlsZS51cGxvYWQuY2h1bmtzID0gW107XG5cbiAgICAgICAgICB2YXIgaGFuZGxlTmV4dENodW5rID0gZnVuY3Rpb24gaGFuZGxlTmV4dENodW5rKCkge1xuICAgICAgICAgICAgdmFyIGNodW5rSW5kZXggPSAwO1xuXG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBuZXh0IGl0ZW0gaW4gZmlsZS51cGxvYWQuY2h1bmtzIHRoYXQgaXMgbm90IGRlZmluZWQgeWV0LlxuICAgICAgICAgICAgd2hpbGUgKGZpbGUudXBsb2FkLmNodW5rc1tjaHVua0luZGV4XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGNodW5rSW5kZXgrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhpcyBtZWFucywgdGhhdCBhbGwgY2h1bmtzIGhhdmUgYWxyZWFkeSBiZWVuIHN0YXJ0ZWQuXG4gICAgICAgICAgICBpZiAoY2h1bmtJbmRleCA+PSBmaWxlLnVwbG9hZC50b3RhbENodW5rQ291bnQpIHJldHVybjtcblxuICAgICAgICAgICAgc3RhcnRlZENodW5rQ291bnQrKztcblxuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gY2h1bmtJbmRleCAqIF90aGlzMTQub3B0aW9ucy5jaHVua1NpemU7XG4gICAgICAgICAgICB2YXIgZW5kID0gTWF0aC5taW4oc3RhcnQgKyBfdGhpczE0Lm9wdGlvbnMuY2h1bmtTaXplLCBmaWxlLnNpemUpO1xuXG4gICAgICAgICAgICB2YXIgZGF0YUJsb2NrID0ge1xuICAgICAgICAgICAgICBuYW1lOiBfdGhpczE0Ll9nZXRQYXJhbU5hbWUoMCksXG4gICAgICAgICAgICAgIGRhdGE6IHRyYW5zZm9ybWVkRmlsZS53ZWJraXRTbGljZSA/IHRyYW5zZm9ybWVkRmlsZS53ZWJraXRTbGljZShzdGFydCwgZW5kKSA6IHRyYW5zZm9ybWVkRmlsZS5zbGljZShzdGFydCwgZW5kKSxcbiAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGUudXBsb2FkLmZpbGVuYW1lLFxuICAgICAgICAgICAgICBjaHVua0luZGV4OiBjaHVua0luZGV4XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmaWxlLnVwbG9hZC5jaHVua3NbY2h1bmtJbmRleF0gPSB7XG4gICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgIGluZGV4OiBjaHVua0luZGV4LFxuICAgICAgICAgICAgICBkYXRhQmxvY2s6IGRhdGFCbG9jaywgLy8gSW4gY2FzZSB3ZSB3YW50IHRvIHJldHJ5LlxuICAgICAgICAgICAgICBzdGF0dXM6IERyb3B6b25lLlVQTE9BRElORyxcbiAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgICAgICAgIHJldHJpZXM6IDAgLy8gVGhlIG51bWJlciBvZiB0aW1lcyB0aGlzIGJsb2NrIGhhcyBiZWVuIHJldHJpZWQuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfdGhpczE0Ll91cGxvYWREYXRhKGZpbGVzLCBbZGF0YUJsb2NrXSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGZpbGUudXBsb2FkLmZpbmlzaGVkQ2h1bmtVcGxvYWQgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgICAgIHZhciBhbGxGaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICBjaHVuay5zdGF0dXMgPSBEcm9wem9uZS5TVUNDRVNTO1xuXG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgZGF0YSBmcm9tIHRoZSBjaHVua1xuICAgICAgICAgICAgY2h1bmsuZGF0YUJsb2NrID0gbnVsbDtcbiAgICAgICAgICAgIC8vIExlYXZpbmcgdGhpcyByZWZlcmVuY2UgdG8geGhyIGludGFjdCBoZXJlIHdpbGwgY2F1c2UgbWVtb3J5IGxlYWtzIGluIHNvbWUgYnJvd3NlcnNcbiAgICAgICAgICAgIGNodW5rLnhociA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZS51cGxvYWQudG90YWxDaHVua0NvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKGZpbGUudXBsb2FkLmNodW5rc1tpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZU5leHRDaHVuaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChmaWxlLnVwbG9hZC5jaHVua3NbaV0uc3RhdHVzICE9PSBEcm9wem9uZS5TVUNDRVNTKSB7XG4gICAgICAgICAgICAgICAgYWxsRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxsRmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgX3RoaXMxNC5vcHRpb25zLmNodW5rc1VwbG9hZGVkKGZpbGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpczE0Ll9maW5pc2hlZChmaWxlcywgJycsIG51bGwpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKF90aGlzMTQub3B0aW9ucy5wYXJhbGxlbENodW5rVXBsb2Fkcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlLnVwbG9hZC50b3RhbENodW5rQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICBoYW5kbGVOZXh0Q2h1bmsoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlTmV4dENodW5rKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBkYXRhQmxvY2tzID0gW107XG4gICAgICAgICAgZm9yICh2YXIgX2kyMyA9IDA7IF9pMjMgPCBmaWxlcy5sZW5ndGg7IF9pMjMrKykge1xuICAgICAgICAgICAgZGF0YUJsb2Nrc1tfaTIzXSA9IHtcbiAgICAgICAgICAgICAgbmFtZTogX3RoaXMxNC5fZ2V0UGFyYW1OYW1lKF9pMjMpLFxuICAgICAgICAgICAgICBkYXRhOiB0cmFuc2Zvcm1lZEZpbGVzW19pMjNdLFxuICAgICAgICAgICAgICBmaWxlbmFtZTogZmlsZXNbX2kyM10udXBsb2FkLmZpbGVuYW1lXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBfdGhpczE0Ll91cGxvYWREYXRhKGZpbGVzLCBkYXRhQmxvY2tzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8vIFJldHVybnMgdGhlIHJpZ2h0IGNodW5rIGZvciBnaXZlbiBmaWxlIGFuZCB4aHJcblxuICB9LCB7XG4gICAga2V5OiBcIl9nZXRDaHVua1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0Q2h1bmsoZmlsZSwgeGhyKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGUudXBsb2FkLnRvdGFsQ2h1bmtDb3VudDsgaSsrKSB7XG4gICAgICAgIGlmIChmaWxlLnVwbG9hZC5jaHVua3NbaV0gIT09IHVuZGVmaW5lZCAmJiBmaWxlLnVwbG9hZC5jaHVua3NbaV0ueGhyID09PSB4aHIpIHtcbiAgICAgICAgICByZXR1cm4gZmlsZS51cGxvYWQuY2h1bmtzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhY3R1YWxseSB1cGxvYWRzIHRoZSBmaWxlKHMpIHRvIHRoZSBzZXJ2ZXIuXG4gICAgLy8gSWYgZGF0YUJsb2NrcyBjb250YWlucyB0aGUgYWN0dWFsIGRhdGEgdG8gdXBsb2FkIChtZWFuaW5nLCB0aGF0IHRoaXMgY291bGQgZWl0aGVyIGJlIHRyYW5zZm9ybWVkXG4gICAgLy8gZmlsZXMsIG9yIGluZGl2aWR1YWwgY2h1bmtzIGZvciBjaHVua2VkIHVwbG9hZCkuXG5cbiAgfSwge1xuICAgIGtleTogXCJfdXBsb2FkRGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfdXBsb2FkRGF0YShmaWxlcywgZGF0YUJsb2Nrcykge1xuICAgICAgdmFyIF90aGlzMTUgPSB0aGlzO1xuXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIC8vIFB1dCB0aGUgeGhyIG9iamVjdCBpbiB0aGUgZmlsZSBvYmplY3RzIHRvIGJlIGFibGUgdG8gcmVmZXJlbmNlIGl0IGxhdGVyLlxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjIgPSBmaWxlcywgX2lzQXJyYXkyMiA9IHRydWUsIF9pMjQgPSAwLCBfaXRlcmF0b3IyMiA9IF9pc0FycmF5MjIgPyBfaXRlcmF0b3IyMiA6IF9pdGVyYXRvcjIyW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMjE7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MjIpIHtcbiAgICAgICAgICBpZiAoX2kyNCA+PSBfaXRlcmF0b3IyMi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYyMSA9IF9pdGVyYXRvcjIyW19pMjQrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kyNCA9IF9pdGVyYXRvcjIyLm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kyNC5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMjEgPSBfaTI0LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGUgPSBfcmVmMjE7XG5cbiAgICAgICAgZmlsZS54aHIgPSB4aHI7XG4gICAgICB9XG4gICAgICBpZiAoZmlsZXNbMF0udXBsb2FkLmNodW5rZWQpIHtcbiAgICAgICAgLy8gUHV0IHRoZSB4aHIgb2JqZWN0IGluIHRoZSByaWdodCBjaHVuayBvYmplY3QsIHNvIGl0IGNhbiBiZSBhc3NvY2lhdGVkIGxhdGVyLCBhbmQgZm91bmQgd2l0aCBfZ2V0Q2h1bmtcbiAgICAgICAgZmlsZXNbMF0udXBsb2FkLmNodW5rc1tkYXRhQmxvY2tzWzBdLmNodW5rSW5kZXhdLnhociA9IHhocjtcbiAgICAgIH1cblxuICAgICAgdmFyIG1ldGhvZCA9IHRoaXMucmVzb2x2ZU9wdGlvbih0aGlzLm9wdGlvbnMubWV0aG9kLCBmaWxlcyk7XG4gICAgICB2YXIgdXJsID0gdGhpcy5yZXNvbHZlT3B0aW9uKHRoaXMub3B0aW9ucy51cmwsIGZpbGVzKTtcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcblxuICAgICAgLy8gU2V0dGluZyB0aGUgdGltZW91dCBhZnRlciBvcGVuIGJlY2F1c2Ugb2YgSUUxMSBpc3N1ZTogaHR0cHM6Ly9naXRsYWIuY29tL21lbm8vZHJvcHpvbmUvaXNzdWVzLzhcbiAgICAgIHhoci50aW1lb3V0ID0gdGhpcy5yZXNvbHZlT3B0aW9uKHRoaXMub3B0aW9ucy50aW1lb3V0LCBmaWxlcyk7XG5cbiAgICAgIC8vIEhhcyB0byBiZSBhZnRlciBgLm9wZW4oKWAuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZW55by9kcm9wem9uZS9pc3N1ZXMvMTc5XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISF0aGlzLm9wdGlvbnMud2l0aENyZWRlbnRpYWxzO1xuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgX3RoaXMxNS5fZmluaXNoZWRVcGxvYWRpbmcoZmlsZXMsIHhociwgZSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMxNS5faGFuZGxlVXBsb2FkRXJyb3IoZmlsZXMsIHhocik7XG4gICAgICB9O1xuXG4gICAgICAvLyBTb21lIGJyb3dzZXJzIGRvIG5vdCBoYXZlIHRoZSAudXBsb2FkIHByb3BlcnR5XG4gICAgICB2YXIgcHJvZ3Jlc3NPYmogPSB4aHIudXBsb2FkICE9IG51bGwgPyB4aHIudXBsb2FkIDogeGhyO1xuICAgICAgcHJvZ3Jlc3NPYmoub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBfdGhpczE1Ll91cGRhdGVGaWxlc1VwbG9hZFByb2dyZXNzKGZpbGVzLCB4aHIsIGUpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGhlYWRlcnMgPSB7XG4gICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJuby1jYWNoZVwiLFxuICAgICAgICBcIlgtUmVxdWVzdGVkLVdpdGhcIjogXCJYTUxIdHRwUmVxdWVzdFwiXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgRHJvcHpvbmUuZXh0ZW5kKGhlYWRlcnMsIHRoaXMub3B0aW9ucy5oZWFkZXJzKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaGVhZGVyTmFtZSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIHZhciBoZWFkZXJWYWx1ZSA9IGhlYWRlcnNbaGVhZGVyTmFtZV07XG4gICAgICAgIGlmIChoZWFkZXJWYWx1ZSkge1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlck5hbWUsIGhlYWRlclZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgICAgLy8gQWRkaW5nIGFsbCBAb3B0aW9ucyBwYXJhbWV0ZXJzXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhcmFtcykge1xuICAgICAgICB2YXIgYWRkaXRpb25hbFBhcmFtcyA9IHRoaXMub3B0aW9ucy5wYXJhbXM7XG4gICAgICAgIGlmICh0eXBlb2YgYWRkaXRpb25hbFBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGFkZGl0aW9uYWxQYXJhbXMgPSBhZGRpdGlvbmFsUGFyYW1zLmNhbGwodGhpcywgZmlsZXMsIHhociwgZmlsZXNbMF0udXBsb2FkLmNodW5rZWQgPyB0aGlzLl9nZXRDaHVuayhmaWxlc1swXSwgeGhyKSA6IG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGFkZGl0aW9uYWxQYXJhbXMpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBhZGRpdGlvbmFsUGFyYW1zW2tleV07XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIExldCB0aGUgdXNlciBhZGQgYWRkaXRpb25hbCBkYXRhIGlmIG5lY2Vzc2FyeVxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMjMgPSBmaWxlcywgX2lzQXJyYXkyMyA9IHRydWUsIF9pMjUgPSAwLCBfaXRlcmF0b3IyMyA9IF9pc0FycmF5MjMgPyBfaXRlcmF0b3IyMyA6IF9pdGVyYXRvcjIzW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMjI7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MjMpIHtcbiAgICAgICAgICBpZiAoX2kyNSA+PSBfaXRlcmF0b3IyMy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYyMiA9IF9pdGVyYXRvcjIzW19pMjUrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kyNSA9IF9pdGVyYXRvcjIzLm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kyNS5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMjIgPSBfaTI1LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9maWxlID0gX3JlZjIyO1xuXG4gICAgICAgIHRoaXMuZW1pdChcInNlbmRpbmdcIiwgX2ZpbGUsIHhociwgZm9ybURhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy51cGxvYWRNdWx0aXBsZSkge1xuICAgICAgICB0aGlzLmVtaXQoXCJzZW5kaW5nbXVsdGlwbGVcIiwgZmlsZXMsIHhociwgZm9ybURhdGEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9hZGRGb3JtRWxlbWVudERhdGEoZm9ybURhdGEpO1xuXG4gICAgICAvLyBGaW5hbGx5IGFkZCB0aGUgZmlsZXNcbiAgICAgIC8vIEhhcyB0byBiZSBsYXN0IGJlY2F1c2Ugc29tZSBzZXJ2ZXJzIChlZzogUzMpIGV4cGVjdCB0aGUgZmlsZSB0byBiZSB0aGUgbGFzdCBwYXJhbWV0ZXJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGF0YUJsb2NrID0gZGF0YUJsb2Nrc1tpXTtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGRhdGFCbG9jay5uYW1lLCBkYXRhQmxvY2suZGF0YSwgZGF0YUJsb2NrLmZpbGVuYW1lKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdWJtaXRSZXF1ZXN0KHhociwgZm9ybURhdGEsIGZpbGVzKTtcbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm1zIGFsbCBmaWxlcyB3aXRoIHRoaXMub3B0aW9ucy50cmFuc2Zvcm1GaWxlIGFuZCBpbnZva2VzIGRvbmUgd2l0aCB0aGUgdHJhbnNmb3JtZWQgZmlsZXMgd2hlbiBkb25lLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3RyYW5zZm9ybUZpbGVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF90cmFuc2Zvcm1GaWxlcyhmaWxlcywgZG9uZSkge1xuICAgICAgdmFyIF90aGlzMTYgPSB0aGlzO1xuXG4gICAgICB2YXIgdHJhbnNmb3JtZWRGaWxlcyA9IFtdO1xuICAgICAgLy8gQ2x1bXN5IHdheSBvZiBoYW5kbGluZyBhc3luY2hyb25vdXMgY2FsbHMsIHVudGlsIEkgZ2V0IHRvIGFkZCBhIHByb3BlciBGdXR1cmUgbGlicmFyeS5cbiAgICAgIHZhciBkb25lQ291bnRlciA9IDA7XG5cbiAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKGkpIHtcbiAgICAgICAgX3RoaXMxNi5vcHRpb25zLnRyYW5zZm9ybUZpbGUuY2FsbChfdGhpczE2LCBmaWxlc1tpXSwgZnVuY3Rpb24gKHRyYW5zZm9ybWVkRmlsZSkge1xuICAgICAgICAgIHRyYW5zZm9ybWVkRmlsZXNbaV0gPSB0cmFuc2Zvcm1lZEZpbGU7XG4gICAgICAgICAgaWYgKCsrZG9uZUNvdW50ZXIgPT09IGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZG9uZSh0cmFuc2Zvcm1lZEZpbGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBfbG9vcChpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUYWtlcyBjYXJlIG9mIGFkZGluZyBvdGhlciBpbnB1dCBlbGVtZW50cyBvZiB0aGUgZm9ybSB0byB0aGUgQUpBWCByZXF1ZXN0XG5cbiAgfSwge1xuICAgIGtleTogXCJfYWRkRm9ybUVsZW1lbnREYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRGb3JtRWxlbWVudERhdGEoZm9ybURhdGEpIHtcbiAgICAgIC8vIFRha2UgY2FyZSBvZiBvdGhlciBpbnB1dCBlbGVtZW50c1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09PSBcIkZPUk1cIikge1xuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyNCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QsIGJ1dHRvblwiKSwgX2lzQXJyYXkyNCA9IHRydWUsIF9pMjYgPSAwLCBfaXRlcmF0b3IyNCA9IF9pc0FycmF5MjQgPyBfaXRlcmF0b3IyNCA6IF9pdGVyYXRvcjI0W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgdmFyIF9yZWYyMztcblxuICAgICAgICAgIGlmIChfaXNBcnJheTI0KSB7XG4gICAgICAgICAgICBpZiAoX2kyNiA+PSBfaXRlcmF0b3IyNC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjIzID0gX2l0ZXJhdG9yMjRbX2kyNisrXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2kyNiA9IF9pdGVyYXRvcjI0Lm5leHQoKTtcbiAgICAgICAgICAgIGlmIChfaTI2LmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgX3JlZjIzID0gX2kyNi52YWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaW5wdXQgPSBfcmVmMjM7XG5cbiAgICAgICAgICB2YXIgaW5wdXROYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICAgICAgICB2YXIgaW5wdXRUeXBlID0gaW5wdXQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKTtcbiAgICAgICAgICBpZiAoaW5wdXRUeXBlKSBpbnB1dFR5cGUgPSBpbnB1dFR5cGUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgIC8vIElmIHRoZSBpbnB1dCBkb2Vzbid0IGhhdmUgYSBuYW1lLCB3ZSBjYW4ndCB1c2UgaXQuXG4gICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dE5hbWUgPT09ICd1bmRlZmluZWQnIHx8IGlucHV0TmFtZSA9PT0gbnVsbCkgY29udGludWU7XG5cbiAgICAgICAgICBpZiAoaW5wdXQudGFnTmFtZSA9PT0gXCJTRUxFQ1RcIiAmJiBpbnB1dC5oYXNBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSkge1xuICAgICAgICAgICAgLy8gUG9zc2libHkgbXVsdGlwbGUgdmFsdWVzXG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyNSA9IGlucHV0Lm9wdGlvbnMsIF9pc0FycmF5MjUgPSB0cnVlLCBfaTI3ID0gMCwgX2l0ZXJhdG9yMjUgPSBfaXNBcnJheTI1ID8gX2l0ZXJhdG9yMjUgOiBfaXRlcmF0b3IyNVtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICB2YXIgX3JlZjI0O1xuXG4gICAgICAgICAgICAgIGlmIChfaXNBcnJheTI1KSB7XG4gICAgICAgICAgICAgICAgaWYgKF9pMjcgPj0gX2l0ZXJhdG9yMjUubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmMjQgPSBfaXRlcmF0b3IyNVtfaTI3KytdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9pMjcgPSBfaXRlcmF0b3IyNS5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pMjcuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjI0ID0gX2kyNy52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBvcHRpb24gPSBfcmVmMjQ7XG5cbiAgICAgICAgICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChpbnB1dE5hbWUsIG9wdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKCFpbnB1dFR5cGUgfHwgaW5wdXRUeXBlICE9PSBcImNoZWNrYm94XCIgJiYgaW5wdXRUeXBlICE9PSBcInJhZGlvXCIgfHwgaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGlucHV0TmFtZSwgaW5wdXQudmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEludm9rZWQgd2hlbiB0aGVyZSBpcyBuZXcgcHJvZ3Jlc3MgaW5mb3JtYXRpb24gYWJvdXQgZ2l2ZW4gZmlsZXMuXG4gICAgLy8gSWYgZSBpcyBub3QgcHJvdmlkZWQsIGl0IGlzIGFzc3VtZWQgdGhhdCB0aGUgdXBsb2FkIGlzIGZpbmlzaGVkLlxuXG4gIH0sIHtcbiAgICBrZXk6IFwiX3VwZGF0ZUZpbGVzVXBsb2FkUHJvZ3Jlc3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3VwZGF0ZUZpbGVzVXBsb2FkUHJvZ3Jlc3MoZmlsZXMsIHhociwgZSkge1xuICAgICAgdmFyIHByb2dyZXNzID0gdm9pZCAwO1xuICAgICAgaWYgKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwcm9ncmVzcyA9IDEwMCAqIGUubG9hZGVkIC8gZS50b3RhbDtcblxuICAgICAgICBpZiAoZmlsZXNbMF0udXBsb2FkLmNodW5rZWQpIHtcbiAgICAgICAgICB2YXIgZmlsZSA9IGZpbGVzWzBdO1xuICAgICAgICAgIC8vIFNpbmNlIHRoaXMgaXMgYSBjaHVua2VkIHVwbG9hZCwgd2UgbmVlZCB0byB1cGRhdGUgdGhlIGFwcHJvcHJpYXRlIGNodW5rIHByb2dyZXNzLlxuICAgICAgICAgIHZhciBjaHVuayA9IHRoaXMuX2dldENodW5rKGZpbGUsIHhocik7XG4gICAgICAgICAgY2h1bmsucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgICBjaHVuay50b3RhbCA9IGUudG90YWw7XG4gICAgICAgICAgY2h1bmsuYnl0ZXNTZW50ID0gZS5sb2FkZWQ7XG4gICAgICAgICAgdmFyIGZpbGVQcm9ncmVzcyA9IDAsXG4gICAgICAgICAgICAgIGZpbGVUb3RhbCA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgZmlsZUJ5dGVzU2VudCA9IHZvaWQgMDtcbiAgICAgICAgICBmaWxlLnVwbG9hZC5wcm9ncmVzcyA9IDA7XG4gICAgICAgICAgZmlsZS51cGxvYWQudG90YWwgPSAwO1xuICAgICAgICAgIGZpbGUudXBsb2FkLmJ5dGVzU2VudCA9IDA7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlLnVwbG9hZC50b3RhbENodW5rQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZpbGUudXBsb2FkLmNodW5rc1tpXSAhPT0gdW5kZWZpbmVkICYmIGZpbGUudXBsb2FkLmNodW5rc1tpXS5wcm9ncmVzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGZpbGUudXBsb2FkLnByb2dyZXNzICs9IGZpbGUudXBsb2FkLmNodW5rc1tpXS5wcm9ncmVzcztcbiAgICAgICAgICAgICAgZmlsZS51cGxvYWQudG90YWwgKz0gZmlsZS51cGxvYWQuY2h1bmtzW2ldLnRvdGFsO1xuICAgICAgICAgICAgICBmaWxlLnVwbG9hZC5ieXRlc1NlbnQgKz0gZmlsZS51cGxvYWQuY2h1bmtzW2ldLmJ5dGVzU2VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZmlsZS51cGxvYWQucHJvZ3Jlc3MgPSBmaWxlLnVwbG9hZC5wcm9ncmVzcyAvIGZpbGUudXBsb2FkLnRvdGFsQ2h1bmtDb3VudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyNiA9IGZpbGVzLCBfaXNBcnJheTI2ID0gdHJ1ZSwgX2kyOCA9IDAsIF9pdGVyYXRvcjI2ID0gX2lzQXJyYXkyNiA/IF9pdGVyYXRvcjI2IDogX2l0ZXJhdG9yMjZbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgIHZhciBfcmVmMjU7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheTI2KSB7XG4gICAgICAgICAgICAgIGlmIChfaTI4ID49IF9pdGVyYXRvcjI2Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWYyNSA9IF9pdGVyYXRvcjI2W19pMjgrK107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfaTI4ID0gX2l0ZXJhdG9yMjYubmV4dCgpO1xuICAgICAgICAgICAgICBpZiAoX2kyOC5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZjI1ID0gX2kyOC52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9maWxlMiA9IF9yZWYyNTtcblxuICAgICAgICAgICAgX2ZpbGUyLnVwbG9hZC5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICAgICAgX2ZpbGUyLnVwbG9hZC50b3RhbCA9IGUudG90YWw7XG4gICAgICAgICAgICBfZmlsZTIudXBsb2FkLmJ5dGVzU2VudCA9IGUubG9hZGVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyNyA9IGZpbGVzLCBfaXNBcnJheTI3ID0gdHJ1ZSwgX2kyOSA9IDAsIF9pdGVyYXRvcjI3ID0gX2lzQXJyYXkyNyA/IF9pdGVyYXRvcjI3IDogX2l0ZXJhdG9yMjdbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjI2O1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MjcpIHtcbiAgICAgICAgICAgIGlmIChfaTI5ID49IF9pdGVyYXRvcjI3Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjYgPSBfaXRlcmF0b3IyN1tfaTI5KytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTI5ID0gX2l0ZXJhdG9yMjcubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMjkuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjYgPSBfaTI5LnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfZmlsZTMgPSBfcmVmMjY7XG5cbiAgICAgICAgICB0aGlzLmVtaXQoXCJ1cGxvYWRwcm9ncmVzc1wiLCBfZmlsZTMsIF9maWxlMy51cGxvYWQucHJvZ3Jlc3MsIF9maWxlMy51cGxvYWQuYnl0ZXNTZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ2FsbGVkIHdoZW4gdGhlIGZpbGUgZmluaXNoZWQgdXBsb2FkaW5nXG5cbiAgICAgICAgdmFyIGFsbEZpbGVzRmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgIHByb2dyZXNzID0gMTAwO1xuXG4gICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjI4ID0gZmlsZXMsIF9pc0FycmF5MjggPSB0cnVlLCBfaTMwID0gMCwgX2l0ZXJhdG9yMjggPSBfaXNBcnJheTI4ID8gX2l0ZXJhdG9yMjggOiBfaXRlcmF0b3IyOFtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgIHZhciBfcmVmMjc7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXkyOCkge1xuICAgICAgICAgICAgaWYgKF9pMzAgPj0gX2l0ZXJhdG9yMjgubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYyNyA9IF9pdGVyYXRvcjI4W19pMzArK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pMzAgPSBfaXRlcmF0b3IyOC5uZXh0KCk7XG4gICAgICAgICAgICBpZiAoX2kzMC5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWYyNyA9IF9pMzAudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9maWxlNCA9IF9yZWYyNztcblxuICAgICAgICAgIGlmIChfZmlsZTQudXBsb2FkLnByb2dyZXNzICE9PSAxMDAgfHwgX2ZpbGU0LnVwbG9hZC5ieXRlc1NlbnQgIT09IF9maWxlNC51cGxvYWQudG90YWwpIHtcbiAgICAgICAgICAgIGFsbEZpbGVzRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX2ZpbGU0LnVwbG9hZC5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICAgIF9maWxlNC51cGxvYWQuYnl0ZXNTZW50ID0gX2ZpbGU0LnVwbG9hZC50b3RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdGhpbmcgdG8gZG8sIGFsbCBmaWxlcyBhbHJlYWR5IGF0IDEwMCVcbiAgICAgICAgaWYgKGFsbEZpbGVzRmluaXNoZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyOSA9IGZpbGVzLCBfaXNBcnJheTI5ID0gdHJ1ZSwgX2kzMSA9IDAsIF9pdGVyYXRvcjI5ID0gX2lzQXJyYXkyOSA/IF9pdGVyYXRvcjI5IDogX2l0ZXJhdG9yMjlbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjI4O1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MjkpIHtcbiAgICAgICAgICAgIGlmIChfaTMxID49IF9pdGVyYXRvcjI5Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjggPSBfaXRlcmF0b3IyOVtfaTMxKytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTMxID0gX2l0ZXJhdG9yMjkubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMzEuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMjggPSBfaTMxLnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfZmlsZTUgPSBfcmVmMjg7XG5cbiAgICAgICAgICB0aGlzLmVtaXQoXCJ1cGxvYWRwcm9ncmVzc1wiLCBfZmlsZTUsIHByb2dyZXNzLCBfZmlsZTUudXBsb2FkLmJ5dGVzU2VudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2ZpbmlzaGVkVXBsb2FkaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9maW5pc2hlZFVwbG9hZGluZyhmaWxlcywgeGhyLCBlKSB7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB2b2lkIDA7XG5cbiAgICAgIGlmIChmaWxlc1swXS5zdGF0dXMgPT09IERyb3B6b25lLkNBTkNFTEVEKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHhoci5yZXNwb25zZVR5cGUgIT09ICdhcnJheWJ1ZmZlcicgJiYgeGhyLnJlc3BvbnNlVHlwZSAhPT0gJ2Jsb2InKSB7XG4gICAgICAgIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcblxuICAgICAgICBpZiAoeGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiY29udGVudC10eXBlXCIpICYmIH54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJjb250ZW50LXR5cGVcIikuaW5kZXhPZihcImFwcGxpY2F0aW9uL2pzb25cIikpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBcIkludmFsaWQgSlNPTiByZXNwb25zZSBmcm9tIHNlcnZlci5cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fdXBkYXRlRmlsZXNVcGxvYWRQcm9ncmVzcyhmaWxlcyk7XG5cbiAgICAgIGlmICghKDIwMCA8PSB4aHIuc3RhdHVzICYmIHhoci5zdGF0dXMgPCAzMDApKSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZVVwbG9hZEVycm9yKGZpbGVzLCB4aHIsIHJlc3BvbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmaWxlc1swXS51cGxvYWQuY2h1bmtlZCkge1xuICAgICAgICAgIGZpbGVzWzBdLnVwbG9hZC5maW5pc2hlZENodW5rVXBsb2FkKHRoaXMuX2dldENodW5rKGZpbGVzWzBdLCB4aHIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9maW5pc2hlZChmaWxlcywgcmVzcG9uc2UsIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIl9oYW5kbGVVcGxvYWRFcnJvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlVXBsb2FkRXJyb3IoZmlsZXMsIHhociwgcmVzcG9uc2UpIHtcbiAgICAgIGlmIChmaWxlc1swXS5zdGF0dXMgPT09IERyb3B6b25lLkNBTkNFTEVEKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpbGVzWzBdLnVwbG9hZC5jaHVua2VkICYmIHRoaXMub3B0aW9ucy5yZXRyeUNodW5rcykge1xuICAgICAgICB2YXIgY2h1bmsgPSB0aGlzLl9nZXRDaHVuayhmaWxlc1swXSwgeGhyKTtcbiAgICAgICAgaWYgKGNodW5rLnJldHJpZXMrKyA8IHRoaXMub3B0aW9ucy5yZXRyeUNodW5rc0xpbWl0KSB7XG4gICAgICAgICAgdGhpcy5fdXBsb2FkRGF0YShmaWxlcywgW2NodW5rLmRhdGFCbG9ja10pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1JldHJpZWQgdGhpcyBjaHVuayB0b28gb2Z0ZW4uIEdpdmluZyB1cC4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IzMCA9IGZpbGVzLCBfaXNBcnJheTMwID0gdHJ1ZSwgX2kzMiA9IDAsIF9pdGVyYXRvcjMwID0gX2lzQXJyYXkzMCA/IF9pdGVyYXRvcjMwIDogX2l0ZXJhdG9yMzBbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYyOTtcblxuICAgICAgICBpZiAoX2lzQXJyYXkzMCkge1xuICAgICAgICAgIGlmIChfaTMyID49IF9pdGVyYXRvcjMwLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjI5ID0gX2l0ZXJhdG9yMzBbX2kzMisrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTMyID0gX2l0ZXJhdG9yMzAubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTMyLmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYyOSA9IF9pMzIudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZSA9IF9yZWYyOTtcblxuICAgICAgICB0aGlzLl9lcnJvclByb2Nlc3NpbmcoZmlsZXMsIHJlc3BvbnNlIHx8IHRoaXMub3B0aW9ucy5kaWN0UmVzcG9uc2VFcnJvci5yZXBsYWNlKFwie3tzdGF0dXNDb2RlfX1cIiwgeGhyLnN0YXR1cyksIHhocik7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN1Ym1pdFJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3VibWl0UmVxdWVzdCh4aHIsIGZvcm1EYXRhLCBmaWxlcykge1xuICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xuICAgIH1cblxuICAgIC8vIENhbGxlZCBpbnRlcm5hbGx5IHdoZW4gcHJvY2Vzc2luZyBpcyBmaW5pc2hlZC5cbiAgICAvLyBJbmRpdmlkdWFsIGNhbGxiYWNrcyBoYXZlIHRvIGJlIGNhbGxlZCBpbiB0aGUgYXBwcm9wcmlhdGUgc2VjdGlvbnMuXG5cbiAgfSwge1xuICAgIGtleTogXCJfZmluaXNoZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2ZpbmlzaGVkKGZpbGVzLCByZXNwb25zZVRleHQsIGUpIHtcbiAgICAgIGZvciAodmFyIF9pdGVyYXRvcjMxID0gZmlsZXMsIF9pc0FycmF5MzEgPSB0cnVlLCBfaTMzID0gMCwgX2l0ZXJhdG9yMzEgPSBfaXNBcnJheTMxID8gX2l0ZXJhdG9yMzEgOiBfaXRlcmF0b3IzMVtTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICB2YXIgX3JlZjMwO1xuXG4gICAgICAgIGlmIChfaXNBcnJheTMxKSB7XG4gICAgICAgICAgaWYgKF9pMzMgPj0gX2l0ZXJhdG9yMzEubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICBfcmVmMzAgPSBfaXRlcmF0b3IzMVtfaTMzKytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMzMgPSBfaXRlcmF0b3IzMS5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMzMuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgX3JlZjMwID0gX2kzMy52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlID0gX3JlZjMwO1xuXG4gICAgICAgIGZpbGUuc3RhdHVzID0gRHJvcHpvbmUuU1VDQ0VTUztcbiAgICAgICAgdGhpcy5lbWl0KFwic3VjY2Vzc1wiLCBmaWxlLCByZXNwb25zZVRleHQsIGUpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZVwiLCBmaWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBsb2FkTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5lbWl0KFwic3VjY2Vzc211bHRpcGxlXCIsIGZpbGVzLCByZXNwb25zZVRleHQsIGUpO1xuICAgICAgICB0aGlzLmVtaXQoXCJjb21wbGV0ZW11bHRpcGxlXCIsIGZpbGVzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUHJvY2Vzc1F1ZXVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENhbGxlZCBpbnRlcm5hbGx5IHdoZW4gcHJvY2Vzc2luZyBpcyBmaW5pc2hlZC5cbiAgICAvLyBJbmRpdmlkdWFsIGNhbGxiYWNrcyBoYXZlIHRvIGJlIGNhbGxlZCBpbiB0aGUgYXBwcm9wcmlhdGUgc2VjdGlvbnMuXG5cbiAgfSwge1xuICAgIGtleTogXCJfZXJyb3JQcm9jZXNzaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9lcnJvclByb2Nlc3NpbmcoZmlsZXMsIG1lc3NhZ2UsIHhocikge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMzIgPSBmaWxlcywgX2lzQXJyYXkzMiA9IHRydWUsIF9pMzQgPSAwLCBfaXRlcmF0b3IzMiA9IF9pc0FycmF5MzIgPyBfaXRlcmF0b3IzMiA6IF9pdGVyYXRvcjMyW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmMzE7XG5cbiAgICAgICAgaWYgKF9pc0FycmF5MzIpIHtcbiAgICAgICAgICBpZiAoX2kzNCA+PSBfaXRlcmF0b3IzMi5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgIF9yZWYzMSA9IF9pdGVyYXRvcjMyW19pMzQrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2kzNCA9IF9pdGVyYXRvcjMyLm5leHQoKTtcbiAgICAgICAgICBpZiAoX2kzNC5kb25lKSBicmVhaztcbiAgICAgICAgICBfcmVmMzEgPSBfaTM0LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGUgPSBfcmVmMzE7XG5cbiAgICAgICAgZmlsZS5zdGF0dXMgPSBEcm9wem9uZS5FUlJPUjtcbiAgICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgZmlsZSwgbWVzc2FnZSwgeGhyKTtcbiAgICAgICAgdGhpcy5lbWl0KFwiY29tcGxldGVcIiwgZmlsZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnVwbG9hZE11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuZW1pdChcImVycm9ybXVsdGlwbGVcIiwgZmlsZXMsIG1lc3NhZ2UsIHhocik7XG4gICAgICAgIHRoaXMuZW1pdChcImNvbXBsZXRlbXVsdGlwbGVcIiwgZmlsZXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Qcm9jZXNzUXVldWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6IFwidXVpZHY0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHV1aWR2NCgpIHtcbiAgICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCxcbiAgICAgICAgICAgIHYgPSBjID09PSAneCcgPyByIDogciAmIDB4MyB8IDB4ODtcbiAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIERyb3B6b25lO1xufShFbWl0dGVyKTtcblxuRHJvcHpvbmUuaW5pdENsYXNzKCk7XG5cbkRyb3B6b25lLnZlcnNpb24gPSBcIjUuNS4xXCI7XG5cbi8vIFRoaXMgaXMgYSBtYXAgb2Ygb3B0aW9ucyBmb3IgeW91ciBkaWZmZXJlbnQgZHJvcHpvbmVzLiBBZGQgY29uZmlndXJhdGlvbnNcbi8vIHRvIHRoaXMgb2JqZWN0IGZvciB5b3VyIGRpZmZlcmVudCBkcm9wem9uZSBlbGVtZW5zLlxuLy9cbi8vIEV4YW1wbGU6XG4vL1xuLy8gICAgIERyb3B6b25lLm9wdGlvbnMubXlEcm9wem9uZUVsZW1lbnRJZCA9IHsgbWF4RmlsZXNpemU6IDEgfTtcbi8vXG4vLyBUbyBkaXNhYmxlIGF1dG9EaXNjb3ZlciBmb3IgYSBzcGVjaWZpYyBlbGVtZW50LCB5b3UgY2FuIHNldCBgZmFsc2VgIGFzIGFuIG9wdGlvbjpcbi8vXG4vLyAgICAgRHJvcHpvbmUub3B0aW9ucy5teURpc2FibGVkRWxlbWVudElkID0gZmFsc2U7XG4vL1xuLy8gQW5kIGluIGh0bWw6XG4vL1xuLy8gICAgIDxmb3JtIGFjdGlvbj1cIi91cGxvYWRcIiBpZD1cIm15LWRyb3B6b25lLWVsZW1lbnQtaWRcIiBjbGFzcz1cImRyb3B6b25lXCI+PC9mb3JtPlxuRHJvcHpvbmUub3B0aW9ucyA9IHt9O1xuXG4vLyBSZXR1cm5zIHRoZSBvcHRpb25zIGZvciBhbiBlbGVtZW50IG9yIHVuZGVmaW5lZCBpZiBub25lIGF2YWlsYWJsZS5cbkRyb3B6b25lLm9wdGlvbnNGb3JFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgLy8gR2V0IHRoZSBgRHJvcHpvbmUub3B0aW9ucy5lbGVtZW50SWRgIGZvciB0aGlzIGVsZW1lbnQgaWYgaXQgZXhpc3RzXG4gIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImlkXCIpKSB7XG4gICAgcmV0dXJuIERyb3B6b25lLm9wdGlvbnNbY2FtZWxpemUoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSldO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn07XG5cbi8vIEhvbGRzIGEgbGlzdCBvZiBhbGwgZHJvcHpvbmUgaW5zdGFuY2VzXG5Ecm9wem9uZS5pbnN0YW5jZXMgPSBbXTtcblxuLy8gUmV0dXJucyB0aGUgZHJvcHpvbmUgZm9yIGdpdmVuIGVsZW1lbnQgaWYgYW55XG5Ecm9wem9uZS5mb3JFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudCk7XG4gIH1cbiAgaWYgKChlbGVtZW50ICE9IG51bGwgPyBlbGVtZW50LmRyb3B6b25lIDogdW5kZWZpbmVkKSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gRHJvcHpvbmUgZm91bmQgZm9yIGdpdmVuIGVsZW1lbnQuIFRoaXMgaXMgcHJvYmFibHkgYmVjYXVzZSB5b3UncmUgdHJ5aW5nIHRvIGFjY2VzcyBpdCBiZWZvcmUgRHJvcHpvbmUgaGFkIHRoZSB0aW1lIHRvIGluaXRpYWxpemUuIFVzZSB0aGUgYGluaXRgIG9wdGlvbiB0byBzZXR1cCBhbnkgYWRkaXRpb25hbCBvYnNlcnZlcnMgb24geW91ciBEcm9wem9uZS5cIik7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQuZHJvcHpvbmU7XG59O1xuXG4vLyBTZXQgdG8gZmFsc2UgaWYgeW91IGRvbid0IHdhbnQgRHJvcHpvbmUgdG8gYXV0b21hdGljYWxseSBmaW5kIGFuZCBhdHRhY2ggdG8gLmRyb3B6b25lIGVsZW1lbnRzLlxuRHJvcHpvbmUuYXV0b0Rpc2NvdmVyID0gdHJ1ZTtcblxuLy8gTG9va3MgZm9yIGFsbCAuZHJvcHpvbmUgZWxlbWVudHMgYW5kIGNyZWF0ZXMgYSBkcm9wem9uZSBmb3IgdGhlbVxuRHJvcHpvbmUuZGlzY292ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkcm9wem9uZXMgPSB2b2lkIDA7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgZHJvcHpvbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcm9wem9uZVwiKTtcbiAgfSBlbHNlIHtcbiAgICBkcm9wem9uZXMgPSBbXTtcbiAgICAvLyBJRSA6KFxuICAgIHZhciBjaGVja0VsZW1lbnRzID0gZnVuY3Rpb24gY2hlY2tFbGVtZW50cyhlbGVtZW50cykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IzMyA9IGVsZW1lbnRzLCBfaXNBcnJheTMzID0gdHJ1ZSwgX2kzNSA9IDAsIF9pdGVyYXRvcjMzID0gX2lzQXJyYXkzMyA/IF9pdGVyYXRvcjMzIDogX2l0ZXJhdG9yMzNbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjMyO1xuXG4gICAgICAgICAgaWYgKF9pc0FycmF5MzMpIHtcbiAgICAgICAgICAgIGlmIChfaTM1ID49IF9pdGVyYXRvcjMzLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMzIgPSBfaXRlcmF0b3IzM1tfaTM1KytdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfaTM1ID0gX2l0ZXJhdG9yMzMubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pMzUuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICBfcmVmMzIgPSBfaTM1LnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBlbCA9IF9yZWYzMjtcblxuICAgICAgICAgIGlmICgvKF58IClkcm9wem9uZSgkfCApLy50ZXN0KGVsLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRyb3B6b25lcy5wdXNoKGVsKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KCk7XG4gICAgfTtcbiAgICBjaGVja0VsZW1lbnRzKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpKTtcbiAgICBjaGVja0VsZW1lbnRzKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZm9ybVwiKSk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBfaXRlcmF0b3IzNCA9IGRyb3B6b25lcywgX2lzQXJyYXkzNCA9IHRydWUsIF9pMzYgPSAwLCBfaXRlcmF0b3IzNCA9IF9pc0FycmF5MzQgPyBfaXRlcmF0b3IzNCA6IF9pdGVyYXRvcjM0W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICB2YXIgX3JlZjMzO1xuXG4gICAgICBpZiAoX2lzQXJyYXkzNCkge1xuICAgICAgICBpZiAoX2kzNiA+PSBfaXRlcmF0b3IzNC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBfcmVmMzMgPSBfaXRlcmF0b3IzNFtfaTM2KytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2kzNiA9IF9pdGVyYXRvcjM0Lm5leHQoKTtcbiAgICAgICAgaWYgKF9pMzYuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWYzMyA9IF9pMzYudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBkcm9wem9uZSA9IF9yZWYzMztcblxuICAgICAgLy8gQ3JlYXRlIGEgZHJvcHpvbmUgdW5sZXNzIGF1dG8gZGlzY292ZXIgaGFzIGJlZW4gZGlzYWJsZWQgZm9yIHNwZWNpZmljIGVsZW1lbnRcbiAgICAgIGlmIChEcm9wem9uZS5vcHRpb25zRm9yRWxlbWVudChkcm9wem9uZSkgIT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKG5ldyBEcm9wem9uZShkcm9wem9uZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2godW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSgpO1xufTtcblxuLy8gU2luY2UgdGhlIHdob2xlIERyYWcnbidEcm9wIEFQSSBpcyBwcmV0dHkgbmV3LCBzb21lIGJyb3dzZXJzIGltcGxlbWVudCBpdCxcbi8vIGJ1dCBub3QgY29ycmVjdGx5LlxuLy8gU28gSSBjcmVhdGVkIGEgYmxhY2tsaXN0IG9mIHVzZXJBZ2VudHMuIFllcywgeWVzLiBCcm93c2VyIHNuaWZmaW5nLCBJIGtub3cuXG4vLyBCdXQgd2hhdCB0byBkbyB3aGVuIGJyb3dzZXJzICp0aGVvcmV0aWNhbGx5KiBzdXBwb3J0IGFuIEFQSSwgYnV0IGNyYXNoXG4vLyB3aGVuIHVzaW5nIGl0LlxuLy9cbi8vIFRoaXMgaXMgYSBsaXN0IG9mIHJlZ3VsYXIgZXhwcmVzc2lvbnMgdGVzdGVkIGFnYWluc3QgbmF2aWdhdG9yLnVzZXJBZ2VudFxuLy9cbi8vICoqIEl0IHNob3VsZCBvbmx5IGJlIHVzZWQgb24gYnJvd3NlciB0aGF0ICpkbyogc3VwcG9ydCB0aGUgQVBJLCBidXRcbi8vIGluY29ycmVjdGx5ICoqXG4vL1xuRHJvcHpvbmUuYmxhY2tsaXN0ZWRCcm93c2VycyA9IFtcbi8vIFRoZSBtYWMgb3MgYW5kIHdpbmRvd3MgcGhvbmUgdmVyc2lvbiBvZiBvcGVyYSAxMiBzZWVtcyB0byBoYXZlIGEgcHJvYmxlbSB3aXRoIHRoZSBGaWxlIGRyYWcnbidkcm9wIEFQSS5cbi9vcGVyYS4qKE1hY2ludG9zaHxXaW5kb3dzIFBob25lKS4qdmVyc2lvblxcLzEyL2ldO1xuXG4vLyBDaGVja3MgaWYgdGhlIGJyb3dzZXIgaXMgc3VwcG9ydGVkXG5Ecm9wem9uZS5pc0Jyb3dzZXJTdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjYXBhYmxlQnJvd3NlciA9IHRydWU7XG5cbiAgaWYgKHdpbmRvdy5GaWxlICYmIHdpbmRvdy5GaWxlUmVhZGVyICYmIHdpbmRvdy5GaWxlTGlzdCAmJiB3aW5kb3cuQmxvYiAmJiB3aW5kb3cuRm9ybURhdGEgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcikge1xuICAgIGlmICghKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIikpKSB7XG4gICAgICBjYXBhYmxlQnJvd3NlciA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgQVBJLCBidXQgbWF5IGJlIGJsYWNrbGlzdGVkLlxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMzUgPSBEcm9wem9uZS5ibGFja2xpc3RlZEJyb3dzZXJzLCBfaXNBcnJheTM1ID0gdHJ1ZSwgX2kzNyA9IDAsIF9pdGVyYXRvcjM1ID0gX2lzQXJyYXkzNSA/IF9pdGVyYXRvcjM1IDogX2l0ZXJhdG9yMzVbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgdmFyIF9yZWYzNDtcblxuICAgICAgICBpZiAoX2lzQXJyYXkzNSkge1xuICAgICAgICAgIGlmIChfaTM3ID49IF9pdGVyYXRvcjM1Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjM0ID0gX2l0ZXJhdG9yMzVbX2kzNysrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTM3ID0gX2l0ZXJhdG9yMzUubmV4dCgpO1xuICAgICAgICAgIGlmIChfaTM3LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWYzNCA9IF9pMzcudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVnZXggPSBfcmVmMzQ7XG5cbiAgICAgICAgaWYgKHJlZ2V4LnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgICBjYXBhYmxlQnJvd3NlciA9IGZhbHNlO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNhcGFibGVCcm93c2VyID0gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gY2FwYWJsZUJyb3dzZXI7XG59O1xuXG5Ecm9wem9uZS5kYXRhVVJJdG9CbG9iID0gZnVuY3Rpb24gKGRhdGFVUkkpIHtcbiAgLy8gY29udmVydCBiYXNlNjQgdG8gcmF3IGJpbmFyeSBkYXRhIGhlbGQgaW4gYSBzdHJpbmdcbiAgLy8gZG9lc24ndCBoYW5kbGUgVVJMRW5jb2RlZCBEYXRhVVJJcyAtIHNlZSBTTyBhbnN3ZXIgIzY4NTAyNzYgZm9yIGNvZGUgdGhhdCBkb2VzIHRoaXNcbiAgdmFyIGJ5dGVTdHJpbmcgPSBhdG9iKGRhdGFVUkkuc3BsaXQoJywnKVsxXSk7XG5cbiAgLy8gc2VwYXJhdGUgb3V0IHRoZSBtaW1lIGNvbXBvbmVudFxuICB2YXIgbWltZVN0cmluZyA9IGRhdGFVUkkuc3BsaXQoJywnKVswXS5zcGxpdCgnOicpWzFdLnNwbGl0KCc7JylbMF07XG5cbiAgLy8gd3JpdGUgdGhlIGJ5dGVzIG9mIHRoZSBzdHJpbmcgdG8gYW4gQXJyYXlCdWZmZXJcbiAgdmFyIGFiID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVTdHJpbmcubGVuZ3RoKTtcbiAgdmFyIGlhID0gbmV3IFVpbnQ4QXJyYXkoYWIpO1xuICBmb3IgKHZhciBpID0gMCwgZW5kID0gYnl0ZVN0cmluZy5sZW5ndGgsIGFzYyA9IDAgPD0gZW5kOyBhc2MgPyBpIDw9IGVuZCA6IGkgPj0gZW5kOyBhc2MgPyBpKysgOiBpLS0pIHtcbiAgICBpYVtpXSA9IGJ5dGVTdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgfVxuXG4gIC8vIHdyaXRlIHRoZSBBcnJheUJ1ZmZlciB0byBhIGJsb2JcbiAgcmV0dXJuIG5ldyBCbG9iKFthYl0sIHsgdHlwZTogbWltZVN0cmluZyB9KTtcbn07XG5cbi8vIFJldHVybnMgYW4gYXJyYXkgd2l0aG91dCB0aGUgcmVqZWN0ZWQgaXRlbVxudmFyIHdpdGhvdXQgPSBmdW5jdGlvbiB3aXRob3V0KGxpc3QsIHJlamVjdGVkSXRlbSkge1xuICByZXR1cm4gbGlzdC5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbSAhPT0gcmVqZWN0ZWRJdGVtO1xuICB9KS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfSk7XG59O1xuXG4vLyBhYmMtZGVmX2doaSAtPiBhYmNEZWZHaGlcbnZhciBjYW1lbGl6ZSA9IGZ1bmN0aW9uIGNhbWVsaXplKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1fXShcXHcpL2csIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHJldHVybiBtYXRjaC5jaGFyQXQoMSkudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59O1xuXG4vLyBDcmVhdGVzIGFuIGVsZW1lbnQgZnJvbSBzdHJpbmdcbkRyb3B6b25lLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBkaXYuaW5uZXJIVE1MID0gc3RyaW5nO1xuICByZXR1cm4gZGl2LmNoaWxkTm9kZXNbMF07XG59O1xuXG4vLyBUZXN0cyBpZiBnaXZlbiBlbGVtZW50IGlzIGluc2lkZSAob3Igc2ltcGx5IGlzKSB0aGUgY29udGFpbmVyXG5Ecm9wem9uZS5lbGVtZW50SW5zaWRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gQ29mZmVlc2NyaXB0IGRvZXNuJ3Qgc3VwcG9ydCBkby93aGlsZSBsb29wc1xuICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5Ecm9wem9uZS5nZXRFbGVtZW50ID0gZnVuY3Rpb24gKGVsLCBuYW1lKSB7XG4gIHZhciBlbGVtZW50ID0gdm9pZCAwO1xuICBpZiAodHlwZW9mIGVsID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICB9IGVsc2UgaWYgKGVsLm5vZGVUeXBlICE9IG51bGwpIHtcbiAgICBlbGVtZW50ID0gZWw7XG4gIH1cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYFwiICsgbmFtZSArIFwiYCBvcHRpb24gcHJvdmlkZWQuIFBsZWFzZSBwcm92aWRlIGEgQ1NTIHNlbGVjdG9yIG9yIGEgcGxhaW4gSFRNTCBlbGVtZW50LlwiKTtcbiAgfVxuICByZXR1cm4gZWxlbWVudDtcbn07XG5cbkRyb3B6b25lLmdldEVsZW1lbnRzID0gZnVuY3Rpb24gKGVscywgbmFtZSkge1xuICB2YXIgZWwgPSB2b2lkIDAsXG4gICAgICBlbGVtZW50cyA9IHZvaWQgMDtcbiAgaWYgKGVscyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgZWxlbWVudHMgPSBbXTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMzYgPSBlbHMsIF9pc0FycmF5MzYgPSB0cnVlLCBfaTM4ID0gMCwgX2l0ZXJhdG9yMzYgPSBfaXNBcnJheTM2ID8gX2l0ZXJhdG9yMzYgOiBfaXRlcmF0b3IzNltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICBpZiAoX2lzQXJyYXkzNikge1xuICAgICAgICAgIGlmIChfaTM4ID49IF9pdGVyYXRvcjM2Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgZWwgPSBfaXRlcmF0b3IzNltfaTM4KytdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9pMzggPSBfaXRlcmF0b3IzNi5uZXh0KCk7XG4gICAgICAgICAgaWYgKF9pMzguZG9uZSkgYnJlYWs7XG4gICAgICAgICAgZWwgPSBfaTM4LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudHMucHVzaCh0aGlzLmdldEVsZW1lbnQoZWwsIG5hbWUpKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlbGVtZW50cyA9IG51bGw7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbHMgPT09IFwic3RyaW5nXCIpIHtcbiAgICBlbGVtZW50cyA9IFtdO1xuICAgIGZvciAodmFyIF9pdGVyYXRvcjM3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbHMpLCBfaXNBcnJheTM3ID0gdHJ1ZSwgX2kzOSA9IDAsIF9pdGVyYXRvcjM3ID0gX2lzQXJyYXkzNyA/IF9pdGVyYXRvcjM3IDogX2l0ZXJhdG9yMzdbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgIGlmIChfaXNBcnJheTM3KSB7XG4gICAgICAgIGlmIChfaTM5ID49IF9pdGVyYXRvcjM3Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgIGVsID0gX2l0ZXJhdG9yMzdbX2kzOSsrXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9pMzkgPSBfaXRlcmF0b3IzNy5uZXh0KCk7XG4gICAgICAgIGlmIChfaTM5LmRvbmUpIGJyZWFrO1xuICAgICAgICBlbCA9IF9pMzkudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnRzLnB1c2goZWwpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChlbHMubm9kZVR5cGUgIT0gbnVsbCkge1xuICAgIGVsZW1lbnRzID0gW2Vsc107XG4gIH1cblxuICBpZiAoZWxlbWVudHMgPT0gbnVsbCB8fCAhZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBgXCIgKyBuYW1lICsgXCJgIG9wdGlvbiBwcm92aWRlZC4gUGxlYXNlIHByb3ZpZGUgYSBDU1Mgc2VsZWN0b3IsIGEgcGxhaW4gSFRNTCBlbGVtZW50IG9yIGEgbGlzdCBvZiB0aG9zZS5cIik7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudHM7XG59O1xuXG4vLyBBc2tzIHRoZSB1c2VyIHRoZSBxdWVzdGlvbiBhbmQgY2FsbHMgYWNjZXB0ZWQgb3IgcmVqZWN0ZWQgYWNjb3JkaW5nbHlcbi8vXG4vLyBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBqdXN0IHVzZXMgYHdpbmRvdy5jb25maXJtYCBhbmQgdGhlbiBjYWxscyB0aGVcbi8vIGFwcHJvcHJpYXRlIGNhbGxiYWNrLlxuRHJvcHpvbmUuY29uZmlybSA9IGZ1bmN0aW9uIChxdWVzdGlvbiwgYWNjZXB0ZWQsIHJlamVjdGVkKSB7XG4gIGlmICh3aW5kb3cuY29uZmlybShxdWVzdGlvbikpIHtcbiAgICByZXR1cm4gYWNjZXB0ZWQoKTtcbiAgfSBlbHNlIGlmIChyZWplY3RlZCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHJlamVjdGVkKCk7XG4gIH1cbn07XG5cbi8vIFZhbGlkYXRlcyB0aGUgbWltZSB0eXBlIGxpa2UgdGhpczpcbi8vXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0hUTUwvRWxlbWVudC9pbnB1dCNhdHRyLWFjY2VwdFxuRHJvcHpvbmUuaXNWYWxpZEZpbGUgPSBmdW5jdGlvbiAoZmlsZSwgYWNjZXB0ZWRGaWxlcykge1xuICBpZiAoIWFjY2VwdGVkRmlsZXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBJZiB0aGVyZSBhcmUgbm8gYWNjZXB0ZWQgbWltZSB0eXBlcywgaXQncyBPS1xuICBhY2NlcHRlZEZpbGVzID0gYWNjZXB0ZWRGaWxlcy5zcGxpdChcIixcIik7XG5cbiAgdmFyIG1pbWVUeXBlID0gZmlsZS50eXBlO1xuICB2YXIgYmFzZU1pbWVUeXBlID0gbWltZVR5cGUucmVwbGFjZSgvXFwvLiokLywgXCJcIik7XG5cbiAgZm9yICh2YXIgX2l0ZXJhdG9yMzggPSBhY2NlcHRlZEZpbGVzLCBfaXNBcnJheTM4ID0gdHJ1ZSwgX2k0MCA9IDAsIF9pdGVyYXRvcjM4ID0gX2lzQXJyYXkzOCA/IF9pdGVyYXRvcjM4IDogX2l0ZXJhdG9yMzhbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICB2YXIgX3JlZjM1O1xuXG4gICAgaWYgKF9pc0FycmF5MzgpIHtcbiAgICAgIGlmIChfaTQwID49IF9pdGVyYXRvcjM4Lmxlbmd0aCkgYnJlYWs7XG4gICAgICBfcmVmMzUgPSBfaXRlcmF0b3IzOFtfaTQwKytdO1xuICAgIH0gZWxzZSB7XG4gICAgICBfaTQwID0gX2l0ZXJhdG9yMzgubmV4dCgpO1xuICAgICAgaWYgKF9pNDAuZG9uZSkgYnJlYWs7XG4gICAgICBfcmVmMzUgPSBfaTQwLnZhbHVlO1xuICAgIH1cblxuICAgIHZhciB2YWxpZFR5cGUgPSBfcmVmMzU7XG5cbiAgICB2YWxpZFR5cGUgPSB2YWxpZFR5cGUudHJpbSgpO1xuICAgIGlmICh2YWxpZFR5cGUuY2hhckF0KDApID09PSBcIi5cIikge1xuICAgICAgaWYgKGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodmFsaWRUeXBlLnRvTG93ZXJDYXNlKCksIGZpbGUubmFtZS5sZW5ndGggLSB2YWxpZFR5cGUubGVuZ3RoKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh2YWxpZFR5cGUpKSB7XG4gICAgICAvLyBUaGlzIGlzIHNvbWV0aGluZyBsaWtlIGEgaW1hZ2UvKiBtaW1lIHR5cGVcbiAgICAgIGlmIChiYXNlTWltZVR5cGUgPT09IHZhbGlkVHlwZS5yZXBsYWNlKC9cXC8uKiQvLCBcIlwiKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1pbWVUeXBlID09PSB2YWxpZFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gQXVnbWVudCBqUXVlcnlcbmlmICh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJyAmJiBqUXVlcnkgIT09IG51bGwpIHtcbiAgalF1ZXJ5LmZuLmRyb3B6b25lID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgRHJvcHpvbmUodGhpcywgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH07XG59XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUgIT09IG51bGwpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBEcm9wem9uZTtcbn0gZWxzZSB7XG4gIHdpbmRvdy5Ecm9wem9uZSA9IERyb3B6b25lO1xufVxuXG4vLyBEcm9wem9uZSBmaWxlIHN0YXR1cyBjb2Rlc1xuRHJvcHpvbmUuQURERUQgPSBcImFkZGVkXCI7XG5cbkRyb3B6b25lLlFVRVVFRCA9IFwicXVldWVkXCI7XG4vLyBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIE5vdywgaWYgYSBmaWxlIGlzIGFjY2VwdGVkLCBpdCdzIGVpdGhlciBxdWV1ZWRcbi8vIG9yIHVwbG9hZGluZy5cbkRyb3B6b25lLkFDQ0VQVEVEID0gRHJvcHpvbmUuUVVFVUVEO1xuXG5Ecm9wem9uZS5VUExPQURJTkcgPSBcInVwbG9hZGluZ1wiO1xuRHJvcHpvbmUuUFJPQ0VTU0lORyA9IERyb3B6b25lLlVQTE9BRElORzsgLy8gYWxpYXNcblxuRHJvcHpvbmUuQ0FOQ0VMRUQgPSBcImNhbmNlbGVkXCI7XG5Ecm9wem9uZS5FUlJPUiA9IFwiZXJyb3JcIjtcbkRyb3B6b25lLlNVQ0NFU1MgPSBcInN1Y2Nlc3NcIjtcblxuLypcblxuIEJ1Z2ZpeCBmb3IgaU9TIDYgYW5kIDdcbiBTb3VyY2U6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTE5MjkwOTkvaHRtbDUtY2FudmFzLWRyYXdpbWFnZS1yYXRpby1idWctaW9zXG4gYmFzZWQgb24gdGhlIHdvcmsgb2YgaHR0cHM6Ly9naXRodWIuY29tL3N0b21pdGEvaW9zLWltYWdlZmlsZS1tZWdhcGl4ZWxcblxuICovXG5cbi8vIERldGVjdGluZyB2ZXJ0aWNhbCBzcXVhc2ggaW4gbG9hZGVkIGltYWdlLlxuLy8gRml4ZXMgYSBidWcgd2hpY2ggc3F1YXNoIGltYWdlIHZlcnRpY2FsbHkgd2hpbGUgZHJhd2luZyBpbnRvIGNhbnZhcyBmb3Igc29tZSBpbWFnZXMuXG4vLyBUaGlzIGlzIGEgYnVnIGluIGlPUzYgZGV2aWNlcy4gVGhpcyBmdW5jdGlvbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zdG9taXRhL2lvcy1pbWFnZWZpbGUtbWVnYXBpeGVsXG52YXIgZGV0ZWN0VmVydGljYWxTcXVhc2ggPSBmdW5jdGlvbiBkZXRlY3RWZXJ0aWNhbFNxdWFzaChpbWcpIHtcbiAgdmFyIGl3ID0gaW1nLm5hdHVyYWxXaWR0aDtcbiAgdmFyIGloID0gaW1nLm5hdHVyYWxIZWlnaHQ7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBjYW52YXMud2lkdGggPSAxO1xuICBjYW52YXMuaGVpZ2h0ID0gaWg7XG4gIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XG5cbiAgdmFyIF9jdHgkZ2V0SW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgxLCAwLCAxLCBpaCksXG4gICAgICBkYXRhID0gX2N0eCRnZXRJbWFnZURhdGEuZGF0YTtcblxuICAvLyBzZWFyY2ggaW1hZ2UgZWRnZSBwaXhlbCBwb3NpdGlvbiBpbiBjYXNlIGl0IGlzIHNxdWFzaGVkIHZlcnRpY2FsbHkuXG5cblxuICB2YXIgc3kgPSAwO1xuICB2YXIgZXkgPSBpaDtcbiAgdmFyIHB5ID0gaWg7XG4gIHdoaWxlIChweSA+IHN5KSB7XG4gICAgdmFyIGFscGhhID0gZGF0YVsocHkgLSAxKSAqIDQgKyAzXTtcblxuICAgIGlmIChhbHBoYSA9PT0gMCkge1xuICAgICAgZXkgPSBweTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3kgPSBweTtcbiAgICB9XG5cbiAgICBweSA9IGV5ICsgc3kgPj4gMTtcbiAgfVxuICB2YXIgcmF0aW8gPSBweSAvIGloO1xuXG4gIGlmIChyYXRpbyA9PT0gMCkge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYXRpbztcbiAgfVxufTtcblxuLy8gQSByZXBsYWNlbWVudCBmb3IgY29udGV4dC5kcmF3SW1hZ2Vcbi8vIChhcmdzIGFyZSBmb3Igc291cmNlIGFuZCBkZXN0aW5hdGlvbikuXG52YXIgZHJhd0ltYWdlSU9TRml4ID0gZnVuY3Rpb24gZHJhd0ltYWdlSU9TRml4KGN0eCwgaW1nLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGgpIHtcbiAgdmFyIHZlcnRTcXVhc2hSYXRpbyA9IGRldGVjdFZlcnRpY2FsU3F1YXNoKGltZyk7XG4gIHJldHVybiBjdHguZHJhd0ltYWdlKGltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoIC8gdmVydFNxdWFzaFJhdGlvKTtcbn07XG5cbi8vIEJhc2VkIG9uIE1pbmlmeUpwZWdcbi8vIFNvdXJjZTogaHR0cDovL3d3dy5wZXJyeS5jei9maWxlcy9FeGlmUmVzdG9yZXIuanNcbi8vIGh0dHA6Ly9lbGljb24uYmxvZzU3LmZjMi5jb20vYmxvZy1lbnRyeS0yMDYuaHRtbFxuXG52YXIgRXhpZlJlc3RvcmUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEV4aWZSZXN0b3JlKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFeGlmUmVzdG9yZSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRXhpZlJlc3RvcmUsIG51bGwsIFt7XG4gICAga2V5OiBcImluaXRDbGFzc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0Q2xhc3MoKSB7XG4gICAgICB0aGlzLktFWV9TVFIgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJlbmNvZGU2NFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmNvZGU2NChpbnB1dCkge1xuICAgICAgdmFyIG91dHB1dCA9ICcnO1xuICAgICAgdmFyIGNocjEgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgY2hyMiA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBjaHIzID0gJyc7XG4gICAgICB2YXIgZW5jMSA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBlbmMyID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIGVuYzMgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgZW5jNCA9ICcnO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY2hyMSA9IGlucHV0W2krK107XG4gICAgICAgIGNocjIgPSBpbnB1dFtpKytdO1xuICAgICAgICBjaHIzID0gaW5wdXRbaSsrXTtcbiAgICAgICAgZW5jMSA9IGNocjEgPj4gMjtcbiAgICAgICAgZW5jMiA9IChjaHIxICYgMykgPDwgNCB8IGNocjIgPj4gNDtcbiAgICAgICAgZW5jMyA9IChjaHIyICYgMTUpIDw8IDIgfCBjaHIzID4+IDY7XG4gICAgICAgIGVuYzQgPSBjaHIzICYgNjM7XG4gICAgICAgIGlmIChpc05hTihjaHIyKSkge1xuICAgICAgICAgIGVuYzMgPSBlbmM0ID0gNjQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOYU4oY2hyMykpIHtcbiAgICAgICAgICBlbmM0ID0gNjQ7XG4gICAgICAgIH1cbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgdGhpcy5LRVlfU1RSLmNoYXJBdChlbmMxKSArIHRoaXMuS0VZX1NUUi5jaGFyQXQoZW5jMikgKyB0aGlzLktFWV9TVFIuY2hhckF0KGVuYzMpICsgdGhpcy5LRVlfU1RSLmNoYXJBdChlbmM0KTtcbiAgICAgICAgY2hyMSA9IGNocjIgPSBjaHIzID0gJyc7XG4gICAgICAgIGVuYzEgPSBlbmMyID0gZW5jMyA9IGVuYzQgPSAnJztcbiAgICAgICAgaWYgKCEoaSA8IGlucHV0Lmxlbmd0aCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVzdG9yZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXN0b3JlKG9yaWdGaWxlQmFzZTY0LCByZXNpemVkRmlsZUJhc2U2NCkge1xuICAgICAgaWYgKCFvcmlnRmlsZUJhc2U2NC5tYXRjaCgnZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwnKSkge1xuICAgICAgICByZXR1cm4gcmVzaXplZEZpbGVCYXNlNjQ7XG4gICAgICB9XG4gICAgICB2YXIgcmF3SW1hZ2UgPSB0aGlzLmRlY29kZTY0KG9yaWdGaWxlQmFzZTY0LnJlcGxhY2UoJ2RhdGE6aW1hZ2UvanBlZztiYXNlNjQsJywgJycpKTtcbiAgICAgIHZhciBzZWdtZW50cyA9IHRoaXMuc2xpY2UyU2VnbWVudHMocmF3SW1hZ2UpO1xuICAgICAgdmFyIGltYWdlID0gdGhpcy5leGlmTWFuaXB1bGF0aW9uKHJlc2l6ZWRGaWxlQmFzZTY0LCBzZWdtZW50cyk7XG4gICAgICByZXR1cm4gXCJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LFwiICsgdGhpcy5lbmNvZGU2NChpbWFnZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImV4aWZNYW5pcHVsYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZXhpZk1hbmlwdWxhdGlvbihyZXNpemVkRmlsZUJhc2U2NCwgc2VnbWVudHMpIHtcbiAgICAgIHZhciBleGlmQXJyYXkgPSB0aGlzLmdldEV4aWZBcnJheShzZWdtZW50cyk7XG4gICAgICB2YXIgbmV3SW1hZ2VBcnJheSA9IHRoaXMuaW5zZXJ0RXhpZihyZXNpemVkRmlsZUJhc2U2NCwgZXhpZkFycmF5KTtcbiAgICAgIHZhciBhQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkobmV3SW1hZ2VBcnJheSk7XG4gICAgICByZXR1cm4gYUJ1ZmZlcjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RXhpZkFycmF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEV4aWZBcnJheShzZWdtZW50cykge1xuICAgICAgdmFyIHNlZyA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciB4ID0gMDtcbiAgICAgIHdoaWxlICh4IDwgc2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHNlZyA9IHNlZ21lbnRzW3hdO1xuICAgICAgICBpZiAoc2VnWzBdID09PSAyNTUgJiBzZWdbMV0gPT09IDIyNSkge1xuICAgICAgICAgIHJldHVybiBzZWc7XG4gICAgICAgIH1cbiAgICAgICAgeCsrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpbnNlcnRFeGlmXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluc2VydEV4aWYocmVzaXplZEZpbGVCYXNlNjQsIGV4aWZBcnJheSkge1xuICAgICAgdmFyIGltYWdlRGF0YSA9IHJlc2l6ZWRGaWxlQmFzZTY0LnJlcGxhY2UoJ2RhdGE6aW1hZ2UvanBlZztiYXNlNjQsJywgJycpO1xuICAgICAgdmFyIGJ1ZiA9IHRoaXMuZGVjb2RlNjQoaW1hZ2VEYXRhKTtcbiAgICAgIHZhciBzZXBhcmF0ZVBvaW50ID0gYnVmLmluZGV4T2YoMjU1LCAzKTtcbiAgICAgIHZhciBtYWUgPSBidWYuc2xpY2UoMCwgc2VwYXJhdGVQb2ludCk7XG4gICAgICB2YXIgYXRvID0gYnVmLnNsaWNlKHNlcGFyYXRlUG9pbnQpO1xuICAgICAgdmFyIGFycmF5ID0gbWFlO1xuICAgICAgYXJyYXkgPSBhcnJheS5jb25jYXQoZXhpZkFycmF5KTtcbiAgICAgIGFycmF5ID0gYXJyYXkuY29uY2F0KGF0byk7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNsaWNlMlNlZ21lbnRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNsaWNlMlNlZ21lbnRzKHJhd0ltYWdlQXJyYXkpIHtcbiAgICAgIHZhciBoZWFkID0gMDtcbiAgICAgIHZhciBzZWdtZW50cyA9IFtdO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGxlbmd0aDtcbiAgICAgICAgaWYgKHJhd0ltYWdlQXJyYXlbaGVhZF0gPT09IDI1NSAmIHJhd0ltYWdlQXJyYXlbaGVhZCArIDFdID09PSAyMTgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmF3SW1hZ2VBcnJheVtoZWFkXSA9PT0gMjU1ICYgcmF3SW1hZ2VBcnJheVtoZWFkICsgMV0gPT09IDIxNikge1xuICAgICAgICAgIGhlYWQgKz0gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZW5ndGggPSByYXdJbWFnZUFycmF5W2hlYWQgKyAyXSAqIDI1NiArIHJhd0ltYWdlQXJyYXlbaGVhZCArIDNdO1xuICAgICAgICAgIHZhciBlbmRQb2ludCA9IGhlYWQgKyBsZW5ndGggKyAyO1xuICAgICAgICAgIHZhciBzZWcgPSByYXdJbWFnZUFycmF5LnNsaWNlKGhlYWQsIGVuZFBvaW50KTtcbiAgICAgICAgICBzZWdtZW50cy5wdXNoKHNlZyk7XG4gICAgICAgICAgaGVhZCA9IGVuZFBvaW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChoZWFkID4gcmF3SW1hZ2VBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlZ21lbnRzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWNvZGU2NFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWNvZGU2NChpbnB1dCkge1xuICAgICAgdmFyIG91dHB1dCA9ICcnO1xuICAgICAgdmFyIGNocjEgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgY2hyMiA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBjaHIzID0gJyc7XG4gICAgICB2YXIgZW5jMSA9IHVuZGVmaW5lZDtcbiAgICAgIHZhciBlbmMyID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIGVuYzMgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgZW5jNCA9ICcnO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdmFyIGJ1ZiA9IFtdO1xuICAgICAgLy8gcmVtb3ZlIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBBLVosIGEteiwgMC05LCArLCAvLCBvciA9XG4gICAgICB2YXIgYmFzZTY0dGVzdCA9IC9bXkEtWmEtejAtOVxcK1xcL1xcPV0vZztcbiAgICAgIGlmIChiYXNlNjR0ZXN0LmV4ZWMoaW5wdXQpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignVGhlcmUgd2VyZSBpbnZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGluIHRoZSBpbnB1dCB0ZXh0LlxcblZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGFyZSBBLVosIGEteiwgMC05LCBcXCcrXFwnLCBcXCcvXFwnLGFuZCBcXCc9XFwnXFxuRXhwZWN0IGVycm9ycyBpbiBkZWNvZGluZy4nKTtcbiAgICAgIH1cbiAgICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9cXD1dL2csICcnKTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGVuYzEgPSB0aGlzLktFWV9TVFIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzIgPSB0aGlzLktFWV9TVFIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzMgPSB0aGlzLktFWV9TVFIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzQgPSB0aGlzLktFWV9TVFIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGNocjEgPSBlbmMxIDw8IDIgfCBlbmMyID4+IDQ7XG4gICAgICAgIGNocjIgPSAoZW5jMiAmIDE1KSA8PCA0IHwgZW5jMyA+PiAyO1xuICAgICAgICBjaHIzID0gKGVuYzMgJiAzKSA8PCA2IHwgZW5jNDtcbiAgICAgICAgYnVmLnB1c2goY2hyMSk7XG4gICAgICAgIGlmIChlbmMzICE9PSA2NCkge1xuICAgICAgICAgIGJ1Zi5wdXNoKGNocjIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmM0ICE9PSA2NCkge1xuICAgICAgICAgIGJ1Zi5wdXNoKGNocjMpO1xuICAgICAgICB9XG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9ICcnO1xuICAgICAgICBlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gJyc7XG4gICAgICAgIGlmICghKGkgPCBpbnB1dC5sZW5ndGgpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBidWY7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEV4aWZSZXN0b3JlO1xufSgpO1xuXG5FeGlmUmVzdG9yZS5pbml0Q2xhc3MoKTtcblxuLypcbiAqIGNvbnRlbnRsb2FkZWQuanNcbiAqXG4gKiBBdXRob3I6IERpZWdvIFBlcmluaSAoZGllZ28ucGVyaW5pIGF0IGdtYWlsLmNvbSlcbiAqIFN1bW1hcnk6IGNyb3NzLWJyb3dzZXIgd3JhcHBlciBmb3IgRE9NQ29udGVudExvYWRlZFxuICogVXBkYXRlZDogMjAxMDEwMjBcbiAqIExpY2Vuc2U6IE1JVFxuICogVmVyc2lvbjogMS4yXG4gKlxuICogVVJMOlxuICogaHR0cDovL2phdmFzY3JpcHQubndib3guY29tL0NvbnRlbnRMb2FkZWQvXG4gKiBodHRwOi8vamF2YXNjcmlwdC5ud2JveC5jb20vQ29udGVudExvYWRlZC9NSVQtTElDRU5TRVxuICovXG5cbi8vIEB3aW4gd2luZG93IHJlZmVyZW5jZVxuLy8gQGZuIGZ1bmN0aW9uIHJlZmVyZW5jZVxudmFyIGNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbiBjb250ZW50TG9hZGVkKHdpbiwgZm4pIHtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgdmFyIHRvcCA9IHRydWU7XG4gIHZhciBkb2MgPSB3aW4uZG9jdW1lbnQ7XG4gIHZhciByb290ID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgdmFyIGFkZCA9IGRvYy5hZGRFdmVudExpc3RlbmVyID8gXCJhZGRFdmVudExpc3RlbmVyXCIgOiBcImF0dGFjaEV2ZW50XCI7XG4gIHZhciByZW0gPSBkb2MuYWRkRXZlbnRMaXN0ZW5lciA/IFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiIDogXCJkZXRhY2hFdmVudFwiO1xuICB2YXIgcHJlID0gZG9jLmFkZEV2ZW50TGlzdGVuZXIgPyBcIlwiIDogXCJvblwiO1xuICB2YXIgaW5pdCA9IGZ1bmN0aW9uIGluaXQoZSkge1xuICAgIGlmIChlLnR5cGUgPT09IFwicmVhZHlzdGF0ZWNoYW5nZVwiICYmIGRvYy5yZWFkeVN0YXRlICE9PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgKGUudHlwZSA9PT0gXCJsb2FkXCIgPyB3aW4gOiBkb2MpW3JlbV0ocHJlICsgZS50eXBlLCBpbml0LCBmYWxzZSk7XG4gICAgaWYgKCFkb25lICYmIChkb25lID0gdHJ1ZSkpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHdpbiwgZS50eXBlIHx8IGUpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgcG9sbCA9IGZ1bmN0aW9uIHBvbGwoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJvb3QuZG9TY3JvbGwoXCJsZWZ0XCIpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldFRpbWVvdXQocG9sbCwgNTApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdChcInBvbGxcIik7XG4gIH07XG5cbiAgaWYgKGRvYy5yZWFkeVN0YXRlICE9PSBcImNvbXBsZXRlXCIpIHtcbiAgICBpZiAoZG9jLmNyZWF0ZUV2ZW50T2JqZWN0ICYmIHJvb3QuZG9TY3JvbGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRvcCA9ICF3aW4uZnJhbWVFbGVtZW50O1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgICBpZiAodG9wKSB7XG4gICAgICAgIHBvbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZG9jW2FkZF0ocHJlICsgXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQsIGZhbHNlKTtcbiAgICBkb2NbYWRkXShwcmUgKyBcInJlYWR5c3RhdGVjaGFuZ2VcIiwgaW5pdCwgZmFsc2UpO1xuICAgIHJldHVybiB3aW5bYWRkXShwcmUgKyBcImxvYWRcIiwgaW5pdCwgZmFsc2UpO1xuICB9XG59O1xuXG4vLyBBcyBhIHNpbmdsZSBmdW5jdGlvbiB0byBiZSBhYmxlIHRvIHdyaXRlIHRlc3RzLlxuRHJvcHpvbmUuX2F1dG9EaXNjb3ZlckZ1bmN0aW9uID0gZnVuY3Rpb24gKCkge1xuICBpZiAoRHJvcHpvbmUuYXV0b0Rpc2NvdmVyKSB7XG4gICAgcmV0dXJuIERyb3B6b25lLmRpc2NvdmVyKCk7XG4gIH1cbn07XG5jb250ZW50TG9hZGVkKHdpbmRvdywgRHJvcHpvbmUuX2F1dG9EaXNjb3ZlckZ1bmN0aW9uKTtcblxuZnVuY3Rpb24gX19ndWFyZF9fKHZhbHVlLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwgPyB0cmFuc2Zvcm0odmFsdWUpIDogdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gX19ndWFyZE1ldGhvZF9fKG9iaiwgbWV0aG9kTmFtZSwgdHJhbnNmb3JtKSB7XG4gIGlmICh0eXBlb2Ygb2JqICE9PSAndW5kZWZpbmVkJyAmJiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9ialttZXRob2ROYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0cmFuc2Zvcm0ob2JqLCBtZXRob2ROYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iLCIvKiohXG4gKiBTb3J0YWJsZSAxLjEwLjJcbiAqIEBhdXRob3JcdFJ1YmFYYSAgIDx0cmFzaEBydWJheGEub3JnPlxuICogQGF1dGhvclx0b3dlbm0gICAgPG93ZW4yMzM1NUBnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcbiAgICB2YXIgb3duS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG5cbiAgICBpZiAodHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG93bktleXMgPSBvd25LZXlzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZSkuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBzeW0pLmVudW1lcmFibGU7XG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgb3duS2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkge1xuICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTtcbiAgdmFyIHRhcmdldCA9IHt9O1xuICB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gIHZhciBrZXksIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBrZXkgPSBzb3VyY2VLZXlzW2ldO1xuICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9O1xuXG4gIHZhciB0YXJnZXQgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKTtcblxuICB2YXIga2V5LCBpO1xuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHNvdXJjZVN5bWJvbEtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZSk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlU3ltYm9sS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gc291cmNlU3ltYm9sS2V5c1tpXTtcbiAgICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlO1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7XG4gIHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7XG4gIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7XG59XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xufVxuXG52YXIgdmVyc2lvbiA9IFwiMS4xMC4yXCI7XG5cbmZ1bmN0aW9uIHVzZXJBZ2VudChwYXR0ZXJuKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubmF2aWdhdG9yKSB7XG4gICAgcmV0dXJuICEhXG4gICAgLypAX19QVVJFX18qL1xuICAgIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2gocGF0dGVybik7XG4gIH1cbn1cblxudmFyIElFMTFPckxlc3MgPSB1c2VyQWdlbnQoLyg/OlRyaWRlbnQuKnJ2WyA6XT8xMVxcLnxtc2llfGllbW9iaWxlfFdpbmRvd3MgUGhvbmUpL2kpO1xudmFyIEVkZ2UgPSB1c2VyQWdlbnQoL0VkZ2UvaSk7XG52YXIgRmlyZUZveCA9IHVzZXJBZ2VudCgvZmlyZWZveC9pKTtcbnZhciBTYWZhcmkgPSB1c2VyQWdlbnQoL3NhZmFyaS9pKSAmJiAhdXNlckFnZW50KC9jaHJvbWUvaSkgJiYgIXVzZXJBZ2VudCgvYW5kcm9pZC9pKTtcbnZhciBJT1MgPSB1c2VyQWdlbnQoL2lQKGFkfG9kfGhvbmUpL2kpO1xudmFyIENocm9tZUZvckFuZHJvaWQgPSB1c2VyQWdlbnQoL2Nocm9tZS9pKSAmJiB1c2VyQWdlbnQoL2FuZHJvaWQvaSk7XG5cbnZhciBjYXB0dXJlTW9kZSA9IHtcbiAgY2FwdHVyZTogZmFsc2UsXG4gIHBhc3NpdmU6IGZhbHNlXG59O1xuXG5mdW5jdGlvbiBvbihlbCwgZXZlbnQsIGZuKSB7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCAhSUUxMU9yTGVzcyAmJiBjYXB0dXJlTW9kZSk7XG59XG5cbmZ1bmN0aW9uIG9mZihlbCwgZXZlbnQsIGZuKSB7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCAhSUUxMU9yTGVzcyAmJiBjYXB0dXJlTW9kZSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMoXG4vKipIVE1MRWxlbWVudCovXG5lbCxcbi8qKlN0cmluZyovXG5zZWxlY3Rvcikge1xuICBpZiAoIXNlbGVjdG9yKSByZXR1cm47XG4gIHNlbGVjdG9yWzBdID09PSAnPicgJiYgKHNlbGVjdG9yID0gc2VsZWN0b3Iuc3Vic3RyaW5nKDEpKTtcblxuICBpZiAoZWwpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGVsLm1hdGNoZXMpIHtcbiAgICAgICAgcmV0dXJuIGVsLm1hdGNoZXMoc2VsZWN0b3IpO1xuICAgICAgfSBlbHNlIGlmIChlbC5tc01hdGNoZXNTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZWwubXNNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgfSBlbHNlIGlmIChlbC53ZWJraXRNYXRjaGVzU2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGVsLndlYmtpdE1hdGNoZXNTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFyZW50T3JIb3N0KGVsKSB7XG4gIHJldHVybiBlbC5ob3N0ICYmIGVsICE9PSBkb2N1bWVudCAmJiBlbC5ob3N0Lm5vZGVUeXBlID8gZWwuaG9zdCA6IGVsLnBhcmVudE5vZGU7XG59XG5cbmZ1bmN0aW9uIGNsb3Nlc3QoXG4vKipIVE1MRWxlbWVudCovXG5lbCxcbi8qKlN0cmluZyovXG5zZWxlY3Rvcixcbi8qKkhUTUxFbGVtZW50Ki9cbmN0eCwgaW5jbHVkZUNUWCkge1xuICBpZiAoZWwpIHtcbiAgICBjdHggPSBjdHggfHwgZG9jdW1lbnQ7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoc2VsZWN0b3IgIT0gbnVsbCAmJiAoc2VsZWN0b3JbMF0gPT09ICc+JyA/IGVsLnBhcmVudE5vZGUgPT09IGN0eCAmJiBtYXRjaGVzKGVsLCBzZWxlY3RvcikgOiBtYXRjaGVzKGVsLCBzZWxlY3RvcikpIHx8IGluY2x1ZGVDVFggJiYgZWwgPT09IGN0eCkge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbCA9PT0gY3R4KSBicmVhaztcbiAgICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICB9IHdoaWxlIChlbCA9IGdldFBhcmVudE9ySG9zdChlbCkpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbnZhciBSX1NQQUNFID0gL1xccysvZztcblxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoZWwsIG5hbWUsIHN0YXRlKSB7XG4gIGlmIChlbCAmJiBuYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgZWwuY2xhc3NMaXN0W3N0YXRlID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjbGFzc05hbWUgPSAoJyAnICsgZWwuY2xhc3NOYW1lICsgJyAnKS5yZXBsYWNlKFJfU1BBQ0UsICcgJykucmVwbGFjZSgnICcgKyBuYW1lICsgJyAnLCAnICcpO1xuICAgICAgZWwuY2xhc3NOYW1lID0gKGNsYXNzTmFtZSArIChzdGF0ZSA/ICcgJyArIG5hbWUgOiAnJykpLnJlcGxhY2UoUl9TUEFDRSwgJyAnKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY3NzKGVsLCBwcm9wLCB2YWwpIHtcbiAgdmFyIHN0eWxlID0gZWwgJiYgZWwuc3R5bGU7XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgaWYgKHZhbCA9PT0gdm9pZCAwKSB7XG4gICAgICBpZiAoZG9jdW1lbnQuZGVmYXVsdFZpZXcgJiYgZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICB2YWwgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsLCAnJyk7XG4gICAgICB9IGVsc2UgaWYgKGVsLmN1cnJlbnRTdHlsZSkge1xuICAgICAgICB2YWwgPSBlbC5jdXJyZW50U3R5bGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9wID09PSB2b2lkIDAgPyB2YWwgOiB2YWxbcHJvcF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghKHByb3AgaW4gc3R5bGUpICYmIHByb3AuaW5kZXhPZignd2Via2l0JykgPT09IC0xKSB7XG4gICAgICAgIHByb3AgPSAnLXdlYmtpdC0nICsgcHJvcDtcbiAgICAgIH1cblxuICAgICAgc3R5bGVbcHJvcF0gPSB2YWwgKyAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyAnJyA6ICdweCcpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYXRyaXgoZWwsIHNlbGZPbmx5KSB7XG4gIHZhciBhcHBsaWVkVHJhbnNmb3JtcyA9ICcnO1xuXG4gIGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgYXBwbGllZFRyYW5zZm9ybXMgPSBlbDtcbiAgfSBlbHNlIHtcbiAgICBkbyB7XG4gICAgICB2YXIgdHJhbnNmb3JtID0gY3NzKGVsLCAndHJhbnNmb3JtJyk7XG5cbiAgICAgIGlmICh0cmFuc2Zvcm0gJiYgdHJhbnNmb3JtICE9PSAnbm9uZScpIHtcbiAgICAgICAgYXBwbGllZFRyYW5zZm9ybXMgPSB0cmFuc2Zvcm0gKyAnICcgKyBhcHBsaWVkVHJhbnNmb3JtcztcbiAgICAgIH1cbiAgICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cblxuICAgIH0gd2hpbGUgKCFzZWxmT25seSAmJiAoZWwgPSBlbC5wYXJlbnROb2RlKSk7XG4gIH1cblxuICB2YXIgbWF0cml4Rm4gPSB3aW5kb3cuRE9NTWF0cml4IHx8IHdpbmRvdy5XZWJLaXRDU1NNYXRyaXggfHwgd2luZG93LkNTU01hdHJpeCB8fCB3aW5kb3cuTVNDU1NNYXRyaXg7XG4gIC8qanNoaW50IC1XMDU2ICovXG5cbiAgcmV0dXJuIG1hdHJpeEZuICYmIG5ldyBtYXRyaXhGbihhcHBsaWVkVHJhbnNmb3Jtcyk7XG59XG5cbmZ1bmN0aW9uIGZpbmQoY3R4LCB0YWdOYW1lLCBpdGVyYXRvcikge1xuICBpZiAoY3R4KSB7XG4gICAgdmFyIGxpc3QgPSBjdHguZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSksXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBuID0gbGlzdC5sZW5ndGg7XG5cbiAgICBpZiAoaXRlcmF0b3IpIHtcbiAgICAgIGZvciAoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdG9yKGxpc3RbaV0sIGkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcmV0dXJuIFtdO1xufVxuXG5mdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCkge1xuICB2YXIgc2Nyb2xsaW5nRWxlbWVudCA9IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQ7XG5cbiAgaWYgKHNjcm9sbGluZ0VsZW1lbnQpIHtcbiAgICByZXR1cm4gc2Nyb2xsaW5nRWxlbWVudDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9XG59XG4vKipcclxuICogUmV0dXJucyB0aGUgXCJib3VuZGluZyBjbGllbnQgcmVjdFwiIG9mIGdpdmVuIGVsZW1lbnRcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsICAgICAgICAgICAgICAgICAgICAgICBUaGUgZWxlbWVudCB3aG9zZSBib3VuZGluZ0NsaWVudFJlY3QgaXMgd2FudGVkXHJcbiAqIEBwYXJhbSAge1tCb29sZWFuXX0gcmVsYXRpdmVUb0NvbnRhaW5pbmdCbG9jayAgV2hldGhlciB0aGUgcmVjdCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGNvbnRhaW5pbmcgYmxvY2sgb2YgKGluY2x1ZGluZykgdGhlIGNvbnRhaW5lclxyXG4gKiBAcGFyYW0gIHtbQm9vbGVhbl19IHJlbGF0aXZlVG9Ob25TdGF0aWNQYXJlbnQgIFdoZXRoZXIgdGhlIHJlY3Qgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSByZWxhdGl2ZSBwYXJlbnQgb2YgKGluY2x1ZGluZykgdGhlIGNvbnRhaWVuclxyXG4gKiBAcGFyYW0gIHtbQm9vbGVhbl19IHVuZG9TY2FsZSAgICAgICAgICAgICAgICAgIFdoZXRoZXIgdGhlIGNvbnRhaW5lcidzIHNjYWxlKCkgc2hvdWxkIGJlIHVuZG9uZVxyXG4gKiBAcGFyYW0gIHtbSFRNTEVsZW1lbnRdfSBjb250YWluZXIgICAgICAgICAgICAgIFRoZSBwYXJlbnQgdGhlIGVsZW1lbnQgd2lsbCBiZSBwbGFjZWQgaW5cclxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgYm91bmRpbmdDbGllbnRSZWN0IG9mIGVsLCB3aXRoIHNwZWNpZmllZCBhZGp1c3RtZW50c1xyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRSZWN0KGVsLCByZWxhdGl2ZVRvQ29udGFpbmluZ0Jsb2NrLCByZWxhdGl2ZVRvTm9uU3RhdGljUGFyZW50LCB1bmRvU2NhbGUsIGNvbnRhaW5lcikge1xuICBpZiAoIWVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCAmJiBlbCAhPT0gd2luZG93KSByZXR1cm47XG4gIHZhciBlbFJlY3QsIHRvcCwgbGVmdCwgYm90dG9tLCByaWdodCwgaGVpZ2h0LCB3aWR0aDtcblxuICBpZiAoZWwgIT09IHdpbmRvdyAmJiBlbCAhPT0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpKSB7XG4gICAgZWxSZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdG9wID0gZWxSZWN0LnRvcDtcbiAgICBsZWZ0ID0gZWxSZWN0LmxlZnQ7XG4gICAgYm90dG9tID0gZWxSZWN0LmJvdHRvbTtcbiAgICByaWdodCA9IGVsUmVjdC5yaWdodDtcbiAgICBoZWlnaHQgPSBlbFJlY3QuaGVpZ2h0O1xuICAgIHdpZHRoID0gZWxSZWN0LndpZHRoO1xuICB9IGVsc2Uge1xuICAgIHRvcCA9IDA7XG4gICAgbGVmdCA9IDA7XG4gICAgYm90dG9tID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHJpZ2h0ID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gIH1cblxuICBpZiAoKHJlbGF0aXZlVG9Db250YWluaW5nQmxvY2sgfHwgcmVsYXRpdmVUb05vblN0YXRpY1BhcmVudCkgJiYgZWwgIT09IHdpbmRvdykge1xuICAgIC8vIEFkanVzdCBmb3IgdHJhbnNsYXRlKClcbiAgICBjb250YWluZXIgPSBjb250YWluZXIgfHwgZWwucGFyZW50Tm9kZTsgLy8gc29sdmVzICMxMTIzIChzZWU6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNzk1MzgwNi82MDg4MzEyKVxuICAgIC8vIE5vdCBuZWVkZWQgb24gPD0gSUUxMVxuXG4gICAgaWYgKCFJRTExT3JMZXNzKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChjb250YWluZXIgJiYgY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCAmJiAoY3NzKGNvbnRhaW5lciwgJ3RyYW5zZm9ybScpICE9PSAnbm9uZScgfHwgcmVsYXRpdmVUb05vblN0YXRpY1BhcmVudCAmJiBjc3MoY29udGFpbmVyLCAncG9zaXRpb24nKSAhPT0gJ3N0YXRpYycpKSB7XG4gICAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7IC8vIFNldCByZWxhdGl2ZSB0byBlZGdlcyBvZiBwYWRkaW5nIGJveCBvZiBjb250YWluZXJcblxuICAgICAgICAgIHRvcCAtPSBjb250YWluZXJSZWN0LnRvcCArIHBhcnNlSW50KGNzcyhjb250YWluZXIsICdib3JkZXItdG9wLXdpZHRoJykpO1xuICAgICAgICAgIGxlZnQgLT0gY29udGFpbmVyUmVjdC5sZWZ0ICsgcGFyc2VJbnQoY3NzKGNvbnRhaW5lciwgJ2JvcmRlci1sZWZ0LXdpZHRoJykpO1xuICAgICAgICAgIGJvdHRvbSA9IHRvcCArIGVsUmVjdC5oZWlnaHQ7XG4gICAgICAgICAgcmlnaHQgPSBsZWZ0ICsgZWxSZWN0LndpZHRoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cblxuICAgICAgfSB3aGlsZSAoY29udGFpbmVyID0gY29udGFpbmVyLnBhcmVudE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1bmRvU2NhbGUgJiYgZWwgIT09IHdpbmRvdykge1xuICAgIC8vIEFkanVzdCBmb3Igc2NhbGUoKVxuICAgIHZhciBlbE1hdHJpeCA9IG1hdHJpeChjb250YWluZXIgfHwgZWwpLFxuICAgICAgICBzY2FsZVggPSBlbE1hdHJpeCAmJiBlbE1hdHJpeC5hLFxuICAgICAgICBzY2FsZVkgPSBlbE1hdHJpeCAmJiBlbE1hdHJpeC5kO1xuXG4gICAgaWYgKGVsTWF0cml4KSB7XG4gICAgICB0b3AgLz0gc2NhbGVZO1xuICAgICAgbGVmdCAvPSBzY2FsZVg7XG4gICAgICB3aWR0aCAvPSBzY2FsZVg7XG4gICAgICBoZWlnaHQgLz0gc2NhbGVZO1xuICAgICAgYm90dG9tID0gdG9wICsgaGVpZ2h0O1xuICAgICAgcmlnaHQgPSBsZWZ0ICsgd2lkdGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IHRvcCxcbiAgICBsZWZ0OiBsZWZ0LFxuICAgIGJvdHRvbTogYm90dG9tLFxuICAgIHJpZ2h0OiByaWdodCxcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfTtcbn1cbi8qKlxyXG4gKiBDaGVja3MgaWYgYSBzaWRlIG9mIGFuIGVsZW1lbnQgaXMgc2Nyb2xsZWQgcGFzdCBhIHNpZGUgb2YgaXRzIHBhcmVudHNcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICBlbCAgICAgICAgICAgVGhlIGVsZW1lbnQgd2hvJ3Mgc2lkZSBiZWluZyBzY3JvbGxlZCBvdXQgb2YgdmlldyBpcyBpbiBxdWVzdGlvblxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgIGVsU2lkZSAgICAgICBTaWRlIG9mIHRoZSBlbGVtZW50IGluIHF1ZXN0aW9uICgndG9wJywgJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJylcclxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICBwYXJlbnRTaWRlICAgU2lkZSBvZiB0aGUgcGFyZW50IGluIHF1ZXN0aW9uICgndG9wJywgJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJylcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgICAgICAgVGhlIHBhcmVudCBzY3JvbGwgZWxlbWVudCB0aGF0IHRoZSBlbCdzIHNpZGUgaXMgc2Nyb2xsZWQgcGFzdCwgb3IgbnVsbCBpZiB0aGVyZSBpcyBubyBzdWNoIGVsZW1lbnRcclxuICovXG5cblxuZnVuY3Rpb24gaXNTY3JvbGxlZFBhc3QoZWwsIGVsU2lkZSwgcGFyZW50U2lkZSkge1xuICB2YXIgcGFyZW50ID0gZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoZWwsIHRydWUpLFxuICAgICAgZWxTaWRlVmFsID0gZ2V0UmVjdChlbClbZWxTaWRlXTtcbiAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICB2YXIgcGFyZW50U2lkZVZhbCA9IGdldFJlY3QocGFyZW50KVtwYXJlbnRTaWRlXSxcbiAgICAgICAgdmlzaWJsZSA9IHZvaWQgMDtcblxuICAgIGlmIChwYXJlbnRTaWRlID09PSAndG9wJyB8fCBwYXJlbnRTaWRlID09PSAnbGVmdCcpIHtcbiAgICAgIHZpc2libGUgPSBlbFNpZGVWYWwgPj0gcGFyZW50U2lkZVZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlzaWJsZSA9IGVsU2lkZVZhbCA8PSBwYXJlbnRTaWRlVmFsO1xuICAgIH1cblxuICAgIGlmICghdmlzaWJsZSkgcmV0dXJuIHBhcmVudDtcbiAgICBpZiAocGFyZW50ID09PSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCkpIGJyZWFrO1xuICAgIHBhcmVudCA9IGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KHBhcmVudCwgZmFsc2UpO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuLyoqXHJcbiAqIEdldHMgbnRoIGNoaWxkIG9mIGVsLCBpZ25vcmluZyBoaWRkZW4gY2hpbGRyZW4sIHNvcnRhYmxlJ3MgZWxlbWVudHMgKGRvZXMgbm90IGlnbm9yZSBjbG9uZSBpZiBpdCdzIHZpc2libGUpXHJcbiAqIGFuZCBub24tZHJhZ2dhYmxlIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbCAgICAgICBUaGUgcGFyZW50IGVsZW1lbnRcclxuICogQHBhcmFtICB7TnVtYmVyfSBjaGlsZE51bSAgICAgIFRoZSBpbmRleCBvZiB0aGUgY2hpbGRcclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAgICAgIFBhcmVudCBTb3J0YWJsZSdzIG9wdGlvbnNcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgIFRoZSBjaGlsZCBhdCBpbmRleCBjaGlsZE51bSwgb3IgbnVsbCBpZiBub3QgZm91bmRcclxuICovXG5cblxuZnVuY3Rpb24gZ2V0Q2hpbGQoZWwsIGNoaWxkTnVtLCBvcHRpb25zKSB7XG4gIHZhciBjdXJyZW50Q2hpbGQgPSAwLFxuICAgICAgaSA9IDAsXG4gICAgICBjaGlsZHJlbiA9IGVsLmNoaWxkcmVuO1xuXG4gIHdoaWxlIChpIDwgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgaWYgKGNoaWxkcmVuW2ldLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJyAmJiBjaGlsZHJlbltpXSAhPT0gU29ydGFibGUuZ2hvc3QgJiYgY2hpbGRyZW5baV0gIT09IFNvcnRhYmxlLmRyYWdnZWQgJiYgY2xvc2VzdChjaGlsZHJlbltpXSwgb3B0aW9ucy5kcmFnZ2FibGUsIGVsLCBmYWxzZSkpIHtcbiAgICAgIGlmIChjdXJyZW50Q2hpbGQgPT09IGNoaWxkTnVtKSB7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbltpXTtcbiAgICAgIH1cblxuICAgICAgY3VycmVudENoaWxkKys7XG4gICAgfVxuXG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4vKipcclxuICogR2V0cyB0aGUgbGFzdCBjaGlsZCBpbiB0aGUgZWwsIGlnbm9yaW5nIGdob3N0RWwgb3IgaW52aXNpYmxlIGVsZW1lbnRzIChjbG9uZXMpXHJcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbCAgICAgICBQYXJlbnQgZWxlbWVudFxyXG4gKiBAcGFyYW0gIHtzZWxlY3Rvcn0gc2VsZWN0b3IgICAgQW55IG90aGVyIGVsZW1lbnRzIHRoYXQgc2hvdWxkIGJlIGlnbm9yZWRcclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgIFRoZSBsYXN0IGNoaWxkLCBpZ25vcmluZyBnaG9zdEVsXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGxhc3RDaGlsZChlbCwgc2VsZWN0b3IpIHtcbiAgdmFyIGxhc3QgPSBlbC5sYXN0RWxlbWVudENoaWxkO1xuXG4gIHdoaWxlIChsYXN0ICYmIChsYXN0ID09PSBTb3J0YWJsZS5naG9zdCB8fCBjc3MobGFzdCwgJ2Rpc3BsYXknKSA9PT0gJ25vbmUnIHx8IHNlbGVjdG9yICYmICFtYXRjaGVzKGxhc3QsIHNlbGVjdG9yKSkpIHtcbiAgICBsYXN0ID0gbGFzdC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICB9XG5cbiAgcmV0dXJuIGxhc3QgfHwgbnVsbDtcbn1cbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBpbmRleCBvZiBhbiBlbGVtZW50IHdpdGhpbiBpdHMgcGFyZW50IGZvciBhIHNlbGVjdGVkIHNldCBvZlxyXG4gKiBlbGVtZW50c1xyXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxcclxuICogQHBhcmFtICB7c2VsZWN0b3J9IHNlbGVjdG9yXHJcbiAqIEByZXR1cm4ge251bWJlcn1cclxuICovXG5cblxuZnVuY3Rpb24gaW5kZXgoZWwsIHNlbGVjdG9yKSB7XG4gIHZhciBpbmRleCA9IDA7XG5cbiAgaWYgKCFlbCB8fCAhZWwucGFyZW50Tm9kZSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG5cblxuICB3aGlsZSAoZWwgPSBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSB7XG4gICAgaWYgKGVsLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT09ICdURU1QTEFURScgJiYgZWwgIT09IFNvcnRhYmxlLmNsb25lICYmICghc2VsZWN0b3IgfHwgbWF0Y2hlcyhlbCwgc2VsZWN0b3IpKSkge1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59XG4vKipcclxuICogUmV0dXJucyB0aGUgc2Nyb2xsIG9mZnNldCBvZiB0aGUgZ2l2ZW4gZWxlbWVudCwgYWRkZWQgd2l0aCBhbGwgdGhlIHNjcm9sbCBvZmZzZXRzIG9mIHBhcmVudCBlbGVtZW50cy5cclxuICogVGhlIHZhbHVlIGlzIHJldHVybmVkIGluIHJlYWwgcGl4ZWxzLlxyXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxcclxuICogQHJldHVybiB7QXJyYXl9ICAgICAgICAgICAgIE9mZnNldHMgaW4gdGhlIGZvcm1hdCBvZiBbbGVmdCwgdG9wXVxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRSZWxhdGl2ZVNjcm9sbE9mZnNldChlbCkge1xuICB2YXIgb2Zmc2V0TGVmdCA9IDAsXG4gICAgICBvZmZzZXRUb3AgPSAwLFxuICAgICAgd2luU2Nyb2xsZXIgPSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG5cbiAgaWYgKGVsKSB7XG4gICAgZG8ge1xuICAgICAgdmFyIGVsTWF0cml4ID0gbWF0cml4KGVsKSxcbiAgICAgICAgICBzY2FsZVggPSBlbE1hdHJpeC5hLFxuICAgICAgICAgIHNjYWxlWSA9IGVsTWF0cml4LmQ7XG4gICAgICBvZmZzZXRMZWZ0ICs9IGVsLnNjcm9sbExlZnQgKiBzY2FsZVg7XG4gICAgICBvZmZzZXRUb3AgKz0gZWwuc2Nyb2xsVG9wICogc2NhbGVZO1xuICAgIH0gd2hpbGUgKGVsICE9PSB3aW5TY3JvbGxlciAmJiAoZWwgPSBlbC5wYXJlbnROb2RlKSk7XG4gIH1cblxuICByZXR1cm4gW29mZnNldExlZnQsIG9mZnNldFRvcF07XG59XG4vKipcclxuICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG9iamVjdCB3aXRoaW4gdGhlIGdpdmVuIGFycmF5XHJcbiAqIEBwYXJhbSAge0FycmF5fSBhcnIgICBBcnJheSB0aGF0IG1heSBvciBtYXkgbm90IGhvbGQgdGhlIG9iamVjdFxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgQW4gb2JqZWN0IHRoYXQgaGFzIGEga2V5LXZhbHVlIHBhaXIgdW5pcXVlIHRvIGFuZCBpZGVudGljYWwgdG8gYSBrZXktdmFsdWUgcGFpciBpbiB0aGUgb2JqZWN0IHlvdSB3YW50IHRvIGZpbmRcclxuICogQHJldHVybiB7TnVtYmVyfSAgICAgIFRoZSBpbmRleCBvZiB0aGUgb2JqZWN0IGluIHRoZSBhcnJheSwgb3IgLTFcclxuICovXG5cblxuZnVuY3Rpb24gaW5kZXhPZk9iamVjdChhcnIsIG9iaikge1xuICBmb3IgKHZhciBpIGluIGFycikge1xuICAgIGlmICghYXJyLmhhc093blByb3BlcnR5KGkpKSBjb250aW51ZTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSAmJiBvYmpba2V5XSA9PT0gYXJyW2ldW2tleV0pIHJldHVybiBOdW1iZXIoaSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChlbCwgaW5jbHVkZVNlbGYpIHtcbiAgLy8gc2tpcCB0byB3aW5kb3dcbiAgaWYgKCFlbCB8fCAhZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSByZXR1cm4gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICB2YXIgZWxlbSA9IGVsO1xuICB2YXIgZ290U2VsZiA9IGZhbHNlO1xuXG4gIGRvIHtcbiAgICAvLyB3ZSBkb24ndCBuZWVkIHRvIGdldCBlbGVtIGNzcyBpZiBpdCBpc24ndCBldmVuIG92ZXJmbG93aW5nIGluIHRoZSBmaXJzdCBwbGFjZSAocGVyZm9ybWFuY2UpXG4gICAgaWYgKGVsZW0uY2xpZW50V2lkdGggPCBlbGVtLnNjcm9sbFdpZHRoIHx8IGVsZW0uY2xpZW50SGVpZ2h0IDwgZWxlbS5zY3JvbGxIZWlnaHQpIHtcbiAgICAgIHZhciBlbGVtQ1NTID0gY3NzKGVsZW0pO1xuXG4gICAgICBpZiAoZWxlbS5jbGllbnRXaWR0aCA8IGVsZW0uc2Nyb2xsV2lkdGggJiYgKGVsZW1DU1Mub3ZlcmZsb3dYID09ICdhdXRvJyB8fCBlbGVtQ1NTLm92ZXJmbG93WCA9PSAnc2Nyb2xsJykgfHwgZWxlbS5jbGllbnRIZWlnaHQgPCBlbGVtLnNjcm9sbEhlaWdodCAmJiAoZWxlbUNTUy5vdmVyZmxvd1kgPT0gJ2F1dG8nIHx8IGVsZW1DU1Mub3ZlcmZsb3dZID09ICdzY3JvbGwnKSkge1xuICAgICAgICBpZiAoIWVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHx8IGVsZW0gPT09IGRvY3VtZW50LmJvZHkpIHJldHVybiBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG4gICAgICAgIGlmIChnb3RTZWxmIHx8IGluY2x1ZGVTZWxmKSByZXR1cm4gZWxlbTtcbiAgICAgICAgZ290U2VsZiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cblxuICB9IHdoaWxlIChlbGVtID0gZWxlbS5wYXJlbnROb2RlKTtcblxuICByZXR1cm4gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xufVxuXG5mdW5jdGlvbiBleHRlbmQoZHN0LCBzcmMpIHtcbiAgaWYgKGRzdCAmJiBzcmMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZHN0O1xufVxuXG5mdW5jdGlvbiBpc1JlY3RFcXVhbChyZWN0MSwgcmVjdDIpIHtcbiAgcmV0dXJuIE1hdGgucm91bmQocmVjdDEudG9wKSA9PT0gTWF0aC5yb3VuZChyZWN0Mi50b3ApICYmIE1hdGgucm91bmQocmVjdDEubGVmdCkgPT09IE1hdGgucm91bmQocmVjdDIubGVmdCkgJiYgTWF0aC5yb3VuZChyZWN0MS5oZWlnaHQpID09PSBNYXRoLnJvdW5kKHJlY3QyLmhlaWdodCkgJiYgTWF0aC5yb3VuZChyZWN0MS53aWR0aCkgPT09IE1hdGgucm91bmQocmVjdDIud2lkdGgpO1xufVxuXG52YXIgX3Rocm90dGxlVGltZW91dDtcblxuZnVuY3Rpb24gdGhyb3R0bGUoY2FsbGJhY2ssIG1zKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFfdGhyb3R0bGVUaW1lb3V0KSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKF90aGlzLCBhcmdzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KF90aGlzLCBhcmdzKTtcbiAgICAgIH1cblxuICAgICAgX3Rocm90dGxlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhyb3R0bGVUaW1lb3V0ID0gdm9pZCAwO1xuICAgICAgfSwgbXMpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsVGhyb3R0bGUoKSB7XG4gIGNsZWFyVGltZW91dChfdGhyb3R0bGVUaW1lb3V0KTtcbiAgX3Rocm90dGxlVGltZW91dCA9IHZvaWQgMDtcbn1cblxuZnVuY3Rpb24gc2Nyb2xsQnkoZWwsIHgsIHkpIHtcbiAgZWwuc2Nyb2xsTGVmdCArPSB4O1xuICBlbC5zY3JvbGxUb3AgKz0geTtcbn1cblxuZnVuY3Rpb24gY2xvbmUoZWwpIHtcbiAgdmFyIFBvbHltZXIgPSB3aW5kb3cuUG9seW1lcjtcbiAgdmFyICQgPSB3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0bztcblxuICBpZiAoUG9seW1lciAmJiBQb2x5bWVyLmRvbSkge1xuICAgIHJldHVybiBQb2x5bWVyLmRvbShlbCkuY2xvbmVOb2RlKHRydWUpO1xuICB9IGVsc2UgaWYgKCQpIHtcbiAgICByZXR1cm4gJChlbCkuY2xvbmUodHJ1ZSlbMF07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGVsLmNsb25lTm9kZSh0cnVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRSZWN0KGVsLCByZWN0KSB7XG4gIGNzcyhlbCwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gIGNzcyhlbCwgJ3RvcCcsIHJlY3QudG9wKTtcbiAgY3NzKGVsLCAnbGVmdCcsIHJlY3QubGVmdCk7XG4gIGNzcyhlbCwgJ3dpZHRoJywgcmVjdC53aWR0aCk7XG4gIGNzcyhlbCwgJ2hlaWdodCcsIHJlY3QuaGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gdW5zZXRSZWN0KGVsKSB7XG4gIGNzcyhlbCwgJ3Bvc2l0aW9uJywgJycpO1xuICBjc3MoZWwsICd0b3AnLCAnJyk7XG4gIGNzcyhlbCwgJ2xlZnQnLCAnJyk7XG4gIGNzcyhlbCwgJ3dpZHRoJywgJycpO1xuICBjc3MoZWwsICdoZWlnaHQnLCAnJyk7XG59XG5cbnZhciBleHBhbmRvID0gJ1NvcnRhYmxlJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG5mdW5jdGlvbiBBbmltYXRpb25TdGF0ZU1hbmFnZXIoKSB7XG4gIHZhciBhbmltYXRpb25TdGF0ZXMgPSBbXSxcbiAgICAgIGFuaW1hdGlvbkNhbGxiYWNrSWQ7XG4gIHJldHVybiB7XG4gICAgY2FwdHVyZUFuaW1hdGlvblN0YXRlOiBmdW5jdGlvbiBjYXB0dXJlQW5pbWF0aW9uU3RhdGUoKSB7XG4gICAgICBhbmltYXRpb25TdGF0ZXMgPSBbXTtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmFuaW1hdGlvbikgcmV0dXJuO1xuICAgICAgdmFyIGNoaWxkcmVuID0gW10uc2xpY2UuY2FsbCh0aGlzLmVsLmNoaWxkcmVuKTtcbiAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGlmIChjc3MoY2hpbGQsICdkaXNwbGF5JykgPT09ICdub25lJyB8fCBjaGlsZCA9PT0gU29ydGFibGUuZ2hvc3QpIHJldHVybjtcbiAgICAgICAgYW5pbWF0aW9uU3RhdGVzLnB1c2goe1xuICAgICAgICAgIHRhcmdldDogY2hpbGQsXG4gICAgICAgICAgcmVjdDogZ2V0UmVjdChjaGlsZClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGZyb21SZWN0ID0gX29iamVjdFNwcmVhZCh7fSwgYW5pbWF0aW9uU3RhdGVzW2FuaW1hdGlvblN0YXRlcy5sZW5ndGggLSAxXS5yZWN0KTsgLy8gSWYgYW5pbWF0aW5nOiBjb21wZW5zYXRlIGZvciBjdXJyZW50IGFuaW1hdGlvblxuXG5cbiAgICAgICAgaWYgKGNoaWxkLnRoaXNBbmltYXRpb25EdXJhdGlvbikge1xuICAgICAgICAgIHZhciBjaGlsZE1hdHJpeCA9IG1hdHJpeChjaGlsZCwgdHJ1ZSk7XG5cbiAgICAgICAgICBpZiAoY2hpbGRNYXRyaXgpIHtcbiAgICAgICAgICAgIGZyb21SZWN0LnRvcCAtPSBjaGlsZE1hdHJpeC5mO1xuICAgICAgICAgICAgZnJvbVJlY3QubGVmdCAtPSBjaGlsZE1hdHJpeC5lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNoaWxkLmZyb21SZWN0ID0gZnJvbVJlY3Q7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGFkZEFuaW1hdGlvblN0YXRlOiBmdW5jdGlvbiBhZGRBbmltYXRpb25TdGF0ZShzdGF0ZSkge1xuICAgICAgYW5pbWF0aW9uU3RhdGVzLnB1c2goc3RhdGUpO1xuICAgIH0sXG4gICAgcmVtb3ZlQW5pbWF0aW9uU3RhdGU6IGZ1bmN0aW9uIHJlbW92ZUFuaW1hdGlvblN0YXRlKHRhcmdldCkge1xuICAgICAgYW5pbWF0aW9uU3RhdGVzLnNwbGljZShpbmRleE9mT2JqZWN0KGFuaW1hdGlvblN0YXRlcywge1xuICAgICAgICB0YXJnZXQ6IHRhcmdldFxuICAgICAgfSksIDEpO1xuICAgIH0sXG4gICAgYW5pbWF0ZUFsbDogZnVuY3Rpb24gYW5pbWF0ZUFsbChjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChhbmltYXRpb25DYWxsYmFja0lkKTtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgYW5pbWF0aW5nID0gZmFsc2UsXG4gICAgICAgICAgYW5pbWF0aW9uVGltZSA9IDA7XG4gICAgICBhbmltYXRpb25TdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIHRpbWUgPSAwLFxuICAgICAgICAgICAgdGFyZ2V0ID0gc3RhdGUudGFyZ2V0LFxuICAgICAgICAgICAgZnJvbVJlY3QgPSB0YXJnZXQuZnJvbVJlY3QsXG4gICAgICAgICAgICB0b1JlY3QgPSBnZXRSZWN0KHRhcmdldCksXG4gICAgICAgICAgICBwcmV2RnJvbVJlY3QgPSB0YXJnZXQucHJldkZyb21SZWN0LFxuICAgICAgICAgICAgcHJldlRvUmVjdCA9IHRhcmdldC5wcmV2VG9SZWN0LFxuICAgICAgICAgICAgYW5pbWF0aW5nUmVjdCA9IHN0YXRlLnJlY3QsXG4gICAgICAgICAgICB0YXJnZXRNYXRyaXggPSBtYXRyaXgodGFyZ2V0LCB0cnVlKTtcblxuICAgICAgICBpZiAodGFyZ2V0TWF0cml4KSB7XG4gICAgICAgICAgLy8gQ29tcGVuc2F0ZSBmb3IgY3VycmVudCBhbmltYXRpb25cbiAgICAgICAgICB0b1JlY3QudG9wIC09IHRhcmdldE1hdHJpeC5mO1xuICAgICAgICAgIHRvUmVjdC5sZWZ0IC09IHRhcmdldE1hdHJpeC5lO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0LnRvUmVjdCA9IHRvUmVjdDtcblxuICAgICAgICBpZiAodGFyZ2V0LnRoaXNBbmltYXRpb25EdXJhdGlvbikge1xuICAgICAgICAgIC8vIENvdWxkIGFsc28gY2hlY2sgaWYgYW5pbWF0aW5nUmVjdCBpcyBiZXR3ZWVuIGZyb21SZWN0IGFuZCB0b1JlY3RcbiAgICAgICAgICBpZiAoaXNSZWN0RXF1YWwocHJldkZyb21SZWN0LCB0b1JlY3QpICYmICFpc1JlY3RFcXVhbChmcm9tUmVjdCwgdG9SZWN0KSAmJiAvLyBNYWtlIHN1cmUgYW5pbWF0aW5nUmVjdCBpcyBvbiBsaW5lIGJldHdlZW4gdG9SZWN0ICYgZnJvbVJlY3RcbiAgICAgICAgICAoYW5pbWF0aW5nUmVjdC50b3AgLSB0b1JlY3QudG9wKSAvIChhbmltYXRpbmdSZWN0LmxlZnQgLSB0b1JlY3QubGVmdCkgPT09IChmcm9tUmVjdC50b3AgLSB0b1JlY3QudG9wKSAvIChmcm9tUmVjdC5sZWZ0IC0gdG9SZWN0LmxlZnQpKSB7XG4gICAgICAgICAgICAvLyBJZiByZXR1cm5pbmcgdG8gc2FtZSBwbGFjZSBhcyBzdGFydGVkIGZyb20gYW5pbWF0aW9uIGFuZCBvbiBzYW1lIGF4aXNcbiAgICAgICAgICAgIHRpbWUgPSBjYWxjdWxhdGVSZWFsVGltZShhbmltYXRpbmdSZWN0LCBwcmV2RnJvbVJlY3QsIHByZXZUb1JlY3QsIF90aGlzLm9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSAvLyBpZiBmcm9tUmVjdCAhPSB0b1JlY3Q6IGFuaW1hdGVcblxuXG4gICAgICAgIGlmICghaXNSZWN0RXF1YWwodG9SZWN0LCBmcm9tUmVjdCkpIHtcbiAgICAgICAgICB0YXJnZXQucHJldkZyb21SZWN0ID0gZnJvbVJlY3Q7XG4gICAgICAgICAgdGFyZ2V0LnByZXZUb1JlY3QgPSB0b1JlY3Q7XG5cbiAgICAgICAgICBpZiAoIXRpbWUpIHtcbiAgICAgICAgICAgIHRpbWUgPSBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpcy5hbmltYXRlKHRhcmdldCwgYW5pbWF0aW5nUmVjdCwgdG9SZWN0LCB0aW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aW1lKSB7XG4gICAgICAgICAgYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICBhbmltYXRpb25UaW1lID0gTWF0aC5tYXgoYW5pbWF0aW9uVGltZSwgdGltZSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRhcmdldC5hbmltYXRpb25SZXNldFRpbWVyKTtcbiAgICAgICAgICB0YXJnZXQuYW5pbWF0aW9uUmVzZXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGFyZ2V0LmFuaW1hdGlvblRpbWUgPSAwO1xuICAgICAgICAgICAgdGFyZ2V0LnByZXZGcm9tUmVjdCA9IG51bGw7XG4gICAgICAgICAgICB0YXJnZXQuZnJvbVJlY3QgPSBudWxsO1xuICAgICAgICAgICAgdGFyZ2V0LnByZXZUb1JlY3QgPSBudWxsO1xuICAgICAgICAgICAgdGFyZ2V0LnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IG51bGw7XG4gICAgICAgICAgfSwgdGltZSk7XG4gICAgICAgICAgdGFyZ2V0LnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IHRpbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY2xlYXJUaW1lb3V0KGFuaW1hdGlvbkNhbGxiYWNrSWQpO1xuXG4gICAgICBpZiAoIWFuaW1hdGluZykge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5pbWF0aW9uQ2FsbGJhY2tJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIH0sIGFuaW1hdGlvblRpbWUpO1xuICAgICAgfVxuXG4gICAgICBhbmltYXRpb25TdGF0ZXMgPSBbXTtcbiAgICB9LFxuICAgIGFuaW1hdGU6IGZ1bmN0aW9uIGFuaW1hdGUodGFyZ2V0LCBjdXJyZW50UmVjdCwgdG9SZWN0LCBkdXJhdGlvbikge1xuICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJycpO1xuICAgICAgICBjc3ModGFyZ2V0LCAndHJhbnNmb3JtJywgJycpO1xuICAgICAgICB2YXIgZWxNYXRyaXggPSBtYXRyaXgodGhpcy5lbCksXG4gICAgICAgICAgICBzY2FsZVggPSBlbE1hdHJpeCAmJiBlbE1hdHJpeC5hLFxuICAgICAgICAgICAgc2NhbGVZID0gZWxNYXRyaXggJiYgZWxNYXRyaXguZCxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVggPSAoY3VycmVudFJlY3QubGVmdCAtIHRvUmVjdC5sZWZ0KSAvIChzY2FsZVggfHwgMSksXG4gICAgICAgICAgICB0cmFuc2xhdGVZID0gKGN1cnJlbnRSZWN0LnRvcCAtIHRvUmVjdC50b3ApIC8gKHNjYWxlWSB8fCAxKTtcbiAgICAgICAgdGFyZ2V0LmFuaW1hdGluZ1ggPSAhIXRyYW5zbGF0ZVg7XG4gICAgICAgIHRhcmdldC5hbmltYXRpbmdZID0gISF0cmFuc2xhdGVZO1xuICAgICAgICBjc3ModGFyZ2V0LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKCcgKyB0cmFuc2xhdGVYICsgJ3B4LCcgKyB0cmFuc2xhdGVZICsgJ3B4LDApJyk7XG4gICAgICAgIHJlcGFpbnQodGFyZ2V0KTsgLy8gcmVwYWludFxuXG4gICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJ3RyYW5zZm9ybSAnICsgZHVyYXRpb24gKyAnbXMnICsgKHRoaXMub3B0aW9ucy5lYXNpbmcgPyAnICcgKyB0aGlzLm9wdGlvbnMuZWFzaW5nIDogJycpKTtcbiAgICAgICAgY3NzKHRhcmdldCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgwLDAsMCknKTtcbiAgICAgICAgdHlwZW9mIHRhcmdldC5hbmltYXRlZCA9PT0gJ251bWJlcicgJiYgY2xlYXJUaW1lb3V0KHRhcmdldC5hbmltYXRlZCk7XG4gICAgICAgIHRhcmdldC5hbmltYXRlZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJycpO1xuICAgICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2Zvcm0nLCAnJyk7XG4gICAgICAgICAgdGFyZ2V0LmFuaW1hdGVkID0gZmFsc2U7XG4gICAgICAgICAgdGFyZ2V0LmFuaW1hdGluZ1ggPSBmYWxzZTtcbiAgICAgICAgICB0YXJnZXQuYW5pbWF0aW5nWSA9IGZhbHNlO1xuICAgICAgICB9LCBkdXJhdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiByZXBhaW50KHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0Lm9mZnNldFdpZHRoO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVSZWFsVGltZShhbmltYXRpbmdSZWN0LCBmcm9tUmVjdCwgdG9SZWN0LCBvcHRpb25zKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coZnJvbVJlY3QudG9wIC0gYW5pbWF0aW5nUmVjdC50b3AsIDIpICsgTWF0aC5wb3coZnJvbVJlY3QubGVmdCAtIGFuaW1hdGluZ1JlY3QubGVmdCwgMikpIC8gTWF0aC5zcXJ0KE1hdGgucG93KGZyb21SZWN0LnRvcCAtIHRvUmVjdC50b3AsIDIpICsgTWF0aC5wb3coZnJvbVJlY3QubGVmdCAtIHRvUmVjdC5sZWZ0LCAyKSkgKiBvcHRpb25zLmFuaW1hdGlvbjtcbn1cblxudmFyIHBsdWdpbnMgPSBbXTtcbnZhciBkZWZhdWx0cyA9IHtcbiAgaW5pdGlhbGl6ZUJ5RGVmYXVsdDogdHJ1ZVxufTtcbnZhciBQbHVnaW5NYW5hZ2VyID0ge1xuICBtb3VudDogZnVuY3Rpb24gbW91bnQocGx1Z2luKSB7XG4gICAgLy8gU2V0IGRlZmF1bHQgc3RhdGljIHByb3BlcnRpZXNcbiAgICBmb3IgKHZhciBvcHRpb24gaW4gZGVmYXVsdHMpIHtcbiAgICAgIGlmIChkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShvcHRpb24pICYmICEob3B0aW9uIGluIHBsdWdpbikpIHtcbiAgICAgICAgcGx1Z2luW29wdGlvbl0gPSBkZWZhdWx0c1tvcHRpb25dO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBsdWdpbnMucHVzaChwbHVnaW4pO1xuICB9LFxuICBwbHVnaW5FdmVudDogZnVuY3Rpb24gcGx1Z2luRXZlbnQoZXZlbnROYW1lLCBzb3J0YWJsZSwgZXZ0KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuZXZlbnRDYW5jZWxlZCA9IGZhbHNlO1xuXG4gICAgZXZ0LmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLmV2ZW50Q2FuY2VsZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICB2YXIgZXZlbnROYW1lR2xvYmFsID0gZXZlbnROYW1lICsgJ0dsb2JhbCc7XG4gICAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAgIGlmICghc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdKSByZXR1cm47IC8vIEZpcmUgZ2xvYmFsIGV2ZW50cyBpZiBpdCBleGlzdHMgaW4gdGhpcyBzb3J0YWJsZVxuXG4gICAgICBpZiAoc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdW2V2ZW50TmFtZUdsb2JhbF0pIHtcbiAgICAgICAgc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdW2V2ZW50TmFtZUdsb2JhbF0oX29iamVjdFNwcmVhZCh7XG4gICAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlXG4gICAgICAgIH0sIGV2dCkpO1xuICAgICAgfSAvLyBPbmx5IGZpcmUgcGx1Z2luIGV2ZW50IGlmIHBsdWdpbiBpcyBlbmFibGVkIGluIHRoaXMgc29ydGFibGUsXG4gICAgICAvLyBhbmQgcGx1Z2luIGhhcyBldmVudCBkZWZpbmVkXG5cblxuICAgICAgaWYgKHNvcnRhYmxlLm9wdGlvbnNbcGx1Z2luLnBsdWdpbk5hbWVdICYmIHNvcnRhYmxlW3BsdWdpbi5wbHVnaW5OYW1lXVtldmVudE5hbWVdKSB7XG4gICAgICAgIHNvcnRhYmxlW3BsdWdpbi5wbHVnaW5OYW1lXVtldmVudE5hbWVdKF9vYmplY3RTcHJlYWQoe1xuICAgICAgICAgIHNvcnRhYmxlOiBzb3J0YWJsZVxuICAgICAgICB9LCBldnQpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgaW5pdGlhbGl6ZVBsdWdpbnM6IGZ1bmN0aW9uIGluaXRpYWxpemVQbHVnaW5zKHNvcnRhYmxlLCBlbCwgZGVmYXVsdHMsIG9wdGlvbnMpIHtcbiAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgdmFyIHBsdWdpbk5hbWUgPSBwbHVnaW4ucGx1Z2luTmFtZTtcbiAgICAgIGlmICghc29ydGFibGUub3B0aW9uc1twbHVnaW5OYW1lXSAmJiAhcGx1Z2luLmluaXRpYWxpemVCeURlZmF1bHQpIHJldHVybjtcbiAgICAgIHZhciBpbml0aWFsaXplZCA9IG5ldyBwbHVnaW4oc29ydGFibGUsIGVsLCBzb3J0YWJsZS5vcHRpb25zKTtcbiAgICAgIGluaXRpYWxpemVkLnNvcnRhYmxlID0gc29ydGFibGU7XG4gICAgICBpbml0aWFsaXplZC5vcHRpb25zID0gc29ydGFibGUub3B0aW9ucztcbiAgICAgIHNvcnRhYmxlW3BsdWdpbk5hbWVdID0gaW5pdGlhbGl6ZWQ7IC8vIEFkZCBkZWZhdWx0IG9wdGlvbnMgZnJvbSBwbHVnaW5cblxuICAgICAgX2V4dGVuZHMoZGVmYXVsdHMsIGluaXRpYWxpemVkLmRlZmF1bHRzKTtcbiAgICB9KTtcblxuICAgIGZvciAodmFyIG9wdGlvbiBpbiBzb3J0YWJsZS5vcHRpb25zKSB7XG4gICAgICBpZiAoIXNvcnRhYmxlLm9wdGlvbnMuaGFzT3duUHJvcGVydHkob3B0aW9uKSkgY29udGludWU7XG4gICAgICB2YXIgbW9kaWZpZWQgPSB0aGlzLm1vZGlmeU9wdGlvbihzb3J0YWJsZSwgb3B0aW9uLCBzb3J0YWJsZS5vcHRpb25zW29wdGlvbl0pO1xuXG4gICAgICBpZiAodHlwZW9mIG1vZGlmaWVkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzb3J0YWJsZS5vcHRpb25zW29wdGlvbl0gPSBtb2RpZmllZDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGdldEV2ZW50UHJvcGVydGllczogZnVuY3Rpb24gZ2V0RXZlbnRQcm9wZXJ0aWVzKG5hbWUsIHNvcnRhYmxlKSB7XG4gICAgdmFyIGV2ZW50UHJvcGVydGllcyA9IHt9O1xuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgICBpZiAodHlwZW9mIHBsdWdpbi5ldmVudFByb3BlcnRpZXMgIT09ICdmdW5jdGlvbicpIHJldHVybjtcblxuICAgICAgX2V4dGVuZHMoZXZlbnRQcm9wZXJ0aWVzLCBwbHVnaW4uZXZlbnRQcm9wZXJ0aWVzLmNhbGwoc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdLCBuYW1lKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGV2ZW50UHJvcGVydGllcztcbiAgfSxcbiAgbW9kaWZ5T3B0aW9uOiBmdW5jdGlvbiBtb2RpZnlPcHRpb24oc29ydGFibGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIG1vZGlmaWVkVmFsdWU7XG4gICAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAgIC8vIFBsdWdpbiBtdXN0IGV4aXN0IG9uIHRoZSBTb3J0YWJsZVxuICAgICAgaWYgKCFzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV0pIHJldHVybjsgLy8gSWYgc3RhdGljIG9wdGlvbiBsaXN0ZW5lciBleGlzdHMgZm9yIHRoaXMgb3B0aW9uLCBjYWxsIGluIHRoZSBjb250ZXh0IG9mIHRoZSBTb3J0YWJsZSdzIGluc3RhbmNlIG9mIHRoaXMgcGx1Z2luXG5cbiAgICAgIGlmIChwbHVnaW4ub3B0aW9uTGlzdGVuZXJzICYmIHR5cGVvZiBwbHVnaW4ub3B0aW9uTGlzdGVuZXJzW25hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1vZGlmaWVkVmFsdWUgPSBwbHVnaW4ub3B0aW9uTGlzdGVuZXJzW25hbWVdLmNhbGwoc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1vZGlmaWVkVmFsdWU7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoX3JlZikge1xuICB2YXIgc29ydGFibGUgPSBfcmVmLnNvcnRhYmxlLFxuICAgICAgcm9vdEVsID0gX3JlZi5yb290RWwsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lLFxuICAgICAgdGFyZ2V0RWwgPSBfcmVmLnRhcmdldEVsLFxuICAgICAgY2xvbmVFbCA9IF9yZWYuY2xvbmVFbCxcbiAgICAgIHRvRWwgPSBfcmVmLnRvRWwsXG4gICAgICBmcm9tRWwgPSBfcmVmLmZyb21FbCxcbiAgICAgIG9sZEluZGV4ID0gX3JlZi5vbGRJbmRleCxcbiAgICAgIG5ld0luZGV4ID0gX3JlZi5uZXdJbmRleCxcbiAgICAgIG9sZERyYWdnYWJsZUluZGV4ID0gX3JlZi5vbGREcmFnZ2FibGVJbmRleCxcbiAgICAgIG5ld0RyYWdnYWJsZUluZGV4ID0gX3JlZi5uZXdEcmFnZ2FibGVJbmRleCxcbiAgICAgIG9yaWdpbmFsRXZlbnQgPSBfcmVmLm9yaWdpbmFsRXZlbnQsXG4gICAgICBwdXRTb3J0YWJsZSA9IF9yZWYucHV0U29ydGFibGUsXG4gICAgICBleHRyYUV2ZW50UHJvcGVydGllcyA9IF9yZWYuZXh0cmFFdmVudFByb3BlcnRpZXM7XG4gIHNvcnRhYmxlID0gc29ydGFibGUgfHwgcm9vdEVsICYmIHJvb3RFbFtleHBhbmRvXTtcbiAgaWYgKCFzb3J0YWJsZSkgcmV0dXJuO1xuICB2YXIgZXZ0LFxuICAgICAgb3B0aW9ucyA9IHNvcnRhYmxlLm9wdGlvbnMsXG4gICAgICBvbk5hbWUgPSAnb24nICsgbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyKDEpOyAvLyBTdXBwb3J0IGZvciBuZXcgQ3VzdG9tRXZlbnQgZmVhdHVyZVxuXG4gIGlmICh3aW5kb3cuQ3VzdG9tRXZlbnQgJiYgIUlFMTFPckxlc3MgJiYgIUVkZ2UpIHtcbiAgICBldnQgPSBuZXcgQ3VzdG9tRXZlbnQobmFtZSwge1xuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBldnQuaW5pdEV2ZW50KG5hbWUsIHRydWUsIHRydWUpO1xuICB9XG5cbiAgZXZ0LnRvID0gdG9FbCB8fCByb290RWw7XG4gIGV2dC5mcm9tID0gZnJvbUVsIHx8IHJvb3RFbDtcbiAgZXZ0Lml0ZW0gPSB0YXJnZXRFbCB8fCByb290RWw7XG4gIGV2dC5jbG9uZSA9IGNsb25lRWw7XG4gIGV2dC5vbGRJbmRleCA9IG9sZEluZGV4O1xuICBldnQubmV3SW5kZXggPSBuZXdJbmRleDtcbiAgZXZ0Lm9sZERyYWdnYWJsZUluZGV4ID0gb2xkRHJhZ2dhYmxlSW5kZXg7XG4gIGV2dC5uZXdEcmFnZ2FibGVJbmRleCA9IG5ld0RyYWdnYWJsZUluZGV4O1xuICBldnQub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG4gIGV2dC5wdWxsTW9kZSA9IHB1dFNvcnRhYmxlID8gcHV0U29ydGFibGUubGFzdFB1dE1vZGUgOiB1bmRlZmluZWQ7XG5cbiAgdmFyIGFsbEV2ZW50UHJvcGVydGllcyA9IF9vYmplY3RTcHJlYWQoe30sIGV4dHJhRXZlbnRQcm9wZXJ0aWVzLCBQbHVnaW5NYW5hZ2VyLmdldEV2ZW50UHJvcGVydGllcyhuYW1lLCBzb3J0YWJsZSkpO1xuXG4gIGZvciAodmFyIG9wdGlvbiBpbiBhbGxFdmVudFByb3BlcnRpZXMpIHtcbiAgICBldnRbb3B0aW9uXSA9IGFsbEV2ZW50UHJvcGVydGllc1tvcHRpb25dO1xuICB9XG5cbiAgaWYgKHJvb3RFbCkge1xuICAgIHJvb3RFbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIH1cblxuICBpZiAob3B0aW9uc1tvbk5hbWVdKSB7XG4gICAgb3B0aW9uc1tvbk5hbWVdLmNhbGwoc29ydGFibGUsIGV2dCk7XG4gIH1cbn1cblxudmFyIHBsdWdpbkV2ZW50ID0gZnVuY3Rpb24gcGx1Z2luRXZlbnQoZXZlbnROYW1lLCBzb3J0YWJsZSkge1xuICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge30sXG4gICAgICBvcmlnaW5hbEV2ZW50ID0gX3JlZi5ldnQsXG4gICAgICBkYXRhID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIFtcImV2dFwiXSk7XG5cbiAgUGx1Z2luTWFuYWdlci5wbHVnaW5FdmVudC5iaW5kKFNvcnRhYmxlKShldmVudE5hbWUsIHNvcnRhYmxlLCBfb2JqZWN0U3ByZWFkKHtcbiAgICBkcmFnRWw6IGRyYWdFbCxcbiAgICBwYXJlbnRFbDogcGFyZW50RWwsXG4gICAgZ2hvc3RFbDogZ2hvc3RFbCxcbiAgICByb290RWw6IHJvb3RFbCxcbiAgICBuZXh0RWw6IG5leHRFbCxcbiAgICBsYXN0RG93bkVsOiBsYXN0RG93bkVsLFxuICAgIGNsb25lRWw6IGNsb25lRWwsXG4gICAgY2xvbmVIaWRkZW46IGNsb25lSGlkZGVuLFxuICAgIGRyYWdTdGFydGVkOiBtb3ZlZCxcbiAgICBwdXRTb3J0YWJsZTogcHV0U29ydGFibGUsXG4gICAgYWN0aXZlU29ydGFibGU6IFNvcnRhYmxlLmFjdGl2ZSxcbiAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50LFxuICAgIG9sZEluZGV4OiBvbGRJbmRleCxcbiAgICBvbGREcmFnZ2FibGVJbmRleDogb2xkRHJhZ2dhYmxlSW5kZXgsXG4gICAgbmV3SW5kZXg6IG5ld0luZGV4LFxuICAgIG5ld0RyYWdnYWJsZUluZGV4OiBuZXdEcmFnZ2FibGVJbmRleCxcbiAgICBoaWRlR2hvc3RGb3JUYXJnZXQ6IF9oaWRlR2hvc3RGb3JUYXJnZXQsXG4gICAgdW5oaWRlR2hvc3RGb3JUYXJnZXQ6IF91bmhpZGVHaG9zdEZvclRhcmdldCxcbiAgICBjbG9uZU5vd0hpZGRlbjogZnVuY3Rpb24gY2xvbmVOb3dIaWRkZW4oKSB7XG4gICAgICBjbG9uZUhpZGRlbiA9IHRydWU7XG4gICAgfSxcbiAgICBjbG9uZU5vd1Nob3duOiBmdW5jdGlvbiBjbG9uZU5vd1Nob3duKCkge1xuICAgICAgY2xvbmVIaWRkZW4gPSBmYWxzZTtcbiAgICB9LFxuICAgIGRpc3BhdGNoU29ydGFibGVFdmVudDogZnVuY3Rpb24gZGlzcGF0Y2hTb3J0YWJsZUV2ZW50KG5hbWUpIHtcbiAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlLFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIGRhdGEpKTtcbn07XG5cbmZ1bmN0aW9uIF9kaXNwYXRjaEV2ZW50KGluZm8pIHtcbiAgZGlzcGF0Y2hFdmVudChfb2JqZWN0U3ByZWFkKHtcbiAgICBwdXRTb3J0YWJsZTogcHV0U29ydGFibGUsXG4gICAgY2xvbmVFbDogY2xvbmVFbCxcbiAgICB0YXJnZXRFbDogZHJhZ0VsLFxuICAgIHJvb3RFbDogcm9vdEVsLFxuICAgIG9sZEluZGV4OiBvbGRJbmRleCxcbiAgICBvbGREcmFnZ2FibGVJbmRleDogb2xkRHJhZ2dhYmxlSW5kZXgsXG4gICAgbmV3SW5kZXg6IG5ld0luZGV4LFxuICAgIG5ld0RyYWdnYWJsZUluZGV4OiBuZXdEcmFnZ2FibGVJbmRleFxuICB9LCBpbmZvKSk7XG59XG5cbnZhciBkcmFnRWwsXG4gICAgcGFyZW50RWwsXG4gICAgZ2hvc3RFbCxcbiAgICByb290RWwsXG4gICAgbmV4dEVsLFxuICAgIGxhc3REb3duRWwsXG4gICAgY2xvbmVFbCxcbiAgICBjbG9uZUhpZGRlbixcbiAgICBvbGRJbmRleCxcbiAgICBuZXdJbmRleCxcbiAgICBvbGREcmFnZ2FibGVJbmRleCxcbiAgICBuZXdEcmFnZ2FibGVJbmRleCxcbiAgICBhY3RpdmVHcm91cCxcbiAgICBwdXRTb3J0YWJsZSxcbiAgICBhd2FpdGluZ0RyYWdTdGFydGVkID0gZmFsc2UsXG4gICAgaWdub3JlTmV4dENsaWNrID0gZmFsc2UsXG4gICAgc29ydGFibGVzID0gW10sXG4gICAgdGFwRXZ0LFxuICAgIHRvdWNoRXZ0LFxuICAgIGxhc3REeCxcbiAgICBsYXN0RHksXG4gICAgdGFwRGlzdGFuY2VMZWZ0LFxuICAgIHRhcERpc3RhbmNlVG9wLFxuICAgIG1vdmVkLFxuICAgIGxhc3RUYXJnZXQsXG4gICAgbGFzdERpcmVjdGlvbixcbiAgICBwYXN0Rmlyc3RJbnZlcnRUaHJlc2ggPSBmYWxzZSxcbiAgICBpc0NpcmN1bXN0YW50aWFsSW52ZXJ0ID0gZmFsc2UsXG4gICAgdGFyZ2V0TW92ZURpc3RhbmNlLFxuICAgIC8vIEZvciBwb3NpdGlvbmluZyBnaG9zdCBhYnNvbHV0ZWx5XG5naG9zdFJlbGF0aXZlUGFyZW50LFxuICAgIGdob3N0UmVsYXRpdmVQYXJlbnRJbml0aWFsU2Nyb2xsID0gW10sXG4gICAgLy8gKGxlZnQsIHRvcClcbl9zaWxlbnQgPSBmYWxzZSxcbiAgICBzYXZlZElucHV0Q2hlY2tlZCA9IFtdO1xuLyoqIEBjb25zdCAqL1xuXG52YXIgZG9jdW1lbnRFeGlzdHMgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnLFxuICAgIFBvc2l0aW9uR2hvc3RBYnNvbHV0ZWx5ID0gSU9TLFxuICAgIENTU0Zsb2F0UHJvcGVydHkgPSBFZGdlIHx8IElFMTFPckxlc3MgPyAnY3NzRmxvYXQnIDogJ2Zsb2F0JyxcbiAgICAvLyBUaGlzIHdpbGwgbm90IHBhc3MgZm9yIElFOSwgYmVjYXVzZSBJRTkgRG5EIG9ubHkgd29ya3Mgb24gYW5jaG9yc1xuc3VwcG9ydERyYWdnYWJsZSA9IGRvY3VtZW50RXhpc3RzICYmICFDaHJvbWVGb3JBbmRyb2lkICYmICFJT1MgJiYgJ2RyYWdnYWJsZScgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgc3VwcG9ydENzc1BvaW50ZXJFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghZG9jdW1lbnRFeGlzdHMpIHJldHVybjsgLy8gZmFsc2Ugd2hlbiA8PSBJRTExXG5cbiAgaWYgKElFMTFPckxlc3MpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd4Jyk7XG4gIGVsLnN0eWxlLmNzc1RleHQgPSAncG9pbnRlci1ldmVudHM6YXV0byc7XG4gIHJldHVybiBlbC5zdHlsZS5wb2ludGVyRXZlbnRzID09PSAnYXV0byc7XG59KCksXG4gICAgX2RldGVjdERpcmVjdGlvbiA9IGZ1bmN0aW9uIF9kZXRlY3REaXJlY3Rpb24oZWwsIG9wdGlvbnMpIHtcbiAgdmFyIGVsQ1NTID0gY3NzKGVsKSxcbiAgICAgIGVsV2lkdGggPSBwYXJzZUludChlbENTUy53aWR0aCkgLSBwYXJzZUludChlbENTUy5wYWRkaW5nTGVmdCkgLSBwYXJzZUludChlbENTUy5wYWRkaW5nUmlnaHQpIC0gcGFyc2VJbnQoZWxDU1MuYm9yZGVyTGVmdFdpZHRoKSAtIHBhcnNlSW50KGVsQ1NTLmJvcmRlclJpZ2h0V2lkdGgpLFxuICAgICAgY2hpbGQxID0gZ2V0Q2hpbGQoZWwsIDAsIG9wdGlvbnMpLFxuICAgICAgY2hpbGQyID0gZ2V0Q2hpbGQoZWwsIDEsIG9wdGlvbnMpLFxuICAgICAgZmlyc3RDaGlsZENTUyA9IGNoaWxkMSAmJiBjc3MoY2hpbGQxKSxcbiAgICAgIHNlY29uZENoaWxkQ1NTID0gY2hpbGQyICYmIGNzcyhjaGlsZDIpLFxuICAgICAgZmlyc3RDaGlsZFdpZHRoID0gZmlyc3RDaGlsZENTUyAmJiBwYXJzZUludChmaXJzdENoaWxkQ1NTLm1hcmdpbkxlZnQpICsgcGFyc2VJbnQoZmlyc3RDaGlsZENTUy5tYXJnaW5SaWdodCkgKyBnZXRSZWN0KGNoaWxkMSkud2lkdGgsXG4gICAgICBzZWNvbmRDaGlsZFdpZHRoID0gc2Vjb25kQ2hpbGRDU1MgJiYgcGFyc2VJbnQoc2Vjb25kQ2hpbGRDU1MubWFyZ2luTGVmdCkgKyBwYXJzZUludChzZWNvbmRDaGlsZENTUy5tYXJnaW5SaWdodCkgKyBnZXRSZWN0KGNoaWxkMikud2lkdGg7XG5cbiAgaWYgKGVsQ1NTLmRpc3BsYXkgPT09ICdmbGV4Jykge1xuICAgIHJldHVybiBlbENTUy5mbGV4RGlyZWN0aW9uID09PSAnY29sdW1uJyB8fCBlbENTUy5mbGV4RGlyZWN0aW9uID09PSAnY29sdW1uLXJldmVyc2UnID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgfVxuXG4gIGlmIChlbENTUy5kaXNwbGF5ID09PSAnZ3JpZCcpIHtcbiAgICByZXR1cm4gZWxDU1MuZ3JpZFRlbXBsYXRlQ29sdW1ucy5zcGxpdCgnICcpLmxlbmd0aCA8PSAxID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgfVxuXG4gIGlmIChjaGlsZDEgJiYgZmlyc3RDaGlsZENTU1tcImZsb2F0XCJdICYmIGZpcnN0Q2hpbGRDU1NbXCJmbG9hdFwiXSAhPT0gJ25vbmUnKSB7XG4gICAgdmFyIHRvdWNoaW5nU2lkZUNoaWxkMiA9IGZpcnN0Q2hpbGRDU1NbXCJmbG9hdFwiXSA9PT0gJ2xlZnQnID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICByZXR1cm4gY2hpbGQyICYmIChzZWNvbmRDaGlsZENTUy5jbGVhciA9PT0gJ2JvdGgnIHx8IHNlY29uZENoaWxkQ1NTLmNsZWFyID09PSB0b3VjaGluZ1NpZGVDaGlsZDIpID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgfVxuXG4gIHJldHVybiBjaGlsZDEgJiYgKGZpcnN0Q2hpbGRDU1MuZGlzcGxheSA9PT0gJ2Jsb2NrJyB8fCBmaXJzdENoaWxkQ1NTLmRpc3BsYXkgPT09ICdmbGV4JyB8fCBmaXJzdENoaWxkQ1NTLmRpc3BsYXkgPT09ICd0YWJsZScgfHwgZmlyc3RDaGlsZENTUy5kaXNwbGF5ID09PSAnZ3JpZCcgfHwgZmlyc3RDaGlsZFdpZHRoID49IGVsV2lkdGggJiYgZWxDU1NbQ1NTRmxvYXRQcm9wZXJ0eV0gPT09ICdub25lJyB8fCBjaGlsZDIgJiYgZWxDU1NbQ1NTRmxvYXRQcm9wZXJ0eV0gPT09ICdub25lJyAmJiBmaXJzdENoaWxkV2lkdGggKyBzZWNvbmRDaGlsZFdpZHRoID4gZWxXaWR0aCkgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xufSxcbiAgICBfZHJhZ0VsSW5Sb3dDb2x1bW4gPSBmdW5jdGlvbiBfZHJhZ0VsSW5Sb3dDb2x1bW4oZHJhZ1JlY3QsIHRhcmdldFJlY3QsIHZlcnRpY2FsKSB7XG4gIHZhciBkcmFnRWxTMU9wcCA9IHZlcnRpY2FsID8gZHJhZ1JlY3QubGVmdCA6IGRyYWdSZWN0LnRvcCxcbiAgICAgIGRyYWdFbFMyT3BwID0gdmVydGljYWwgPyBkcmFnUmVjdC5yaWdodCA6IGRyYWdSZWN0LmJvdHRvbSxcbiAgICAgIGRyYWdFbE9wcExlbmd0aCA9IHZlcnRpY2FsID8gZHJhZ1JlY3Qud2lkdGggOiBkcmFnUmVjdC5oZWlnaHQsXG4gICAgICB0YXJnZXRTMU9wcCA9IHZlcnRpY2FsID8gdGFyZ2V0UmVjdC5sZWZ0IDogdGFyZ2V0UmVjdC50b3AsXG4gICAgICB0YXJnZXRTMk9wcCA9IHZlcnRpY2FsID8gdGFyZ2V0UmVjdC5yaWdodCA6IHRhcmdldFJlY3QuYm90dG9tLFxuICAgICAgdGFyZ2V0T3BwTGVuZ3RoID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LndpZHRoIDogdGFyZ2V0UmVjdC5oZWlnaHQ7XG4gIHJldHVybiBkcmFnRWxTMU9wcCA9PT0gdGFyZ2V0UzFPcHAgfHwgZHJhZ0VsUzJPcHAgPT09IHRhcmdldFMyT3BwIHx8IGRyYWdFbFMxT3BwICsgZHJhZ0VsT3BwTGVuZ3RoIC8gMiA9PT0gdGFyZ2V0UzFPcHAgKyB0YXJnZXRPcHBMZW5ndGggLyAyO1xufSxcblxuLyoqXG4gKiBEZXRlY3RzIGZpcnN0IG5lYXJlc3QgZW1wdHkgc29ydGFibGUgdG8gWCBhbmQgWSBwb3NpdGlvbiB1c2luZyBlbXB0eUluc2VydFRocmVzaG9sZC5cbiAqIEBwYXJhbSAge051bWJlcn0geCAgICAgIFggcG9zaXRpb25cbiAqIEBwYXJhbSAge051bWJlcn0geSAgICAgIFkgcG9zaXRpb25cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAgIEVsZW1lbnQgb2YgdGhlIGZpcnN0IGZvdW5kIG5lYXJlc3QgU29ydGFibGVcbiAqL1xuX2RldGVjdE5lYXJlc3RFbXB0eVNvcnRhYmxlID0gZnVuY3Rpb24gX2RldGVjdE5lYXJlc3RFbXB0eVNvcnRhYmxlKHgsIHkpIHtcbiAgdmFyIHJldDtcbiAgc29ydGFibGVzLnNvbWUoZnVuY3Rpb24gKHNvcnRhYmxlKSB7XG4gICAgaWYgKGxhc3RDaGlsZChzb3J0YWJsZSkpIHJldHVybjtcbiAgICB2YXIgcmVjdCA9IGdldFJlY3Qoc29ydGFibGUpLFxuICAgICAgICB0aHJlc2hvbGQgPSBzb3J0YWJsZVtleHBhbmRvXS5vcHRpb25zLmVtcHR5SW5zZXJ0VGhyZXNob2xkLFxuICAgICAgICBpbnNpZGVIb3Jpem9udGFsbHkgPSB4ID49IHJlY3QubGVmdCAtIHRocmVzaG9sZCAmJiB4IDw9IHJlY3QucmlnaHQgKyB0aHJlc2hvbGQsXG4gICAgICAgIGluc2lkZVZlcnRpY2FsbHkgPSB5ID49IHJlY3QudG9wIC0gdGhyZXNob2xkICYmIHkgPD0gcmVjdC5ib3R0b20gKyB0aHJlc2hvbGQ7XG5cbiAgICBpZiAodGhyZXNob2xkICYmIGluc2lkZUhvcml6b250YWxseSAmJiBpbnNpZGVWZXJ0aWNhbGx5KSB7XG4gICAgICByZXR1cm4gcmV0ID0gc29ydGFibGU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJldDtcbn0sXG4gICAgX3ByZXBhcmVHcm91cCA9IGZ1bmN0aW9uIF9wcmVwYXJlR3JvdXAob3B0aW9ucykge1xuICBmdW5jdGlvbiB0b0ZuKHZhbHVlLCBwdWxsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0bywgZnJvbSwgZHJhZ0VsLCBldnQpIHtcbiAgICAgIHZhciBzYW1lR3JvdXAgPSB0by5vcHRpb25zLmdyb3VwLm5hbWUgJiYgZnJvbS5vcHRpb25zLmdyb3VwLm5hbWUgJiYgdG8ub3B0aW9ucy5ncm91cC5uYW1lID09PSBmcm9tLm9wdGlvbnMuZ3JvdXAubmFtZTtcblxuICAgICAgaWYgKHZhbHVlID09IG51bGwgJiYgKHB1bGwgfHwgc2FtZUdyb3VwKSkge1xuICAgICAgICAvLyBEZWZhdWx0IHB1bGwgdmFsdWVcbiAgICAgICAgLy8gRGVmYXVsdCBwdWxsIGFuZCBwdXQgdmFsdWUgaWYgc2FtZSBncm91cFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChwdWxsICYmIHZhbHVlID09PSAnY2xvbmUnKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB0b0ZuKHZhbHVlKHRvLCBmcm9tLCBkcmFnRWwsIGV2dCksIHB1bGwpKHRvLCBmcm9tLCBkcmFnRWwsIGV2dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb3RoZXJHcm91cCA9IChwdWxsID8gdG8gOiBmcm9tKS5vcHRpb25zLmdyb3VwLm5hbWU7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlID09PSBvdGhlckdyb3VwIHx8IHZhbHVlLmpvaW4gJiYgdmFsdWUuaW5kZXhPZihvdGhlckdyb3VwKSA+IC0xO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB2YXIgZ3JvdXAgPSB7fTtcbiAgdmFyIG9yaWdpbmFsR3JvdXAgPSBvcHRpb25zLmdyb3VwO1xuXG4gIGlmICghb3JpZ2luYWxHcm91cCB8fCBfdHlwZW9mKG9yaWdpbmFsR3JvdXApICE9ICdvYmplY3QnKSB7XG4gICAgb3JpZ2luYWxHcm91cCA9IHtcbiAgICAgIG5hbWU6IG9yaWdpbmFsR3JvdXBcbiAgICB9O1xuICB9XG5cbiAgZ3JvdXAubmFtZSA9IG9yaWdpbmFsR3JvdXAubmFtZTtcbiAgZ3JvdXAuY2hlY2tQdWxsID0gdG9GbihvcmlnaW5hbEdyb3VwLnB1bGwsIHRydWUpO1xuICBncm91cC5jaGVja1B1dCA9IHRvRm4ob3JpZ2luYWxHcm91cC5wdXQpO1xuICBncm91cC5yZXZlcnRDbG9uZSA9IG9yaWdpbmFsR3JvdXAucmV2ZXJ0Q2xvbmU7XG4gIG9wdGlvbnMuZ3JvdXAgPSBncm91cDtcbn0sXG4gICAgX2hpZGVHaG9zdEZvclRhcmdldCA9IGZ1bmN0aW9uIF9oaWRlR2hvc3RGb3JUYXJnZXQoKSB7XG4gIGlmICghc3VwcG9ydENzc1BvaW50ZXJFdmVudHMgJiYgZ2hvc3RFbCkge1xuICAgIGNzcyhnaG9zdEVsLCAnZGlzcGxheScsICdub25lJyk7XG4gIH1cbn0sXG4gICAgX3VuaGlkZUdob3N0Rm9yVGFyZ2V0ID0gZnVuY3Rpb24gX3VuaGlkZUdob3N0Rm9yVGFyZ2V0KCkge1xuICBpZiAoIXN1cHBvcnRDc3NQb2ludGVyRXZlbnRzICYmIGdob3N0RWwpIHtcbiAgICBjc3MoZ2hvc3RFbCwgJ2Rpc3BsYXknLCAnJyk7XG4gIH1cbn07IC8vICMxMTg0IGZpeCAtIFByZXZlbnQgY2xpY2sgZXZlbnQgb24gZmFsbGJhY2sgaWYgZHJhZ2dlZCBidXQgaXRlbSBub3QgY2hhbmdlZCBwb3NpdGlvblxuXG5cbmlmIChkb2N1bWVudEV4aXN0cykge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoaWdub3JlTmV4dENsaWNrKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24gJiYgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAmJiBldnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICBpZ25vcmVOZXh0Q2xpY2sgPSBmYWxzZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sIHRydWUpO1xufVxuXG52YXIgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQgPSBmdW5jdGlvbiBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudChldnQpIHtcbiAgaWYgKGRyYWdFbCkge1xuICAgIGV2dCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQ7XG5cbiAgICB2YXIgbmVhcmVzdCA9IF9kZXRlY3ROZWFyZXN0RW1wdHlTb3J0YWJsZShldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpO1xuXG4gICAgaWYgKG5lYXJlc3QpIHtcbiAgICAgIC8vIENyZWF0ZSBpbWl0YXRpb24gZXZlbnRcbiAgICAgIHZhciBldmVudCA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBpIGluIGV2dCkge1xuICAgICAgICBpZiAoZXZ0Lmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgZXZlbnRbaV0gPSBldnRbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZXZlbnQudGFyZ2V0ID0gZXZlbnQucm9vdEVsID0gbmVhcmVzdDtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID0gdm9pZCAwO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uID0gdm9pZCAwO1xuXG4gICAgICBuZWFyZXN0W2V4cGFuZG9dLl9vbkRyYWdPdmVyKGV2ZW50KTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBfY2hlY2tPdXRzaWRlVGFyZ2V0RWwgPSBmdW5jdGlvbiBfY2hlY2tPdXRzaWRlVGFyZ2V0RWwoZXZ0KSB7XG4gIGlmIChkcmFnRWwpIHtcbiAgICBkcmFnRWwucGFyZW50Tm9kZVtleHBhbmRvXS5faXNPdXRzaWRlVGhpc0VsKGV2dC50YXJnZXQpO1xuICB9XG59O1xuLyoqXG4gKiBAY2xhc3MgIFNvcnRhYmxlXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gIGVsXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgIFtvcHRpb25zXVxuICovXG5cblxuZnVuY3Rpb24gU29ydGFibGUoZWwsIG9wdGlvbnMpIHtcbiAgaWYgKCEoZWwgJiYgZWwubm9kZVR5cGUgJiYgZWwubm9kZVR5cGUgPT09IDEpKSB7XG4gICAgdGhyb3cgXCJTb3J0YWJsZTogYGVsYCBtdXN0IGJlIGFuIEhUTUxFbGVtZW50LCBub3QgXCIuY29uY2F0KHt9LnRvU3RyaW5nLmNhbGwoZWwpKTtcbiAgfVxuXG4gIHRoaXMuZWwgPSBlbDsgLy8gcm9vdCBlbGVtZW50XG5cbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyA9IF9leHRlbmRzKHt9LCBvcHRpb25zKTsgLy8gRXhwb3J0IGluc3RhbmNlXG5cbiAgZWxbZXhwYW5kb10gPSB0aGlzO1xuICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgZ3JvdXA6IG51bGwsXG4gICAgc29ydDogdHJ1ZSxcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgc3RvcmU6IG51bGwsXG4gICAgaGFuZGxlOiBudWxsLFxuICAgIGRyYWdnYWJsZTogL15bdW9dbCQvaS50ZXN0KGVsLm5vZGVOYW1lKSA/ICc+bGknIDogJz4qJyxcbiAgICBzd2FwVGhyZXNob2xkOiAxLFxuICAgIC8vIHBlcmNlbnRhZ2U7IDAgPD0geCA8PSAxXG4gICAgaW52ZXJ0U3dhcDogZmFsc2UsXG4gICAgLy8gaW52ZXJ0IGFsd2F5c1xuICAgIGludmVydGVkU3dhcFRocmVzaG9sZDogbnVsbCxcbiAgICAvLyB3aWxsIGJlIHNldCB0byBzYW1lIGFzIHN3YXBUaHJlc2hvbGQgaWYgZGVmYXVsdFxuICAgIHJlbW92ZUNsb25lT25IaWRlOiB0cnVlLFxuICAgIGRpcmVjdGlvbjogZnVuY3Rpb24gZGlyZWN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9kZXRlY3REaXJlY3Rpb24oZWwsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBnaG9zdENsYXNzOiAnc29ydGFibGUtZ2hvc3QnLFxuICAgIGNob3NlbkNsYXNzOiAnc29ydGFibGUtY2hvc2VuJyxcbiAgICBkcmFnQ2xhc3M6ICdzb3J0YWJsZS1kcmFnJyxcbiAgICBpZ25vcmU6ICdhLCBpbWcnLFxuICAgIGZpbHRlcjogbnVsbCxcbiAgICBwcmV2ZW50T25GaWx0ZXI6IHRydWUsXG4gICAgYW5pbWF0aW9uOiAwLFxuICAgIGVhc2luZzogbnVsbCxcbiAgICBzZXREYXRhOiBmdW5jdGlvbiBzZXREYXRhKGRhdGFUcmFuc2ZlciwgZHJhZ0VsKSB7XG4gICAgICBkYXRhVHJhbnNmZXIuc2V0RGF0YSgnVGV4dCcsIGRyYWdFbC50ZXh0Q29udGVudCk7XG4gICAgfSxcbiAgICBkcm9wQnViYmxlOiBmYWxzZSxcbiAgICBkcmFnb3ZlckJ1YmJsZTogZmFsc2UsXG4gICAgZGF0YUlkQXR0cjogJ2RhdGEtaWQnLFxuICAgIGRlbGF5OiAwLFxuICAgIGRlbGF5T25Ub3VjaE9ubHk6IGZhbHNlLFxuICAgIHRvdWNoU3RhcnRUaHJlc2hvbGQ6IChOdW1iZXIucGFyc2VJbnQgPyBOdW1iZXIgOiB3aW5kb3cpLnBhcnNlSW50KHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAxMCkgfHwgMSxcbiAgICBmb3JjZUZhbGxiYWNrOiBmYWxzZSxcbiAgICBmYWxsYmFja0NsYXNzOiAnc29ydGFibGUtZmFsbGJhY2snLFxuICAgIGZhbGxiYWNrT25Cb2R5OiBmYWxzZSxcbiAgICBmYWxsYmFja1RvbGVyYW5jZTogMCxcbiAgICBmYWxsYmFja09mZnNldDoge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9LFxuICAgIHN1cHBvcnRQb2ludGVyOiBTb3J0YWJsZS5zdXBwb3J0UG9pbnRlciAhPT0gZmFsc2UgJiYgJ1BvaW50ZXJFdmVudCcgaW4gd2luZG93LFxuICAgIGVtcHR5SW5zZXJ0VGhyZXNob2xkOiA1XG4gIH07XG4gIFBsdWdpbk1hbmFnZXIuaW5pdGlhbGl6ZVBsdWdpbnModGhpcywgZWwsIGRlZmF1bHRzKTsgLy8gU2V0IGRlZmF1bHQgb3B0aW9uc1xuXG4gIGZvciAodmFyIG5hbWUgaW4gZGVmYXVsdHMpIHtcbiAgICAhKG5hbWUgaW4gb3B0aW9ucykgJiYgKG9wdGlvbnNbbmFtZV0gPSBkZWZhdWx0c1tuYW1lXSk7XG4gIH1cblxuICBfcHJlcGFyZUdyb3VwKG9wdGlvbnMpOyAvLyBCaW5kIGFsbCBwcml2YXRlIG1ldGhvZHNcblxuXG4gIGZvciAodmFyIGZuIGluIHRoaXMpIHtcbiAgICBpZiAoZm4uY2hhckF0KDApID09PSAnXycgJiYgdHlwZW9mIHRoaXNbZm5dID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzW2ZuXSA9IHRoaXNbZm5dLmJpbmQodGhpcyk7XG4gICAgfVxuICB9IC8vIFNldHVwIGRyYWcgbW9kZVxuXG5cbiAgdGhpcy5uYXRpdmVEcmFnZ2FibGUgPSBvcHRpb25zLmZvcmNlRmFsbGJhY2sgPyBmYWxzZSA6IHN1cHBvcnREcmFnZ2FibGU7XG5cbiAgaWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgLy8gVG91Y2ggc3RhcnQgdGhyZXNob2xkIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gdGhlIG5hdGl2ZSBkcmFnc3RhcnQgdGhyZXNob2xkXG4gICAgdGhpcy5vcHRpb25zLnRvdWNoU3RhcnRUaHJlc2hvbGQgPSAxO1xuICB9IC8vIEJpbmQgZXZlbnRzXG5cblxuICBpZiAob3B0aW9ucy5zdXBwb3J0UG9pbnRlcikge1xuICAgIG9uKGVsLCAncG9pbnRlcmRvd24nLCB0aGlzLl9vblRhcFN0YXJ0KTtcbiAgfSBlbHNlIHtcbiAgICBvbihlbCwgJ21vdXNlZG93bicsIHRoaXMuX29uVGFwU3RhcnQpO1xuICAgIG9uKGVsLCAndG91Y2hzdGFydCcsIHRoaXMuX29uVGFwU3RhcnQpO1xuICB9XG5cbiAgaWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgb24oZWwsICdkcmFnb3ZlcicsIHRoaXMpO1xuICAgIG9uKGVsLCAnZHJhZ2VudGVyJywgdGhpcyk7XG4gIH1cblxuICBzb3J0YWJsZXMucHVzaCh0aGlzLmVsKTsgLy8gUmVzdG9yZSBzb3J0aW5nXG5cbiAgb3B0aW9ucy5zdG9yZSAmJiBvcHRpb25zLnN0b3JlLmdldCAmJiB0aGlzLnNvcnQob3B0aW9ucy5zdG9yZS5nZXQodGhpcykgfHwgW10pOyAvLyBBZGQgYW5pbWF0aW9uIHN0YXRlIG1hbmFnZXJcblxuICBfZXh0ZW5kcyh0aGlzLCBBbmltYXRpb25TdGF0ZU1hbmFnZXIoKSk7XG59XG5cblNvcnRhYmxlLnByb3RvdHlwZSA9XG4vKiogQGxlbmRzIFNvcnRhYmxlLnByb3RvdHlwZSAqL1xue1xuICBjb25zdHJ1Y3RvcjogU29ydGFibGUsXG4gIF9pc091dHNpZGVUaGlzRWw6IGZ1bmN0aW9uIF9pc091dHNpZGVUaGlzRWwodGFyZ2V0KSB7XG4gICAgaWYgKCF0aGlzLmVsLmNvbnRhaW5zKHRhcmdldCkgJiYgdGFyZ2V0ICE9PSB0aGlzLmVsKSB7XG4gICAgICBsYXN0VGFyZ2V0ID0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIF9nZXREaXJlY3Rpb246IGZ1bmN0aW9uIF9nZXREaXJlY3Rpb24oZXZ0LCB0YXJnZXQpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09ICdmdW5jdGlvbicgPyB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uLmNhbGwodGhpcywgZXZ0LCB0YXJnZXQsIGRyYWdFbCkgOiB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uO1xuICB9LFxuICBfb25UYXBTdGFydDogZnVuY3Rpb24gX29uVGFwU3RhcnQoXG4gIC8qKiBFdmVudHxUb3VjaEV2ZW50ICovXG4gIGV2dCkge1xuICAgIGlmICghZXZ0LmNhbmNlbGFibGUpIHJldHVybjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgIGVsID0gdGhpcy5lbCxcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgcHJldmVudE9uRmlsdGVyID0gb3B0aW9ucy5wcmV2ZW50T25GaWx0ZXIsXG4gICAgICAgIHR5cGUgPSBldnQudHlwZSxcbiAgICAgICAgdG91Y2ggPSBldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSB8fCBldnQucG9pbnRlclR5cGUgJiYgZXZ0LnBvaW50ZXJUeXBlID09PSAndG91Y2gnICYmIGV2dCxcbiAgICAgICAgdGFyZ2V0ID0gKHRvdWNoIHx8IGV2dCkudGFyZ2V0LFxuICAgICAgICBvcmlnaW5hbFRhcmdldCA9IGV2dC50YXJnZXQuc2hhZG93Um9vdCAmJiAoZXZ0LnBhdGggJiYgZXZ0LnBhdGhbMF0gfHwgZXZ0LmNvbXBvc2VkUGF0aCAmJiBldnQuY29tcG9zZWRQYXRoKClbMF0pIHx8IHRhcmdldCxcbiAgICAgICAgZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XG5cbiAgICBfc2F2ZUlucHV0Q2hlY2tlZFN0YXRlKGVsKTsgLy8gRG9uJ3QgdHJpZ2dlciBzdGFydCBldmVudCB3aGVuIGFuIGVsZW1lbnQgaXMgYmVlbiBkcmFnZ2VkLCBvdGhlcndpc2UgdGhlIGV2dC5vbGRpbmRleCBhbHdheXMgd3Jvbmcgd2hlbiBzZXQgb3B0aW9uLmdyb3VwLlxuXG5cbiAgICBpZiAoZHJhZ0VsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKC9tb3VzZWRvd258cG9pbnRlcmRvd24vLnRlc3QodHlwZSkgJiYgZXZ0LmJ1dHRvbiAhPT0gMCB8fCBvcHRpb25zLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47IC8vIG9ubHkgbGVmdCBidXR0b24gYW5kIGVuYWJsZWRcbiAgICB9IC8vIGNhbmNlbCBkbmQgaWYgb3JpZ2luYWwgdGFyZ2V0IGlzIGNvbnRlbnQgZWRpdGFibGVcblxuXG4gICAgaWYgKG9yaWdpbmFsVGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGFyZ2V0ID0gY2xvc2VzdCh0YXJnZXQsIG9wdGlvbnMuZHJhZ2dhYmxlLCBlbCwgZmFsc2UpO1xuXG4gICAgaWYgKHRhcmdldCAmJiB0YXJnZXQuYW5pbWF0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobGFzdERvd25FbCA9PT0gdGFyZ2V0KSB7XG4gICAgICAvLyBJZ25vcmluZyBkdXBsaWNhdGUgYGRvd25gXG4gICAgICByZXR1cm47XG4gICAgfSAvLyBHZXQgdGhlIGluZGV4IG9mIHRoZSBkcmFnZ2VkIGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnRcblxuXG4gICAgb2xkSW5kZXggPSBpbmRleCh0YXJnZXQpO1xuICAgIG9sZERyYWdnYWJsZUluZGV4ID0gaW5kZXgodGFyZ2V0LCBvcHRpb25zLmRyYWdnYWJsZSk7IC8vIENoZWNrIGZpbHRlclxuXG4gICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChmaWx0ZXIuY2FsbCh0aGlzLCBldnQsIHRhcmdldCwgdGhpcykpIHtcbiAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgIHNvcnRhYmxlOiBfdGhpcyxcbiAgICAgICAgICByb290RWw6IG9yaWdpbmFsVGFyZ2V0LFxuICAgICAgICAgIG5hbWU6ICdmaWx0ZXInLFxuICAgICAgICAgIHRhcmdldEVsOiB0YXJnZXQsXG4gICAgICAgICAgdG9FbDogZWwsXG4gICAgICAgICAgZnJvbUVsOiBlbFxuICAgICAgICB9KTtcblxuICAgICAgICBwbHVnaW5FdmVudCgnZmlsdGVyJywgX3RoaXMsIHtcbiAgICAgICAgICBldnQ6IGV2dFxuICAgICAgICB9KTtcbiAgICAgICAgcHJldmVudE9uRmlsdGVyICYmIGV2dC5jYW5jZWxhYmxlICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm47IC8vIGNhbmNlbCBkbmRcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZpbHRlcikge1xuICAgICAgZmlsdGVyID0gZmlsdGVyLnNwbGl0KCcsJykuc29tZShmdW5jdGlvbiAoY3JpdGVyaWEpIHtcbiAgICAgICAgY3JpdGVyaWEgPSBjbG9zZXN0KG9yaWdpbmFsVGFyZ2V0LCBjcml0ZXJpYS50cmltKCksIGVsLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKGNyaXRlcmlhKSB7XG4gICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgc29ydGFibGU6IF90aGlzLFxuICAgICAgICAgICAgcm9vdEVsOiBjcml0ZXJpYSxcbiAgICAgICAgICAgIG5hbWU6ICdmaWx0ZXInLFxuICAgICAgICAgICAgdGFyZ2V0RWw6IHRhcmdldCxcbiAgICAgICAgICAgIGZyb21FbDogZWwsXG4gICAgICAgICAgICB0b0VsOiBlbFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcGx1Z2luRXZlbnQoJ2ZpbHRlcicsIF90aGlzLCB7XG4gICAgICAgICAgICBldnQ6IGV2dFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICBwcmV2ZW50T25GaWx0ZXIgJiYgZXZ0LmNhbmNlbGFibGUgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybjsgLy8gY2FuY2VsIGRuZFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmhhbmRsZSAmJiAhY2xvc2VzdChvcmlnaW5hbFRhcmdldCwgb3B0aW9ucy5oYW5kbGUsIGVsLCBmYWxzZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIFByZXBhcmUgYGRyYWdzdGFydGBcblxuXG4gICAgdGhpcy5fcHJlcGFyZURyYWdTdGFydChldnQsIHRvdWNoLCB0YXJnZXQpO1xuICB9LFxuICBfcHJlcGFyZURyYWdTdGFydDogZnVuY3Rpb24gX3ByZXBhcmVEcmFnU3RhcnQoXG4gIC8qKiBFdmVudCAqL1xuICBldnQsXG4gIC8qKiBUb3VjaCAqL1xuICB0b3VjaCxcbiAgLyoqIEhUTUxFbGVtZW50ICovXG4gIHRhcmdldCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgIGVsID0gX3RoaXMuZWwsXG4gICAgICAgIG9wdGlvbnMgPSBfdGhpcy5vcHRpb25zLFxuICAgICAgICBvd25lckRvY3VtZW50ID0gZWwub3duZXJEb2N1bWVudCxcbiAgICAgICAgZHJhZ1N0YXJ0Rm47XG5cbiAgICBpZiAodGFyZ2V0ICYmICFkcmFnRWwgJiYgdGFyZ2V0LnBhcmVudE5vZGUgPT09IGVsKSB7XG4gICAgICB2YXIgZHJhZ1JlY3QgPSBnZXRSZWN0KHRhcmdldCk7XG4gICAgICByb290RWwgPSBlbDtcbiAgICAgIGRyYWdFbCA9IHRhcmdldDtcbiAgICAgIHBhcmVudEVsID0gZHJhZ0VsLnBhcmVudE5vZGU7XG4gICAgICBuZXh0RWwgPSBkcmFnRWwubmV4dFNpYmxpbmc7XG4gICAgICBsYXN0RG93bkVsID0gdGFyZ2V0O1xuICAgICAgYWN0aXZlR3JvdXAgPSBvcHRpb25zLmdyb3VwO1xuICAgICAgU29ydGFibGUuZHJhZ2dlZCA9IGRyYWdFbDtcbiAgICAgIHRhcEV2dCA9IHtcbiAgICAgICAgdGFyZ2V0OiBkcmFnRWwsXG4gICAgICAgIGNsaWVudFg6ICh0b3VjaCB8fCBldnQpLmNsaWVudFgsXG4gICAgICAgIGNsaWVudFk6ICh0b3VjaCB8fCBldnQpLmNsaWVudFlcbiAgICAgIH07XG4gICAgICB0YXBEaXN0YW5jZUxlZnQgPSB0YXBFdnQuY2xpZW50WCAtIGRyYWdSZWN0LmxlZnQ7XG4gICAgICB0YXBEaXN0YW5jZVRvcCA9IHRhcEV2dC5jbGllbnRZIC0gZHJhZ1JlY3QudG9wO1xuICAgICAgdGhpcy5fbGFzdFggPSAodG91Y2ggfHwgZXZ0KS5jbGllbnRYO1xuICAgICAgdGhpcy5fbGFzdFkgPSAodG91Y2ggfHwgZXZ0KS5jbGllbnRZO1xuICAgICAgZHJhZ0VsLnN0eWxlWyd3aWxsLWNoYW5nZSddID0gJ2FsbCc7XG5cbiAgICAgIGRyYWdTdGFydEZuID0gZnVuY3Rpb24gZHJhZ1N0YXJ0Rm4oKSB7XG4gICAgICAgIHBsdWdpbkV2ZW50KCdkZWxheUVuZGVkJywgX3RoaXMsIHtcbiAgICAgICAgICBldnQ6IGV2dFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkge1xuICAgICAgICAgIF90aGlzLl9vbkRyb3AoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBEZWxheWVkIGRyYWcgaGFzIGJlZW4gdHJpZ2dlcmVkXG4gICAgICAgIC8vIHdlIGNhbiByZS1lbmFibGUgdGhlIGV2ZW50czogdG91Y2htb3ZlL21vdXNlbW92ZVxuXG5cbiAgICAgICAgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZ0V2ZW50cygpO1xuXG4gICAgICAgIGlmICghRmlyZUZveCAmJiBfdGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgICAgICBkcmFnRWwuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgICAgfSAvLyBCaW5kIHRoZSBldmVudHM6IGRyYWdzdGFydC9kcmFnZW5kXG5cblxuICAgICAgICBfdGhpcy5fdHJpZ2dlckRyYWdTdGFydChldnQsIHRvdWNoKTsgLy8gRHJhZyBzdGFydCBldmVudFxuXG5cbiAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgIHNvcnRhYmxlOiBfdGhpcyxcbiAgICAgICAgICBuYW1lOiAnY2hvb3NlJyxcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgfSk7IC8vIENob3NlbiBpdGVtXG5cblxuICAgICAgICB0b2dnbGVDbGFzcyhkcmFnRWwsIG9wdGlvbnMuY2hvc2VuQ2xhc3MsIHRydWUpO1xuICAgICAgfTsgLy8gRGlzYWJsZSBcImRyYWdnYWJsZVwiXG5cblxuICAgICAgb3B0aW9ucy5pZ25vcmUuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uIChjcml0ZXJpYSkge1xuICAgICAgICBmaW5kKGRyYWdFbCwgY3JpdGVyaWEudHJpbSgpLCBfZGlzYWJsZURyYWdnYWJsZSk7XG4gICAgICB9KTtcbiAgICAgIG9uKG93bmVyRG9jdW1lbnQsICdkcmFnb3ZlcicsIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KTtcbiAgICAgIG9uKG93bmVyRG9jdW1lbnQsICdtb3VzZW1vdmUnLCBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudCk7XG4gICAgICBvbihvd25lckRvY3VtZW50LCAndG91Y2htb3ZlJywgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQpO1xuICAgICAgb24ob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCBfdGhpcy5fb25Ecm9wKTtcbiAgICAgIG9uKG93bmVyRG9jdW1lbnQsICd0b3VjaGVuZCcsIF90aGlzLl9vbkRyb3ApO1xuICAgICAgb24ob3duZXJEb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgX3RoaXMuX29uRHJvcCk7IC8vIE1ha2UgZHJhZ0VsIGRyYWdnYWJsZSAobXVzdCBiZSBiZWZvcmUgZGVsYXkgZm9yIEZpcmVGb3gpXG5cbiAgICAgIGlmIChGaXJlRm94ICYmIHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy50b3VjaFN0YXJ0VGhyZXNob2xkID0gNDtcbiAgICAgICAgZHJhZ0VsLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHBsdWdpbkV2ZW50KCdkZWxheVN0YXJ0JywgdGhpcywge1xuICAgICAgICBldnQ6IGV2dFxuICAgICAgfSk7IC8vIERlbGF5IGlzIGltcG9zc2libGUgZm9yIG5hdGl2ZSBEbkQgaW4gRWRnZSBvciBJRVxuXG4gICAgICBpZiAob3B0aW9ucy5kZWxheSAmJiAoIW9wdGlvbnMuZGVsYXlPblRvdWNoT25seSB8fCB0b3VjaCkgJiYgKCF0aGlzLm5hdGl2ZURyYWdnYWJsZSB8fCAhKEVkZ2UgfHwgSUUxMU9yTGVzcykpKSB7XG4gICAgICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSB7XG4gICAgICAgICAgdGhpcy5fb25Ecm9wKCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gLy8gSWYgdGhlIHVzZXIgbW92ZXMgdGhlIHBvaW50ZXIgb3IgbGV0IGdvIHRoZSBjbGljayBvciB0b3VjaFxuICAgICAgICAvLyBiZWZvcmUgdGhlIGRlbGF5IGhhcyBiZWVuIHJlYWNoZWQ6XG4gICAgICAgIC8vIGRpc2FibGUgdGhlIGRlbGF5ZWQgZHJhZ1xuXG5cbiAgICAgICAgb24ob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICAgICAgb24ob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG4gICAgICAgIG9uKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuICAgICAgICBvbihvd25lckRvY3VtZW50LCAnbW91c2Vtb3ZlJywgX3RoaXMuX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgICAgIG9uKG93bmVyRG9jdW1lbnQsICd0b3VjaG1vdmUnLCBfdGhpcy5fZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyKTtcbiAgICAgICAgb3B0aW9ucy5zdXBwb3J0UG9pbnRlciAmJiBvbihvd25lckRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCBfdGhpcy5fZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyKTtcbiAgICAgICAgX3RoaXMuX2RyYWdTdGFydFRpbWVyID0gc2V0VGltZW91dChkcmFnU3RhcnRGbiwgb3B0aW9ucy5kZWxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcmFnU3RhcnRGbigpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcjogZnVuY3Rpb24gX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcihcbiAgLyoqIFRvdWNoRXZlbnR8UG9pbnRlckV2ZW50ICoqL1xuICBlKSB7XG4gICAgdmFyIHRvdWNoID0gZS50b3VjaGVzID8gZS50b3VjaGVzWzBdIDogZTtcblxuICAgIGlmIChNYXRoLm1heChNYXRoLmFicyh0b3VjaC5jbGllbnRYIC0gdGhpcy5fbGFzdFgpLCBNYXRoLmFicyh0b3VjaC5jbGllbnRZIC0gdGhpcy5fbGFzdFkpKSA+PSBNYXRoLmZsb29yKHRoaXMub3B0aW9ucy50b3VjaFN0YXJ0VGhyZXNob2xkIC8gKHRoaXMubmF0aXZlRHJhZ2dhYmxlICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpKSkge1xuICAgICAgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKCk7XG4gICAgfVxuICB9LFxuICBfZGlzYWJsZURlbGF5ZWREcmFnOiBmdW5jdGlvbiBfZGlzYWJsZURlbGF5ZWREcmFnKCkge1xuICAgIGRyYWdFbCAmJiBfZGlzYWJsZURyYWdnYWJsZShkcmFnRWwpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9kcmFnU3RhcnRUaW1lcik7XG5cbiAgICB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWdFdmVudHMoKTtcbiAgfSxcbiAgX2Rpc2FibGVEZWxheWVkRHJhZ0V2ZW50czogZnVuY3Rpb24gX2Rpc2FibGVEZWxheWVkRHJhZ0V2ZW50cygpIHtcbiAgICB2YXIgb3duZXJEb2N1bWVudCA9IHRoaXMuZWwub3duZXJEb2N1bWVudDtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuICAgIG9mZihvd25lckRvY3VtZW50LCAndG91Y2hlbmQnLCB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuICAgIG9mZihvd25lckRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuICAgIG9mZihvd25lckRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5fZGVsYXllZERyYWdUb3VjaE1vdmVIYW5kbGVyKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3RvdWNobW92ZScsIHRoaXMuX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICdwb2ludGVybW92ZScsIHRoaXMuX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcik7XG4gIH0sXG4gIF90cmlnZ2VyRHJhZ1N0YXJ0OiBmdW5jdGlvbiBfdHJpZ2dlckRyYWdTdGFydChcbiAgLyoqIEV2ZW50ICovXG4gIGV2dCxcbiAgLyoqIFRvdWNoICovXG4gIHRvdWNoKSB7XG4gICAgdG91Y2ggPSB0b3VjaCB8fCBldnQucG9pbnRlclR5cGUgPT0gJ3RvdWNoJyAmJiBldnQ7XG5cbiAgICBpZiAoIXRoaXMubmF0aXZlRHJhZ2dhYmxlIHx8IHRvdWNoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN1cHBvcnRQb2ludGVyKSB7XG4gICAgICAgIG9uKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRvdWNoKSB7XG4gICAgICAgIG9uKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb24oZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uKGRyYWdFbCwgJ2RyYWdlbmQnLCB0aGlzKTtcbiAgICAgIG9uKHJvb3RFbCwgJ2RyYWdzdGFydCcsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKGRvY3VtZW50LnNlbGVjdGlvbikge1xuICAgICAgICAvLyBUaW1lb3V0IG5lY2Nlc3NhcnkgZm9yIElFOVxuICAgICAgICBfbmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRvY3VtZW50LnNlbGVjdGlvbi5lbXB0eSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHt9XG4gIH0sXG4gIF9kcmFnU3RhcnRlZDogZnVuY3Rpb24gX2RyYWdTdGFydGVkKGZhbGxiYWNrLCBldnQpIHtcblxuICAgIGF3YWl0aW5nRHJhZ1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIGlmIChyb290RWwgJiYgZHJhZ0VsKSB7XG4gICAgICBwbHVnaW5FdmVudCgnZHJhZ1N0YXJ0ZWQnLCB0aGlzLCB7XG4gICAgICAgIGV2dDogZXZ0XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgICAgIG9uKGRvY3VtZW50LCAnZHJhZ292ZXInLCBfY2hlY2tPdXRzaWRlVGFyZ2V0RWwpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9uczsgLy8gQXBwbHkgZWZmZWN0XG5cbiAgICAgICFmYWxsYmFjayAmJiB0b2dnbGVDbGFzcyhkcmFnRWwsIG9wdGlvbnMuZHJhZ0NsYXNzLCBmYWxzZSk7XG4gICAgICB0b2dnbGVDbGFzcyhkcmFnRWwsIG9wdGlvbnMuZ2hvc3RDbGFzcywgdHJ1ZSk7XG4gICAgICBTb3J0YWJsZS5hY3RpdmUgPSB0aGlzO1xuICAgICAgZmFsbGJhY2sgJiYgdGhpcy5fYXBwZW5kR2hvc3QoKTsgLy8gRHJhZyBzdGFydCBldmVudFxuXG4gICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgIHNvcnRhYmxlOiB0aGlzLFxuICAgICAgICBuYW1lOiAnc3RhcnQnLFxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9udWxsaW5nKCk7XG4gICAgfVxuICB9LFxuICBfZW11bGF0ZURyYWdPdmVyOiBmdW5jdGlvbiBfZW11bGF0ZURyYWdPdmVyKCkge1xuICAgIGlmICh0b3VjaEV2dCkge1xuICAgICAgdGhpcy5fbGFzdFggPSB0b3VjaEV2dC5jbGllbnRYO1xuICAgICAgdGhpcy5fbGFzdFkgPSB0b3VjaEV2dC5jbGllbnRZO1xuXG4gICAgICBfaGlkZUdob3N0Rm9yVGFyZ2V0KCk7XG5cbiAgICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHRvdWNoRXZ0LmNsaWVudFgsIHRvdWNoRXZ0LmNsaWVudFkpO1xuICAgICAgdmFyIHBhcmVudCA9IHRhcmdldDtcblxuICAgICAgd2hpbGUgKHRhcmdldCAmJiB0YXJnZXQuc2hhZG93Um9vdCkge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQuc2hhZG93Um9vdC5lbGVtZW50RnJvbVBvaW50KHRvdWNoRXZ0LmNsaWVudFgsIHRvdWNoRXZ0LmNsaWVudFkpO1xuICAgICAgICBpZiAodGFyZ2V0ID09PSBwYXJlbnQpIGJyZWFrO1xuICAgICAgICBwYXJlbnQgPSB0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGRyYWdFbC5wYXJlbnROb2RlW2V4cGFuZG9dLl9pc091dHNpZGVUaGlzRWwodGFyZ2V0KTtcblxuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgaWYgKHBhcmVudFtleHBhbmRvXSkge1xuICAgICAgICAgICAgdmFyIGluc2VydGVkID0gdm9pZCAwO1xuICAgICAgICAgICAgaW5zZXJ0ZWQgPSBwYXJlbnRbZXhwYW5kb10uX29uRHJhZ092ZXIoe1xuICAgICAgICAgICAgICBjbGllbnRYOiB0b3VjaEV2dC5jbGllbnRYLFxuICAgICAgICAgICAgICBjbGllbnRZOiB0b3VjaEV2dC5jbGllbnRZLFxuICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICAgICAgcm9vdEVsOiBwYXJlbnRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaW5zZXJ0ZWQgJiYgIXRoaXMub3B0aW9ucy5kcmFnb3ZlckJ1YmJsZSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0YXJnZXQgPSBwYXJlbnQ7IC8vIHN0b3JlIGxhc3QgZWxlbWVudFxuICAgICAgICB9XG4gICAgICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICAgICAgd2hpbGUgKHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlKTtcbiAgICAgIH1cblxuICAgICAgX3VuaGlkZUdob3N0Rm9yVGFyZ2V0KCk7XG4gICAgfVxuICB9LFxuICBfb25Ub3VjaE1vdmU6IGZ1bmN0aW9uIF9vblRvdWNoTW92ZShcbiAgLyoqVG91Y2hFdmVudCovXG4gIGV2dCkge1xuICAgIGlmICh0YXBFdnQpIHtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGZhbGxiYWNrVG9sZXJhbmNlID0gb3B0aW9ucy5mYWxsYmFja1RvbGVyYW5jZSxcbiAgICAgICAgICBmYWxsYmFja09mZnNldCA9IG9wdGlvbnMuZmFsbGJhY2tPZmZzZXQsXG4gICAgICAgICAgdG91Y2ggPSBldnQudG91Y2hlcyA/IGV2dC50b3VjaGVzWzBdIDogZXZ0LFxuICAgICAgICAgIGdob3N0TWF0cml4ID0gZ2hvc3RFbCAmJiBtYXRyaXgoZ2hvc3RFbCwgdHJ1ZSksXG4gICAgICAgICAgc2NhbGVYID0gZ2hvc3RFbCAmJiBnaG9zdE1hdHJpeCAmJiBnaG9zdE1hdHJpeC5hLFxuICAgICAgICAgIHNjYWxlWSA9IGdob3N0RWwgJiYgZ2hvc3RNYXRyaXggJiYgZ2hvc3RNYXRyaXguZCxcbiAgICAgICAgICByZWxhdGl2ZVNjcm9sbE9mZnNldCA9IFBvc2l0aW9uR2hvc3RBYnNvbHV0ZWx5ICYmIGdob3N0UmVsYXRpdmVQYXJlbnQgJiYgZ2V0UmVsYXRpdmVTY3JvbGxPZmZzZXQoZ2hvc3RSZWxhdGl2ZVBhcmVudCksXG4gICAgICAgICAgZHggPSAodG91Y2guY2xpZW50WCAtIHRhcEV2dC5jbGllbnRYICsgZmFsbGJhY2tPZmZzZXQueCkgLyAoc2NhbGVYIHx8IDEpICsgKHJlbGF0aXZlU2Nyb2xsT2Zmc2V0ID8gcmVsYXRpdmVTY3JvbGxPZmZzZXRbMF0gLSBnaG9zdFJlbGF0aXZlUGFyZW50SW5pdGlhbFNjcm9sbFswXSA6IDApIC8gKHNjYWxlWCB8fCAxKSxcbiAgICAgICAgICBkeSA9ICh0b3VjaC5jbGllbnRZIC0gdGFwRXZ0LmNsaWVudFkgKyBmYWxsYmFja09mZnNldC55KSAvIChzY2FsZVkgfHwgMSkgKyAocmVsYXRpdmVTY3JvbGxPZmZzZXQgPyByZWxhdGl2ZVNjcm9sbE9mZnNldFsxXSAtIGdob3N0UmVsYXRpdmVQYXJlbnRJbml0aWFsU2Nyb2xsWzFdIDogMCkgLyAoc2NhbGVZIHx8IDEpOyAvLyBvbmx5IHNldCB0aGUgc3RhdHVzIHRvIGRyYWdnaW5nLCB3aGVuIHdlIGFyZSBhY3R1YWxseSBkcmFnZ2luZ1xuXG4gICAgICBpZiAoIVNvcnRhYmxlLmFjdGl2ZSAmJiAhYXdhaXRpbmdEcmFnU3RhcnRlZCkge1xuICAgICAgICBpZiAoZmFsbGJhY2tUb2xlcmFuY2UgJiYgTWF0aC5tYXgoTWF0aC5hYnModG91Y2guY2xpZW50WCAtIHRoaXMuX2xhc3RYKSwgTWF0aC5hYnModG91Y2guY2xpZW50WSAtIHRoaXMuX2xhc3RZKSkgPCBmYWxsYmFja1RvbGVyYW5jZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX29uRHJhZ1N0YXJ0KGV2dCwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChnaG9zdEVsKSB7XG4gICAgICAgIGlmIChnaG9zdE1hdHJpeCkge1xuICAgICAgICAgIGdob3N0TWF0cml4LmUgKz0gZHggLSAobGFzdER4IHx8IDApO1xuICAgICAgICAgIGdob3N0TWF0cml4LmYgKz0gZHkgLSAobGFzdER5IHx8IDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdob3N0TWF0cml4ID0ge1xuICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgIGI6IDAsXG4gICAgICAgICAgICBjOiAwLFxuICAgICAgICAgICAgZDogMSxcbiAgICAgICAgICAgIGU6IGR4LFxuICAgICAgICAgICAgZjogZHlcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNzc01hdHJpeCA9IFwibWF0cml4KFwiLmNvbmNhdChnaG9zdE1hdHJpeC5hLCBcIixcIikuY29uY2F0KGdob3N0TWF0cml4LmIsIFwiLFwiKS5jb25jYXQoZ2hvc3RNYXRyaXguYywgXCIsXCIpLmNvbmNhdChnaG9zdE1hdHJpeC5kLCBcIixcIikuY29uY2F0KGdob3N0TWF0cml4LmUsIFwiLFwiKS5jb25jYXQoZ2hvc3RNYXRyaXguZiwgXCIpXCIpO1xuICAgICAgICBjc3MoZ2hvc3RFbCwgJ3dlYmtpdFRyYW5zZm9ybScsIGNzc01hdHJpeCk7XG4gICAgICAgIGNzcyhnaG9zdEVsLCAnbW96VHJhbnNmb3JtJywgY3NzTWF0cml4KTtcbiAgICAgICAgY3NzKGdob3N0RWwsICdtc1RyYW5zZm9ybScsIGNzc01hdHJpeCk7XG4gICAgICAgIGNzcyhnaG9zdEVsLCAndHJhbnNmb3JtJywgY3NzTWF0cml4KTtcbiAgICAgICAgbGFzdER4ID0gZHg7XG4gICAgICAgIGxhc3REeSA9IGR5O1xuICAgICAgICB0b3VjaEV2dCA9IHRvdWNoO1xuICAgICAgfVxuXG4gICAgICBldnQuY2FuY2VsYWJsZSAmJiBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH0sXG4gIF9hcHBlbmRHaG9zdDogZnVuY3Rpb24gX2FwcGVuZEdob3N0KCkge1xuICAgIC8vIEJ1ZyBpZiB1c2luZyBzY2FsZSgpOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNjM3MDU4XG4gICAgLy8gTm90IGJlaW5nIGFkanVzdGVkIGZvclxuICAgIGlmICghZ2hvc3RFbCkge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMub3B0aW9ucy5mYWxsYmFja09uQm9keSA/IGRvY3VtZW50LmJvZHkgOiByb290RWwsXG4gICAgICAgICAgcmVjdCA9IGdldFJlY3QoZHJhZ0VsLCB0cnVlLCBQb3NpdGlvbkdob3N0QWJzb2x1dGVseSwgdHJ1ZSwgY29udGFpbmVyKSxcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zOyAvLyBQb3NpdGlvbiBhYnNvbHV0ZWx5XG5cbiAgICAgIGlmIChQb3NpdGlvbkdob3N0QWJzb2x1dGVseSkge1xuICAgICAgICAvLyBHZXQgcmVsYXRpdmVseSBwb3NpdGlvbmVkIHBhcmVudFxuICAgICAgICBnaG9zdFJlbGF0aXZlUGFyZW50ID0gY29udGFpbmVyO1xuXG4gICAgICAgIHdoaWxlIChjc3MoZ2hvc3RSZWxhdGl2ZVBhcmVudCwgJ3Bvc2l0aW9uJykgPT09ICdzdGF0aWMnICYmIGNzcyhnaG9zdFJlbGF0aXZlUGFyZW50LCAndHJhbnNmb3JtJykgPT09ICdub25lJyAmJiBnaG9zdFJlbGF0aXZlUGFyZW50ICE9PSBkb2N1bWVudCkge1xuICAgICAgICAgIGdob3N0UmVsYXRpdmVQYXJlbnQgPSBnaG9zdFJlbGF0aXZlUGFyZW50LnBhcmVudE5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZ2hvc3RSZWxhdGl2ZVBhcmVudCAhPT0gZG9jdW1lbnQuYm9keSAmJiBnaG9zdFJlbGF0aXZlUGFyZW50ICE9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgICBpZiAoZ2hvc3RSZWxhdGl2ZVBhcmVudCA9PT0gZG9jdW1lbnQpIGdob3N0UmVsYXRpdmVQYXJlbnQgPSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG4gICAgICAgICAgcmVjdC50b3AgKz0gZ2hvc3RSZWxhdGl2ZVBhcmVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgcmVjdC5sZWZ0ICs9IGdob3N0UmVsYXRpdmVQYXJlbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBnaG9zdFJlbGF0aXZlUGFyZW50ID0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2hvc3RSZWxhdGl2ZVBhcmVudEluaXRpYWxTY3JvbGwgPSBnZXRSZWxhdGl2ZVNjcm9sbE9mZnNldChnaG9zdFJlbGF0aXZlUGFyZW50KTtcbiAgICAgIH1cblxuICAgICAgZ2hvc3RFbCA9IGRyYWdFbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICB0b2dnbGVDbGFzcyhnaG9zdEVsLCBvcHRpb25zLmdob3N0Q2xhc3MsIGZhbHNlKTtcbiAgICAgIHRvZ2dsZUNsYXNzKGdob3N0RWwsIG9wdGlvbnMuZmFsbGJhY2tDbGFzcywgdHJ1ZSk7XG4gICAgICB0b2dnbGVDbGFzcyhnaG9zdEVsLCBvcHRpb25zLmRyYWdDbGFzcywgdHJ1ZSk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ3RyYW5zaXRpb24nLCAnJyk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ3RyYW5zZm9ybScsICcnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnYm94LXNpemluZycsICdib3JkZXItYm94Jyk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ21hcmdpbicsIDApO1xuICAgICAgY3NzKGdob3N0RWwsICd0b3AnLCByZWN0LnRvcCk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ2xlZnQnLCByZWN0LmxlZnQpO1xuICAgICAgY3NzKGdob3N0RWwsICd3aWR0aCcsIHJlY3Qud2lkdGgpO1xuICAgICAgY3NzKGdob3N0RWwsICdoZWlnaHQnLCByZWN0LmhlaWdodCk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ29wYWNpdHknLCAnMC44Jyk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ3Bvc2l0aW9uJywgUG9zaXRpb25HaG9zdEFic29sdXRlbHkgPyAnYWJzb2x1dGUnIDogJ2ZpeGVkJyk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ3pJbmRleCcsICcxMDAwMDAnKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAncG9pbnRlckV2ZW50cycsICdub25lJyk7XG4gICAgICBTb3J0YWJsZS5naG9zdCA9IGdob3N0RWw7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZ2hvc3RFbCk7IC8vIFNldCB0cmFuc2Zvcm0tb3JpZ2luXG5cbiAgICAgIGNzcyhnaG9zdEVsLCAndHJhbnNmb3JtLW9yaWdpbicsIHRhcERpc3RhbmNlTGVmdCAvIHBhcnNlSW50KGdob3N0RWwuc3R5bGUud2lkdGgpICogMTAwICsgJyUgJyArIHRhcERpc3RhbmNlVG9wIC8gcGFyc2VJbnQoZ2hvc3RFbC5zdHlsZS5oZWlnaHQpICogMTAwICsgJyUnKTtcbiAgICB9XG4gIH0sXG4gIF9vbkRyYWdTdGFydDogZnVuY3Rpb24gX29uRHJhZ1N0YXJ0KFxuICAvKipFdmVudCovXG4gIGV2dCxcbiAgLyoqYm9vbGVhbiovXG4gIGZhbGxiYWNrKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBkYXRhVHJhbnNmZXIgPSBldnQuZGF0YVRyYW5zZmVyO1xuICAgIHZhciBvcHRpb25zID0gX3RoaXMub3B0aW9ucztcbiAgICBwbHVnaW5FdmVudCgnZHJhZ1N0YXJ0JywgdGhpcywge1xuICAgICAgZXZ0OiBldnRcbiAgICB9KTtcblxuICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSB7XG4gICAgICB0aGlzLl9vbkRyb3AoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBsdWdpbkV2ZW50KCdzZXR1cENsb25lJywgdGhpcyk7XG5cbiAgICBpZiAoIVNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHtcbiAgICAgIGNsb25lRWwgPSBjbG9uZShkcmFnRWwpO1xuICAgICAgY2xvbmVFbC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgIGNsb25lRWwuc3R5bGVbJ3dpbGwtY2hhbmdlJ10gPSAnJztcblxuICAgICAgdGhpcy5faGlkZUNsb25lKCk7XG5cbiAgICAgIHRvZ2dsZUNsYXNzKGNsb25lRWwsIHRoaXMub3B0aW9ucy5jaG9zZW5DbGFzcywgZmFsc2UpO1xuICAgICAgU29ydGFibGUuY2xvbmUgPSBjbG9uZUVsO1xuICAgIH0gLy8gIzExNDM6IElGcmFtZSBzdXBwb3J0IHdvcmthcm91bmRcblxuXG4gICAgX3RoaXMuY2xvbmVJZCA9IF9uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBwbHVnaW5FdmVudCgnY2xvbmUnLCBfdGhpcyk7XG4gICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkgcmV0dXJuO1xuXG4gICAgICBpZiAoIV90aGlzLm9wdGlvbnMucmVtb3ZlQ2xvbmVPbkhpZGUpIHtcbiAgICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShjbG9uZUVsLCBkcmFnRWwpO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5faGlkZUNsb25lKCk7XG5cbiAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgc29ydGFibGU6IF90aGlzLFxuICAgICAgICBuYW1lOiAnY2xvbmUnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAhZmFsbGJhY2sgJiYgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmRyYWdDbGFzcywgdHJ1ZSk7IC8vIFNldCBwcm9wZXIgZHJvcCBldmVudHNcblxuICAgIGlmIChmYWxsYmFjaykge1xuICAgICAgaWdub3JlTmV4dENsaWNrID0gdHJ1ZTtcbiAgICAgIF90aGlzLl9sb29wSWQgPSBzZXRJbnRlcnZhbChfdGhpcy5fZW11bGF0ZURyYWdPdmVyLCA1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVuZG8gd2hhdCB3YXMgc2V0IGluIF9wcmVwYXJlRHJhZ1N0YXJ0IGJlZm9yZSBkcmFnIHN0YXJ0ZWRcbiAgICAgIG9mZihkb2N1bWVudCwgJ21vdXNldXAnLCBfdGhpcy5fb25Ecm9wKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ3RvdWNoZW5kJywgX3RoaXMuX29uRHJvcCk7XG4gICAgICBvZmYoZG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIF90aGlzLl9vbkRyb3ApO1xuXG4gICAgICBpZiAoZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICBvcHRpb25zLnNldERhdGEgJiYgb3B0aW9ucy5zZXREYXRhLmNhbGwoX3RoaXMsIGRhdGFUcmFuc2ZlciwgZHJhZ0VsKTtcbiAgICAgIH1cblxuICAgICAgb24oZG9jdW1lbnQsICdkcm9wJywgX3RoaXMpOyAvLyAjMTI3NiBmaXg6XG5cbiAgICAgIGNzcyhkcmFnRWwsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlWigwKScpO1xuICAgIH1cblxuICAgIGF3YWl0aW5nRHJhZ1N0YXJ0ZWQgPSB0cnVlO1xuICAgIF90aGlzLl9kcmFnU3RhcnRJZCA9IF9uZXh0VGljayhfdGhpcy5fZHJhZ1N0YXJ0ZWQuYmluZChfdGhpcywgZmFsbGJhY2ssIGV2dCkpO1xuICAgIG9uKGRvY3VtZW50LCAnc2VsZWN0c3RhcnQnLCBfdGhpcyk7XG4gICAgbW92ZWQgPSB0cnVlO1xuXG4gICAgaWYgKFNhZmFyaSkge1xuICAgICAgY3NzKGRvY3VtZW50LmJvZHksICd1c2VyLXNlbGVjdCcsICdub25lJyk7XG4gICAgfVxuICB9LFxuICAvLyBSZXR1cm5zIHRydWUgLSBpZiBubyBmdXJ0aGVyIGFjdGlvbiBpcyBuZWVkZWQgKGVpdGhlciBpbnNlcnRlZCBvciBhbm90aGVyIGNvbmRpdGlvbilcbiAgX29uRHJhZ092ZXI6IGZ1bmN0aW9uIF9vbkRyYWdPdmVyKFxuICAvKipFdmVudCovXG4gIGV2dCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWwsXG4gICAgICAgIHRhcmdldCA9IGV2dC50YXJnZXQsXG4gICAgICAgIGRyYWdSZWN0LFxuICAgICAgICB0YXJnZXRSZWN0LFxuICAgICAgICByZXZlcnQsXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGdyb3VwID0gb3B0aW9ucy5ncm91cCxcbiAgICAgICAgYWN0aXZlU29ydGFibGUgPSBTb3J0YWJsZS5hY3RpdmUsXG4gICAgICAgIGlzT3duZXIgPSBhY3RpdmVHcm91cCA9PT0gZ3JvdXAsXG4gICAgICAgIGNhblNvcnQgPSBvcHRpb25zLnNvcnQsXG4gICAgICAgIGZyb21Tb3J0YWJsZSA9IHB1dFNvcnRhYmxlIHx8IGFjdGl2ZVNvcnRhYmxlLFxuICAgICAgICB2ZXJ0aWNhbCxcbiAgICAgICAgX3RoaXMgPSB0aGlzLFxuICAgICAgICBjb21wbGV0ZWRGaXJlZCA9IGZhbHNlO1xuXG4gICAgaWYgKF9zaWxlbnQpIHJldHVybjtcblxuICAgIGZ1bmN0aW9uIGRyYWdPdmVyRXZlbnQobmFtZSwgZXh0cmEpIHtcbiAgICAgIHBsdWdpbkV2ZW50KG5hbWUsIF90aGlzLCBfb2JqZWN0U3ByZWFkKHtcbiAgICAgICAgZXZ0OiBldnQsXG4gICAgICAgIGlzT3duZXI6IGlzT3duZXIsXG4gICAgICAgIGF4aXM6IHZlcnRpY2FsID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJyxcbiAgICAgICAgcmV2ZXJ0OiByZXZlcnQsXG4gICAgICAgIGRyYWdSZWN0OiBkcmFnUmVjdCxcbiAgICAgICAgdGFyZ2V0UmVjdDogdGFyZ2V0UmVjdCxcbiAgICAgICAgY2FuU29ydDogY2FuU29ydCxcbiAgICAgICAgZnJvbVNvcnRhYmxlOiBmcm9tU29ydGFibGUsXG4gICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICBjb21wbGV0ZWQ6IGNvbXBsZXRlZCxcbiAgICAgICAgb25Nb3ZlOiBmdW5jdGlvbiBvbk1vdmUodGFyZ2V0LCBhZnRlcikge1xuICAgICAgICAgIHJldHVybiBfb25Nb3ZlKHJvb3RFbCwgZWwsIGRyYWdFbCwgZHJhZ1JlY3QsIHRhcmdldCwgZ2V0UmVjdCh0YXJnZXQpLCBldnQsIGFmdGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlZDogY2hhbmdlZFxuICAgICAgfSwgZXh0cmEpKTtcbiAgICB9IC8vIENhcHR1cmUgYW5pbWF0aW9uIHN0YXRlXG5cblxuICAgIGZ1bmN0aW9uIGNhcHR1cmUoKSB7XG4gICAgICBkcmFnT3ZlckV2ZW50KCdkcmFnT3ZlckFuaW1hdGlvbkNhcHR1cmUnKTtcblxuICAgICAgX3RoaXMuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG5cbiAgICAgIGlmIChfdGhpcyAhPT0gZnJvbVNvcnRhYmxlKSB7XG4gICAgICAgIGZyb21Tb3J0YWJsZS5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcbiAgICAgIH1cbiAgICB9IC8vIFJldHVybiBpbnZvY2F0aW9uIHdoZW4gZHJhZ0VsIGlzIGluc2VydGVkIChvciBjb21wbGV0ZWQpXG5cblxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlZChpbnNlcnRpb24pIHtcbiAgICAgIGRyYWdPdmVyRXZlbnQoJ2RyYWdPdmVyQ29tcGxldGVkJywge1xuICAgICAgICBpbnNlcnRpb246IGluc2VydGlvblxuICAgICAgfSk7XG5cbiAgICAgIGlmIChpbnNlcnRpb24pIHtcbiAgICAgICAgLy8gQ2xvbmVzIG11c3QgYmUgaGlkZGVuIGJlZm9yZSBmb2xkaW5nIGFuaW1hdGlvbiB0byBjYXB0dXJlIGRyYWdSZWN0QWJzb2x1dGUgcHJvcGVybHlcbiAgICAgICAgaWYgKGlzT3duZXIpIHtcbiAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5faGlkZUNsb25lKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWN0aXZlU29ydGFibGUuX3Nob3dDbG9uZShfdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXMgIT09IGZyb21Tb3J0YWJsZSkge1xuICAgICAgICAgIC8vIFNldCBnaG9zdCBjbGFzcyB0byBuZXcgc29ydGFibGUncyBnaG9zdCBjbGFzc1xuICAgICAgICAgIHRvZ2dsZUNsYXNzKGRyYWdFbCwgcHV0U29ydGFibGUgPyBwdXRTb3J0YWJsZS5vcHRpb25zLmdob3N0Q2xhc3MgOiBhY3RpdmVTb3J0YWJsZS5vcHRpb25zLmdob3N0Q2xhc3MsIGZhbHNlKTtcbiAgICAgICAgICB0b2dnbGVDbGFzcyhkcmFnRWwsIG9wdGlvbnMuZ2hvc3RDbGFzcywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHV0U29ydGFibGUgIT09IF90aGlzICYmIF90aGlzICE9PSBTb3J0YWJsZS5hY3RpdmUpIHtcbiAgICAgICAgICBwdXRTb3J0YWJsZSA9IF90aGlzO1xuICAgICAgICB9IGVsc2UgaWYgKF90aGlzID09PSBTb3J0YWJsZS5hY3RpdmUgJiYgcHV0U29ydGFibGUpIHtcbiAgICAgICAgICBwdXRTb3J0YWJsZSA9IG51bGw7XG4gICAgICAgIH0gLy8gQW5pbWF0aW9uXG5cblxuICAgICAgICBpZiAoZnJvbVNvcnRhYmxlID09PSBfdGhpcykge1xuICAgICAgICAgIF90aGlzLl9pZ25vcmVXaGlsZUFuaW1hdGluZyA9IHRhcmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLmFuaW1hdGVBbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRyYWdPdmVyRXZlbnQoJ2RyYWdPdmVyQW5pbWF0aW9uQ29tcGxldGUnKTtcbiAgICAgICAgICBfdGhpcy5faWdub3JlV2hpbGVBbmltYXRpbmcgPSBudWxsO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoX3RoaXMgIT09IGZyb21Tb3J0YWJsZSkge1xuICAgICAgICAgIGZyb21Tb3J0YWJsZS5hbmltYXRlQWxsKCk7XG4gICAgICAgICAgZnJvbVNvcnRhYmxlLl9pZ25vcmVXaGlsZUFuaW1hdGluZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gTnVsbCBsYXN0VGFyZ2V0IGlmIGl0IGlzIG5vdCBpbnNpZGUgYSBwcmV2aW91c2x5IHN3YXBwZWQgZWxlbWVudFxuXG5cbiAgICAgIGlmICh0YXJnZXQgPT09IGRyYWdFbCAmJiAhZHJhZ0VsLmFuaW1hdGVkIHx8IHRhcmdldCA9PT0gZWwgJiYgIXRhcmdldC5hbmltYXRlZCkge1xuICAgICAgICBsYXN0VGFyZ2V0ID0gbnVsbDtcbiAgICAgIH0gLy8gbm8gYnViYmxpbmcgYW5kIG5vdCBmYWxsYmFja1xuXG5cbiAgICAgIGlmICghb3B0aW9ucy5kcmFnb3ZlckJ1YmJsZSAmJiAhZXZ0LnJvb3RFbCAmJiB0YXJnZXQgIT09IGRvY3VtZW50KSB7XG4gICAgICAgIGRyYWdFbC5wYXJlbnROb2RlW2V4cGFuZG9dLl9pc091dHNpZGVUaGlzRWwoZXZ0LnRhcmdldCk7IC8vIERvIG5vdCBkZXRlY3QgZm9yIGVtcHR5IGluc2VydCBpZiBhbHJlYWR5IGluc2VydGVkXG5cblxuICAgICAgICAhaW5zZXJ0aW9uICYmIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KGV2dCk7XG4gICAgICB9XG5cbiAgICAgICFvcHRpb25zLmRyYWdvdmVyQnViYmxlICYmIGV2dC5zdG9wUHJvcGFnYXRpb24gJiYgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcmV0dXJuIGNvbXBsZXRlZEZpcmVkID0gdHJ1ZTtcbiAgICB9IC8vIENhbGwgd2hlbiBkcmFnRWwgaGFzIGJlZW4gaW5zZXJ0ZWRcblxuXG4gICAgZnVuY3Rpb24gY2hhbmdlZCgpIHtcbiAgICAgIG5ld0luZGV4ID0gaW5kZXgoZHJhZ0VsKTtcbiAgICAgIG5ld0RyYWdnYWJsZUluZGV4ID0gaW5kZXgoZHJhZ0VsLCBvcHRpb25zLmRyYWdnYWJsZSk7XG5cbiAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgc29ydGFibGU6IF90aGlzLFxuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgdG9FbDogZWwsXG4gICAgICAgIG5ld0luZGV4OiBuZXdJbmRleCxcbiAgICAgICAgbmV3RHJhZ2dhYmxlSW5kZXg6IG5ld0RyYWdnYWJsZUluZGV4LFxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChldnQucHJldmVudERlZmF1bHQgIT09IHZvaWQgMCkge1xuICAgICAgZXZ0LmNhbmNlbGFibGUgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgdGFyZ2V0ID0gY2xvc2VzdCh0YXJnZXQsIG9wdGlvbnMuZHJhZ2dhYmxlLCBlbCwgdHJ1ZSk7XG4gICAgZHJhZ092ZXJFdmVudCgnZHJhZ092ZXInKTtcbiAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkgcmV0dXJuIGNvbXBsZXRlZEZpcmVkO1xuXG4gICAgaWYgKGRyYWdFbC5jb250YWlucyhldnQudGFyZ2V0KSB8fCB0YXJnZXQuYW5pbWF0ZWQgJiYgdGFyZ2V0LmFuaW1hdGluZ1ggJiYgdGFyZ2V0LmFuaW1hdGluZ1kgfHwgX3RoaXMuX2lnbm9yZVdoaWxlQW5pbWF0aW5nID09PSB0YXJnZXQpIHtcbiAgICAgIHJldHVybiBjb21wbGV0ZWQoZmFsc2UpO1xuICAgIH1cblxuICAgIGlnbm9yZU5leHRDbGljayA9IGZhbHNlO1xuXG4gICAgaWYgKGFjdGl2ZVNvcnRhYmxlICYmICFvcHRpb25zLmRpc2FibGVkICYmIChpc093bmVyID8gY2FuU29ydCB8fCAocmV2ZXJ0ID0gIXJvb3RFbC5jb250YWlucyhkcmFnRWwpKSAvLyBSZXZlcnRpbmcgaXRlbSBpbnRvIHRoZSBvcmlnaW5hbCBsaXN0XG4gICAgOiBwdXRTb3J0YWJsZSA9PT0gdGhpcyB8fCAodGhpcy5sYXN0UHV0TW9kZSA9IGFjdGl2ZUdyb3VwLmNoZWNrUHVsbCh0aGlzLCBhY3RpdmVTb3J0YWJsZSwgZHJhZ0VsLCBldnQpKSAmJiBncm91cC5jaGVja1B1dCh0aGlzLCBhY3RpdmVTb3J0YWJsZSwgZHJhZ0VsLCBldnQpKSkge1xuICAgICAgdmVydGljYWwgPSB0aGlzLl9nZXREaXJlY3Rpb24oZXZ0LCB0YXJnZXQpID09PSAndmVydGljYWwnO1xuICAgICAgZHJhZ1JlY3QgPSBnZXRSZWN0KGRyYWdFbCk7XG4gICAgICBkcmFnT3ZlckV2ZW50KCdkcmFnT3ZlclZhbGlkJyk7XG4gICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkgcmV0dXJuIGNvbXBsZXRlZEZpcmVkO1xuXG4gICAgICBpZiAocmV2ZXJ0KSB7XG4gICAgICAgIHBhcmVudEVsID0gcm9vdEVsOyAvLyBhY3R1YWxpemF0aW9uXG5cbiAgICAgICAgY2FwdHVyZSgpO1xuXG4gICAgICAgIHRoaXMuX2hpZGVDbG9uZSgpO1xuXG4gICAgICAgIGRyYWdPdmVyRXZlbnQoJ3JldmVydCcpO1xuXG4gICAgICAgIGlmICghU29ydGFibGUuZXZlbnRDYW5jZWxlZCkge1xuICAgICAgICAgIGlmIChuZXh0RWwpIHtcbiAgICAgICAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBuZXh0RWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByb290RWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcGxldGVkKHRydWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWxMYXN0Q2hpbGQgPSBsYXN0Q2hpbGQoZWwsIG9wdGlvbnMuZHJhZ2dhYmxlKTtcblxuICAgICAgaWYgKCFlbExhc3RDaGlsZCB8fCBfZ2hvc3RJc0xhc3QoZXZ0LCB2ZXJ0aWNhbCwgdGhpcykgJiYgIWVsTGFzdENoaWxkLmFuaW1hdGVkKSB7XG4gICAgICAgIC8vIElmIGFscmVhZHkgYXQgZW5kIG9mIGxpc3Q6IERvIG5vdCBpbnNlcnRcbiAgICAgICAgaWYgKGVsTGFzdENoaWxkID09PSBkcmFnRWwpIHtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICAgICAgfSAvLyBhc3NpZ24gdGFyZ2V0IG9ubHkgaWYgY29uZGl0aW9uIGlzIHRydWVcblxuXG4gICAgICAgIGlmIChlbExhc3RDaGlsZCAmJiBlbCA9PT0gZXZ0LnRhcmdldCkge1xuICAgICAgICAgIHRhcmdldCA9IGVsTGFzdENoaWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgIHRhcmdldFJlY3QgPSBnZXRSZWN0KHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIHRhcmdldFJlY3QsIGV2dCwgISF0YXJnZXQpICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNhcHR1cmUoKTtcbiAgICAgICAgICBlbC5hcHBlbmRDaGlsZChkcmFnRWwpO1xuICAgICAgICAgIHBhcmVudEVsID0gZWw7IC8vIGFjdHVhbGl6YXRpb25cblxuICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRhcmdldC5wYXJlbnROb2RlID09PSBlbCkge1xuICAgICAgICB0YXJnZXRSZWN0ID0gZ2V0UmVjdCh0YXJnZXQpO1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gMCxcbiAgICAgICAgICAgIHRhcmdldEJlZm9yZUZpcnN0U3dhcCxcbiAgICAgICAgICAgIGRpZmZlcmVudExldmVsID0gZHJhZ0VsLnBhcmVudE5vZGUgIT09IGVsLFxuICAgICAgICAgICAgZGlmZmVyZW50Um93Q29sID0gIV9kcmFnRWxJblJvd0NvbHVtbihkcmFnRWwuYW5pbWF0ZWQgJiYgZHJhZ0VsLnRvUmVjdCB8fCBkcmFnUmVjdCwgdGFyZ2V0LmFuaW1hdGVkICYmIHRhcmdldC50b1JlY3QgfHwgdGFyZ2V0UmVjdCwgdmVydGljYWwpLFxuICAgICAgICAgICAgc2lkZTEgPSB2ZXJ0aWNhbCA/ICd0b3AnIDogJ2xlZnQnLFxuICAgICAgICAgICAgc2Nyb2xsZWRQYXN0VG9wID0gaXNTY3JvbGxlZFBhc3QodGFyZ2V0LCAndG9wJywgJ3RvcCcpIHx8IGlzU2Nyb2xsZWRQYXN0KGRyYWdFbCwgJ3RvcCcsICd0b3AnKSxcbiAgICAgICAgICAgIHNjcm9sbEJlZm9yZSA9IHNjcm9sbGVkUGFzdFRvcCA/IHNjcm9sbGVkUGFzdFRvcC5zY3JvbGxUb3AgOiB2b2lkIDA7XG5cbiAgICAgICAgaWYgKGxhc3RUYXJnZXQgIT09IHRhcmdldCkge1xuICAgICAgICAgIHRhcmdldEJlZm9yZUZpcnN0U3dhcCA9IHRhcmdldFJlY3Rbc2lkZTFdO1xuICAgICAgICAgIHBhc3RGaXJzdEludmVydFRocmVzaCA9IGZhbHNlO1xuICAgICAgICAgIGlzQ2lyY3Vtc3RhbnRpYWxJbnZlcnQgPSAhZGlmZmVyZW50Um93Q29sICYmIG9wdGlvbnMuaW52ZXJ0U3dhcCB8fCBkaWZmZXJlbnRMZXZlbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpcmVjdGlvbiA9IF9nZXRTd2FwRGlyZWN0aW9uKGV2dCwgdGFyZ2V0LCB0YXJnZXRSZWN0LCB2ZXJ0aWNhbCwgZGlmZmVyZW50Um93Q29sID8gMSA6IG9wdGlvbnMuc3dhcFRocmVzaG9sZCwgb3B0aW9ucy5pbnZlcnRlZFN3YXBUaHJlc2hvbGQgPT0gbnVsbCA/IG9wdGlvbnMuc3dhcFRocmVzaG9sZCA6IG9wdGlvbnMuaW52ZXJ0ZWRTd2FwVGhyZXNob2xkLCBpc0NpcmN1bXN0YW50aWFsSW52ZXJ0LCBsYXN0VGFyZ2V0ID09PSB0YXJnZXQpO1xuICAgICAgICB2YXIgc2libGluZztcblxuICAgICAgICBpZiAoZGlyZWN0aW9uICE9PSAwKSB7XG4gICAgICAgICAgLy8gQ2hlY2sgaWYgdGFyZ2V0IGlzIGJlc2lkZSBkcmFnRWwgaW4gcmVzcGVjdGl2ZSBkaXJlY3Rpb24gKGlnbm9yaW5nIGhpZGRlbiBlbGVtZW50cylcbiAgICAgICAgICB2YXIgZHJhZ0luZGV4ID0gaW5kZXgoZHJhZ0VsKTtcblxuICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgIGRyYWdJbmRleCAtPSBkaXJlY3Rpb247XG4gICAgICAgICAgICBzaWJsaW5nID0gcGFyZW50RWwuY2hpbGRyZW5bZHJhZ0luZGV4XTtcbiAgICAgICAgICB9IHdoaWxlIChzaWJsaW5nICYmIChjc3Moc2libGluZywgJ2Rpc3BsYXknKSA9PT0gJ25vbmUnIHx8IHNpYmxpbmcgPT09IGdob3N0RWwpKTtcbiAgICAgICAgfSAvLyBJZiBkcmFnRWwgaXMgYWxyZWFkeSBiZXNpZGUgdGFyZ2V0OiBEbyBub3QgaW5zZXJ0XG5cblxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAwIHx8IHNpYmxpbmcgPT09IHRhcmdldCkge1xuICAgICAgICAgIHJldHVybiBjb21wbGV0ZWQoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdFRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgbGFzdERpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gdGFyZ2V0Lm5leHRFbGVtZW50U2libGluZyxcbiAgICAgICAgICAgIGFmdGVyID0gZmFsc2U7XG4gICAgICAgIGFmdGVyID0gZGlyZWN0aW9uID09PSAxO1xuXG4gICAgICAgIHZhciBtb3ZlVmVjdG9yID0gX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIHRhcmdldFJlY3QsIGV2dCwgYWZ0ZXIpO1xuXG4gICAgICAgIGlmIChtb3ZlVmVjdG9yICE9PSBmYWxzZSkge1xuICAgICAgICAgIGlmIChtb3ZlVmVjdG9yID09PSAxIHx8IG1vdmVWZWN0b3IgPT09IC0xKSB7XG4gICAgICAgICAgICBhZnRlciA9IG1vdmVWZWN0b3IgPT09IDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3NpbGVudCA9IHRydWU7XG4gICAgICAgICAgc2V0VGltZW91dChfdW5zaWxlbnQsIDMwKTtcbiAgICAgICAgICBjYXB0dXJlKCk7XG5cbiAgICAgICAgICBpZiAoYWZ0ZXIgJiYgIW5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChkcmFnRWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBhZnRlciA/IG5leHRTaWJsaW5nIDogdGFyZ2V0KTtcbiAgICAgICAgICB9IC8vIFVuZG8gY2hyb21lJ3Mgc2Nyb2xsIGFkanVzdG1lbnQgKGhhcyBubyBlZmZlY3Qgb24gb3RoZXIgYnJvd3NlcnMpXG5cblxuICAgICAgICAgIGlmIChzY3JvbGxlZFBhc3RUb3ApIHtcbiAgICAgICAgICAgIHNjcm9sbEJ5KHNjcm9sbGVkUGFzdFRvcCwgMCwgc2Nyb2xsQmVmb3JlIC0gc2Nyb2xsZWRQYXN0VG9wLnNjcm9sbFRvcCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGFyZW50RWwgPSBkcmFnRWwucGFyZW50Tm9kZTsgLy8gYWN0dWFsaXphdGlvblxuICAgICAgICAgIC8vIG11c3QgYmUgZG9uZSBiZWZvcmUgYW5pbWF0aW9uXG5cbiAgICAgICAgICBpZiAodGFyZ2V0QmVmb3JlRmlyc3RTd2FwICE9PSB1bmRlZmluZWQgJiYgIWlzQ2lyY3Vtc3RhbnRpYWxJbnZlcnQpIHtcbiAgICAgICAgICAgIHRhcmdldE1vdmVEaXN0YW5jZSA9IE1hdGguYWJzKHRhcmdldEJlZm9yZUZpcnN0U3dhcCAtIGdldFJlY3QodGFyZ2V0KVtzaWRlMV0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbC5jb250YWlucyhkcmFnRWwpKSB7XG4gICAgICAgIHJldHVybiBjb21wbGV0ZWQoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgX2lnbm9yZVdoaWxlQW5pbWF0aW5nOiBudWxsLFxuICBfb2ZmTW92ZUV2ZW50czogZnVuY3Rpb24gX29mZk1vdmVFdmVudHMoKSB7XG4gICAgb2ZmKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpO1xuICAgIG9mZihkb2N1bWVudCwgJ3RvdWNobW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcbiAgICBvZmYoZG9jdW1lbnQsICdwb2ludGVybW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcbiAgICBvZmYoZG9jdW1lbnQsICdkcmFnb3ZlcicsIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KTtcbiAgICBvZmYoZG9jdW1lbnQsICdtb3VzZW1vdmUnLCBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudCk7XG4gICAgb2ZmKGRvY3VtZW50LCAndG91Y2htb3ZlJywgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQpO1xuICB9LFxuICBfb2ZmVXBFdmVudHM6IGZ1bmN0aW9uIF9vZmZVcEV2ZW50cygpIHtcbiAgICB2YXIgb3duZXJEb2N1bWVudCA9IHRoaXMuZWwub3duZXJEb2N1bWVudDtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLl9vbkRyb3ApO1xuICAgIG9mZihvd25lckRvY3VtZW50LCAndG91Y2hlbmQnLCB0aGlzLl9vbkRyb3ApO1xuICAgIG9mZihvd25lckRvY3VtZW50LCAncG9pbnRlcnVwJywgdGhpcy5fb25Ecm9wKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgdGhpcy5fb25Ecm9wKTtcbiAgICBvZmYoZG9jdW1lbnQsICdzZWxlY3RzdGFydCcsIHRoaXMpO1xuICB9LFxuICBfb25Ecm9wOiBmdW5jdGlvbiBfb25Ecm9wKFxuICAvKipFdmVudCovXG4gIGV2dCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWwsXG4gICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7IC8vIEdldCB0aGUgaW5kZXggb2YgdGhlIGRyYWdnZWQgZWxlbWVudCB3aXRoaW4gaXRzIHBhcmVudFxuXG4gICAgbmV3SW5kZXggPSBpbmRleChkcmFnRWwpO1xuICAgIG5ld0RyYWdnYWJsZUluZGV4ID0gaW5kZXgoZHJhZ0VsLCBvcHRpb25zLmRyYWdnYWJsZSk7XG4gICAgcGx1Z2luRXZlbnQoJ2Ryb3AnLCB0aGlzLCB7XG4gICAgICBldnQ6IGV2dFxuICAgIH0pO1xuICAgIHBhcmVudEVsID0gZHJhZ0VsICYmIGRyYWdFbC5wYXJlbnROb2RlOyAvLyBHZXQgYWdhaW4gYWZ0ZXIgcGx1Z2luIGV2ZW50XG5cbiAgICBuZXdJbmRleCA9IGluZGV4KGRyYWdFbCk7XG4gICAgbmV3RHJhZ2dhYmxlSW5kZXggPSBpbmRleChkcmFnRWwsIG9wdGlvbnMuZHJhZ2dhYmxlKTtcblxuICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSB7XG4gICAgICB0aGlzLl9udWxsaW5nKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhd2FpdGluZ0RyYWdTdGFydGVkID0gZmFsc2U7XG4gICAgaXNDaXJjdW1zdGFudGlhbEludmVydCA9IGZhbHNlO1xuICAgIHBhc3RGaXJzdEludmVydFRocmVzaCA9IGZhbHNlO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fbG9vcElkKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fZHJhZ1N0YXJ0VGltZXIpO1xuXG4gICAgX2NhbmNlbE5leHRUaWNrKHRoaXMuY2xvbmVJZCk7XG5cbiAgICBfY2FuY2VsTmV4dFRpY2sodGhpcy5fZHJhZ1N0YXJ0SWQpOyAvLyBVbmJpbmQgZXZlbnRzXG5cblxuICAgIGlmICh0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgb2ZmKGRvY3VtZW50LCAnZHJvcCcsIHRoaXMpO1xuICAgICAgb2ZmKGVsLCAnZHJhZ3N0YXJ0JywgdGhpcy5fb25EcmFnU3RhcnQpO1xuICAgIH1cblxuICAgIHRoaXMuX29mZk1vdmVFdmVudHMoKTtcblxuICAgIHRoaXMuX29mZlVwRXZlbnRzKCk7XG5cbiAgICBpZiAoU2FmYXJpKSB7XG4gICAgICBjc3MoZG9jdW1lbnQuYm9keSwgJ3VzZXItc2VsZWN0JywgJycpO1xuICAgIH1cblxuICAgIGNzcyhkcmFnRWwsICd0cmFuc2Zvcm0nLCAnJyk7XG5cbiAgICBpZiAoZXZ0KSB7XG4gICAgICBpZiAobW92ZWQpIHtcbiAgICAgICAgZXZ0LmNhbmNlbGFibGUgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICFvcHRpb25zLmRyb3BCdWJibGUgJiYgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuXG4gICAgICBnaG9zdEVsICYmIGdob3N0RWwucGFyZW50Tm9kZSAmJiBnaG9zdEVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZ2hvc3RFbCk7XG5cbiAgICAgIGlmIChyb290RWwgPT09IHBhcmVudEVsIHx8IHB1dFNvcnRhYmxlICYmIHB1dFNvcnRhYmxlLmxhc3RQdXRNb2RlICE9PSAnY2xvbmUnKSB7XG4gICAgICAgIC8vIFJlbW92ZSBjbG9uZShzKVxuICAgICAgICBjbG9uZUVsICYmIGNsb25lRWwucGFyZW50Tm9kZSAmJiBjbG9uZUVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2xvbmVFbCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkcmFnRWwpIHtcbiAgICAgICAgaWYgKHRoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgICAgICAgb2ZmKGRyYWdFbCwgJ2RyYWdlbmQnLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9kaXNhYmxlRHJhZ2dhYmxlKGRyYWdFbCk7XG5cbiAgICAgICAgZHJhZ0VsLnN0eWxlWyd3aWxsLWNoYW5nZSddID0gJyc7IC8vIFJlbW92ZSBjbGFzc2VzXG4gICAgICAgIC8vIGdob3N0Q2xhc3MgaXMgYWRkZWQgaW4gZHJhZ1N0YXJ0ZWRcblxuICAgICAgICBpZiAobW92ZWQgJiYgIWF3YWl0aW5nRHJhZ1N0YXJ0ZWQpIHtcbiAgICAgICAgICB0b2dnbGVDbGFzcyhkcmFnRWwsIHB1dFNvcnRhYmxlID8gcHV0U29ydGFibGUub3B0aW9ucy5naG9zdENsYXNzIDogdGhpcy5vcHRpb25zLmdob3N0Q2xhc3MsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUNsYXNzKGRyYWdFbCwgdGhpcy5vcHRpb25zLmNob3NlbkNsYXNzLCBmYWxzZSk7IC8vIERyYWcgc3RvcCBldmVudFxuXG4gICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICBuYW1lOiAndW5jaG9vc2UnLFxuICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgIG5ld0luZGV4OiBudWxsLFxuICAgICAgICAgIG5ld0RyYWdnYWJsZUluZGV4OiBudWxsLFxuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocm9vdEVsICE9PSBwYXJlbnRFbCkge1xuICAgICAgICAgIGlmIChuZXdJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAvLyBBZGQgZXZlbnRcbiAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgcm9vdEVsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgbmFtZTogJ2FkZCcsXG4gICAgICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgICBmcm9tRWw6IHJvb3RFbCxcbiAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgICB9KTsgLy8gUmVtb3ZlIGV2ZW50XG5cblxuICAgICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICAgICAgbmFtZTogJ3JlbW92ZScsXG4gICAgICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICAgIH0pOyAvLyBkcmFnIGZyb20gb25lIGxpc3QgYW5kIGRyb3AgaW50byBhbm90aGVyXG5cblxuICAgICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICByb290RWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgICBuYW1lOiAnc29ydCcsXG4gICAgICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgICBmcm9tRWw6IHJvb3RFbCxcbiAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICAgICAgbmFtZTogJ3NvcnQnLFxuICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwdXRTb3J0YWJsZSAmJiBwdXRTb3J0YWJsZS5zYXZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG5ld0luZGV4ICE9PSBvbGRJbmRleCkge1xuICAgICAgICAgICAgaWYgKG5ld0luZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgLy8gZHJhZyAmIGRyb3Agd2l0aGluIHRoZSBzYW1lIGxpc3RcbiAgICAgICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0aGlzLFxuICAgICAgICAgICAgICAgIG5hbWU6ICd1cGRhdGUnLFxuICAgICAgICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NvcnQnLFxuICAgICAgICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU29ydGFibGUuYWN0aXZlKSB7XG4gICAgICAgICAgLyoganNoaW50IGVxbnVsbDp0cnVlICovXG4gICAgICAgICAgaWYgKG5ld0luZGV4ID09IG51bGwgfHwgbmV3SW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICBuZXdJbmRleCA9IG9sZEluZGV4O1xuICAgICAgICAgICAgbmV3RHJhZ2dhYmxlSW5kZXggPSBvbGREcmFnZ2FibGVJbmRleDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICAgIG5hbWU6ICdlbmQnLFxuICAgICAgICAgICAgdG9FbDogcGFyZW50RWwsXG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICB9KTsgLy8gU2F2ZSBzb3J0aW5nXG5cblxuICAgICAgICAgIHRoaXMuc2F2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fbnVsbGluZygpO1xuICB9LFxuICBfbnVsbGluZzogZnVuY3Rpb24gX251bGxpbmcoKSB7XG4gICAgcGx1Z2luRXZlbnQoJ251bGxpbmcnLCB0aGlzKTtcbiAgICByb290RWwgPSBkcmFnRWwgPSBwYXJlbnRFbCA9IGdob3N0RWwgPSBuZXh0RWwgPSBjbG9uZUVsID0gbGFzdERvd25FbCA9IGNsb25lSGlkZGVuID0gdGFwRXZ0ID0gdG91Y2hFdnQgPSBtb3ZlZCA9IG5ld0luZGV4ID0gbmV3RHJhZ2dhYmxlSW5kZXggPSBvbGRJbmRleCA9IG9sZERyYWdnYWJsZUluZGV4ID0gbGFzdFRhcmdldCA9IGxhc3REaXJlY3Rpb24gPSBwdXRTb3J0YWJsZSA9IGFjdGl2ZUdyb3VwID0gU29ydGFibGUuZHJhZ2dlZCA9IFNvcnRhYmxlLmdob3N0ID0gU29ydGFibGUuY2xvbmUgPSBTb3J0YWJsZS5hY3RpdmUgPSBudWxsO1xuICAgIHNhdmVkSW5wdXRDaGVja2VkLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICBlbC5jaGVja2VkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBzYXZlZElucHV0Q2hlY2tlZC5sZW5ndGggPSBsYXN0RHggPSBsYXN0RHkgPSAwO1xuICB9LFxuICBoYW5kbGVFdmVudDogZnVuY3Rpb24gaGFuZGxlRXZlbnQoXG4gIC8qKkV2ZW50Ki9cbiAgZXZ0KSB7XG4gICAgc3dpdGNoIChldnQudHlwZSkge1xuICAgICAgY2FzZSAnZHJvcCc6XG4gICAgICBjYXNlICdkcmFnZW5kJzpcbiAgICAgICAgdGhpcy5fb25Ecm9wKGV2dCk7XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2RyYWdlbnRlcic6XG4gICAgICBjYXNlICdkcmFnb3Zlcic6XG4gICAgICAgIGlmIChkcmFnRWwpIHtcbiAgICAgICAgICB0aGlzLl9vbkRyYWdPdmVyKGV2dCk7XG5cbiAgICAgICAgICBfZ2xvYmFsRHJhZ092ZXIoZXZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzZWxlY3RzdGFydCc6XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGl0ZW0gaW50byBhbiBhcnJheSBvZiBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJpbmdbXX1cbiAgICovXG4gIHRvQXJyYXk6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgdmFyIG9yZGVyID0gW10sXG4gICAgICAgIGVsLFxuICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZWwuY2hpbGRyZW4sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBuID0gY2hpbGRyZW4ubGVuZ3RoLFxuICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgZm9yICg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGVsID0gY2hpbGRyZW5baV07XG5cbiAgICAgIGlmIChjbG9zZXN0KGVsLCBvcHRpb25zLmRyYWdnYWJsZSwgdGhpcy5lbCwgZmFsc2UpKSB7XG4gICAgICAgIG9yZGVyLnB1c2goZWwuZ2V0QXR0cmlidXRlKG9wdGlvbnMuZGF0YUlkQXR0cikgfHwgX2dlbmVyYXRlSWQoZWwpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3JkZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNvcnRzIHRoZSBlbGVtZW50cyBhY2NvcmRpbmcgdG8gdGhlIGFycmF5LlxuICAgKiBAcGFyYW0gIHtTdHJpbmdbXX0gIG9yZGVyICBvcmRlciBvZiB0aGUgaXRlbXNcbiAgICovXG4gIHNvcnQ6IGZ1bmN0aW9uIHNvcnQob3JkZXIpIHtcbiAgICB2YXIgaXRlbXMgPSB7fSxcbiAgICAgICAgcm9vdEVsID0gdGhpcy5lbDtcbiAgICB0aGlzLnRvQXJyYXkoKS5mb3JFYWNoKGZ1bmN0aW9uIChpZCwgaSkge1xuICAgICAgdmFyIGVsID0gcm9vdEVsLmNoaWxkcmVuW2ldO1xuXG4gICAgICBpZiAoY2xvc2VzdChlbCwgdGhpcy5vcHRpb25zLmRyYWdnYWJsZSwgcm9vdEVsLCBmYWxzZSkpIHtcbiAgICAgICAgaXRlbXNbaWRdID0gZWw7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgb3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpdGVtc1tpZF0pIHtcbiAgICAgICAgcm9vdEVsLnJlbW92ZUNoaWxkKGl0ZW1zW2lkXSk7XG4gICAgICAgIHJvb3RFbC5hcHBlbmRDaGlsZChpdGVtc1tpZF0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBjdXJyZW50IHNvcnRpbmdcbiAgICovXG4gIHNhdmU6IGZ1bmN0aW9uIHNhdmUoKSB7XG4gICAgdmFyIHN0b3JlID0gdGhpcy5vcHRpb25zLnN0b3JlO1xuICAgIHN0b3JlICYmIHN0b3JlLnNldCAmJiBzdG9yZS5zZXQodGhpcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIHNldCwgZ2V0IHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IgYnkgdGVzdGluZyB0aGUgZWxlbWVudCBpdHNlbGYgYW5kIHRyYXZlcnNpbmcgdXAgdGhyb3VnaCBpdHMgYW5jZXN0b3JzIGluIHRoZSBET00gdHJlZS5cbiAgICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgZWxcbiAgICogQHBhcmFtICAge1N0cmluZ30gICAgICAgW3NlbGVjdG9yXSAgZGVmYXVsdDogYG9wdGlvbnMuZHJhZ2dhYmxlYFxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8bnVsbH1cbiAgICovXG4gIGNsb3Nlc3Q6IGZ1bmN0aW9uIGNsb3Nlc3QkMShlbCwgc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gY2xvc2VzdChlbCwgc2VsZWN0b3IgfHwgdGhpcy5vcHRpb25zLmRyYWdnYWJsZSwgdGhpcy5lbCwgZmFsc2UpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQvZ2V0IG9wdGlvblxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSAgIHsqfSAgICAgIFt2YWx1ZV1cbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBvcHRpb246IGZ1bmN0aW9uIG9wdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHJldHVybiBvcHRpb25zW25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbW9kaWZpZWRWYWx1ZSA9IFBsdWdpbk1hbmFnZXIubW9kaWZ5T3B0aW9uKHRoaXMsIG5hbWUsIHZhbHVlKTtcblxuICAgICAgaWYgKHR5cGVvZiBtb2RpZmllZFZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvcHRpb25zW25hbWVdID0gbW9kaWZpZWRWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5hbWUgPT09ICdncm91cCcpIHtcbiAgICAgICAgX3ByZXBhcmVHcm91cChvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlc3Ryb3lcbiAgICovXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcGx1Z2luRXZlbnQoJ2Rlc3Ryb3knLCB0aGlzKTtcbiAgICB2YXIgZWwgPSB0aGlzLmVsO1xuICAgIGVsW2V4cGFuZG9dID0gbnVsbDtcbiAgICBvZmYoZWwsICdtb3VzZWRvd24nLCB0aGlzLl9vblRhcFN0YXJ0KTtcbiAgICBvZmYoZWwsICd0b3VjaHN0YXJ0JywgdGhpcy5fb25UYXBTdGFydCk7XG4gICAgb2ZmKGVsLCAncG9pbnRlcmRvd24nLCB0aGlzLl9vblRhcFN0YXJ0KTtcblxuICAgIGlmICh0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgb2ZmKGVsLCAnZHJhZ292ZXInLCB0aGlzKTtcbiAgICAgIG9mZihlbCwgJ2RyYWdlbnRlcicsIHRoaXMpO1xuICAgIH0gLy8gUmVtb3ZlIGRyYWdnYWJsZSBhdHRyaWJ1dGVzXG5cblxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZWwucXVlcnlTZWxlY3RvckFsbCgnW2RyYWdnYWJsZV0nKSwgZnVuY3Rpb24gKGVsKSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RyYWdnYWJsZScpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fb25Ecm9wKCk7XG5cbiAgICB0aGlzLl9kaXNhYmxlRGVsYXllZERyYWdFdmVudHMoKTtcblxuICAgIHNvcnRhYmxlcy5zcGxpY2Uoc29ydGFibGVzLmluZGV4T2YodGhpcy5lbCksIDEpO1xuICAgIHRoaXMuZWwgPSBlbCA9IG51bGw7XG4gIH0sXG4gIF9oaWRlQ2xvbmU6IGZ1bmN0aW9uIF9oaWRlQ2xvbmUoKSB7XG4gICAgaWYgKCFjbG9uZUhpZGRlbikge1xuICAgICAgcGx1Z2luRXZlbnQoJ2hpZGVDbG9uZScsIHRoaXMpO1xuICAgICAgaWYgKFNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHJldHVybjtcbiAgICAgIGNzcyhjbG9uZUVsLCAnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlQ2xvbmVPbkhpZGUgJiYgY2xvbmVFbC5wYXJlbnROb2RlKSB7XG4gICAgICAgIGNsb25lRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZUVsKTtcbiAgICAgIH1cblxuICAgICAgY2xvbmVIaWRkZW4gPSB0cnVlO1xuICAgIH1cbiAgfSxcbiAgX3Nob3dDbG9uZTogZnVuY3Rpb24gX3Nob3dDbG9uZShwdXRTb3J0YWJsZSkge1xuICAgIGlmIChwdXRTb3J0YWJsZS5sYXN0UHV0TW9kZSAhPT0gJ2Nsb25lJykge1xuICAgICAgdGhpcy5faGlkZUNsb25lKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY2xvbmVIaWRkZW4pIHtcbiAgICAgIHBsdWdpbkV2ZW50KCdzaG93Q2xvbmUnLCB0aGlzKTtcbiAgICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSByZXR1cm47IC8vIHNob3cgY2xvbmUgYXQgZHJhZ0VsIG9yIG9yaWdpbmFsIHBvc2l0aW9uXG5cbiAgICAgIGlmIChyb290RWwuY29udGFpbnMoZHJhZ0VsKSAmJiAhdGhpcy5vcHRpb25zLmdyb3VwLnJldmVydENsb25lKSB7XG4gICAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmVFbCwgZHJhZ0VsKTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dEVsKSB7XG4gICAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmVFbCwgbmV4dEVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3RFbC5hcHBlbmRDaGlsZChjbG9uZUVsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5ncm91cC5yZXZlcnRDbG9uZSkge1xuICAgICAgICB0aGlzLmFuaW1hdGUoZHJhZ0VsLCBjbG9uZUVsKTtcbiAgICAgIH1cblxuICAgICAgY3NzKGNsb25lRWwsICdkaXNwbGF5JywgJycpO1xuICAgICAgY2xvbmVIaWRkZW4gPSBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9nbG9iYWxEcmFnT3Zlcihcbi8qKkV2ZW50Ki9cbmV2dCkge1xuICBpZiAoZXZ0LmRhdGFUcmFuc2Zlcikge1xuICAgIGV2dC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgfVxuXG4gIGV2dC5jYW5jZWxhYmxlICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5mdW5jdGlvbiBfb25Nb3ZlKGZyb21FbCwgdG9FbCwgZHJhZ0VsLCBkcmFnUmVjdCwgdGFyZ2V0RWwsIHRhcmdldFJlY3QsIG9yaWdpbmFsRXZlbnQsIHdpbGxJbnNlcnRBZnRlcikge1xuICB2YXIgZXZ0LFxuICAgICAgc29ydGFibGUgPSBmcm9tRWxbZXhwYW5kb10sXG4gICAgICBvbk1vdmVGbiA9IHNvcnRhYmxlLm9wdGlvbnMub25Nb3ZlLFxuICAgICAgcmV0VmFsOyAvLyBTdXBwb3J0IGZvciBuZXcgQ3VzdG9tRXZlbnQgZmVhdHVyZVxuXG4gIGlmICh3aW5kb3cuQ3VzdG9tRXZlbnQgJiYgIUlFMTFPckxlc3MgJiYgIUVkZ2UpIHtcbiAgICBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ21vdmUnLCB7XG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIGV2dC5pbml0RXZlbnQoJ21vdmUnLCB0cnVlLCB0cnVlKTtcbiAgfVxuXG4gIGV2dC50byA9IHRvRWw7XG4gIGV2dC5mcm9tID0gZnJvbUVsO1xuICBldnQuZHJhZ2dlZCA9IGRyYWdFbDtcbiAgZXZ0LmRyYWdnZWRSZWN0ID0gZHJhZ1JlY3Q7XG4gIGV2dC5yZWxhdGVkID0gdGFyZ2V0RWwgfHwgdG9FbDtcbiAgZXZ0LnJlbGF0ZWRSZWN0ID0gdGFyZ2V0UmVjdCB8fCBnZXRSZWN0KHRvRWwpO1xuICBldnQud2lsbEluc2VydEFmdGVyID0gd2lsbEluc2VydEFmdGVyO1xuICBldnQub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG4gIGZyb21FbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG5cbiAgaWYgKG9uTW92ZUZuKSB7XG4gICAgcmV0VmFsID0gb25Nb3ZlRm4uY2FsbChzb3J0YWJsZSwgZXZ0LCBvcmlnaW5hbEV2ZW50KTtcbiAgfVxuXG4gIHJldHVybiByZXRWYWw7XG59XG5cbmZ1bmN0aW9uIF9kaXNhYmxlRHJhZ2dhYmxlKGVsKSB7XG4gIGVsLmRyYWdnYWJsZSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfdW5zaWxlbnQoKSB7XG4gIF9zaWxlbnQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2dob3N0SXNMYXN0KGV2dCwgdmVydGljYWwsIHNvcnRhYmxlKSB7XG4gIHZhciByZWN0ID0gZ2V0UmVjdChsYXN0Q2hpbGQoc29ydGFibGUuZWwsIHNvcnRhYmxlLm9wdGlvbnMuZHJhZ2dhYmxlKSk7XG4gIHZhciBzcGFjZXIgPSAxMDtcbiAgcmV0dXJuIHZlcnRpY2FsID8gZXZ0LmNsaWVudFggPiByZWN0LnJpZ2h0ICsgc3BhY2VyIHx8IGV2dC5jbGllbnRYIDw9IHJlY3QucmlnaHQgJiYgZXZ0LmNsaWVudFkgPiByZWN0LmJvdHRvbSAmJiBldnQuY2xpZW50WCA+PSByZWN0LmxlZnQgOiBldnQuY2xpZW50WCA+IHJlY3QucmlnaHQgJiYgZXZ0LmNsaWVudFkgPiByZWN0LnRvcCB8fCBldnQuY2xpZW50WCA8PSByZWN0LnJpZ2h0ICYmIGV2dC5jbGllbnRZID4gcmVjdC5ib3R0b20gKyBzcGFjZXI7XG59XG5cbmZ1bmN0aW9uIF9nZXRTd2FwRGlyZWN0aW9uKGV2dCwgdGFyZ2V0LCB0YXJnZXRSZWN0LCB2ZXJ0aWNhbCwgc3dhcFRocmVzaG9sZCwgaW52ZXJ0ZWRTd2FwVGhyZXNob2xkLCBpbnZlcnRTd2FwLCBpc0xhc3RUYXJnZXQpIHtcbiAgdmFyIG1vdXNlT25BeGlzID0gdmVydGljYWwgPyBldnQuY2xpZW50WSA6IGV2dC5jbGllbnRYLFxuICAgICAgdGFyZ2V0TGVuZ3RoID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LmhlaWdodCA6IHRhcmdldFJlY3Qud2lkdGgsXG4gICAgICB0YXJnZXRTMSA9IHZlcnRpY2FsID8gdGFyZ2V0UmVjdC50b3AgOiB0YXJnZXRSZWN0LmxlZnQsXG4gICAgICB0YXJnZXRTMiA9IHZlcnRpY2FsID8gdGFyZ2V0UmVjdC5ib3R0b20gOiB0YXJnZXRSZWN0LnJpZ2h0LFxuICAgICAgaW52ZXJ0ID0gZmFsc2U7XG5cbiAgaWYgKCFpbnZlcnRTd2FwKSB7XG4gICAgLy8gTmV2ZXIgaW52ZXJ0IG9yIGNyZWF0ZSBkcmFnRWwgc2hhZG93IHdoZW4gdGFyZ2V0IG1vdmVtZW5ldCBjYXVzZXMgbW91c2UgdG8gbW92ZSBwYXN0IHRoZSBlbmQgb2YgcmVndWxhciBzd2FwVGhyZXNob2xkXG4gICAgaWYgKGlzTGFzdFRhcmdldCAmJiB0YXJnZXRNb3ZlRGlzdGFuY2UgPCB0YXJnZXRMZW5ndGggKiBzd2FwVGhyZXNob2xkKSB7XG4gICAgICAvLyBtdWx0aXBsaWVkIG9ubHkgYnkgc3dhcFRocmVzaG9sZCBiZWNhdXNlIG1vdXNlIHdpbGwgYWxyZWFkeSBiZSBpbnNpZGUgdGFyZ2V0IGJ5ICgxIC0gdGhyZXNob2xkKSAqIHRhcmdldExlbmd0aCAvIDJcbiAgICAgIC8vIGNoZWNrIGlmIHBhc3QgZmlyc3QgaW52ZXJ0IHRocmVzaG9sZCBvbiBzaWRlIG9wcG9zaXRlIG9mIGxhc3REaXJlY3Rpb25cbiAgICAgIGlmICghcGFzdEZpcnN0SW52ZXJ0VGhyZXNoICYmIChsYXN0RGlyZWN0aW9uID09PSAxID8gbW91c2VPbkF4aXMgPiB0YXJnZXRTMSArIHRhcmdldExlbmd0aCAqIGludmVydGVkU3dhcFRocmVzaG9sZCAvIDIgOiBtb3VzZU9uQXhpcyA8IHRhcmdldFMyIC0gdGFyZ2V0TGVuZ3RoICogaW52ZXJ0ZWRTd2FwVGhyZXNob2xkIC8gMikpIHtcbiAgICAgICAgLy8gcGFzdCBmaXJzdCBpbnZlcnQgdGhyZXNob2xkLCBkbyBub3QgcmVzdHJpY3QgaW52ZXJ0ZWQgdGhyZXNob2xkIHRvIGRyYWdFbCBzaGFkb3dcbiAgICAgICAgcGFzdEZpcnN0SW52ZXJ0VGhyZXNoID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwYXN0Rmlyc3RJbnZlcnRUaHJlc2gpIHtcbiAgICAgICAgLy8gZHJhZ0VsIHNoYWRvdyAodGFyZ2V0IG1vdmUgZGlzdGFuY2Ugc2hhZG93KVxuICAgICAgICBpZiAobGFzdERpcmVjdGlvbiA9PT0gMSA/IG1vdXNlT25BeGlzIDwgdGFyZ2V0UzEgKyB0YXJnZXRNb3ZlRGlzdGFuY2UgLy8gb3ZlciBkcmFnRWwgc2hhZG93XG4gICAgICAgIDogbW91c2VPbkF4aXMgPiB0YXJnZXRTMiAtIHRhcmdldE1vdmVEaXN0YW5jZSkge1xuICAgICAgICAgIHJldHVybiAtbGFzdERpcmVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW52ZXJ0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVndWxhclxuICAgICAgaWYgKG1vdXNlT25BeGlzID4gdGFyZ2V0UzEgKyB0YXJnZXRMZW5ndGggKiAoMSAtIHN3YXBUaHJlc2hvbGQpIC8gMiAmJiBtb3VzZU9uQXhpcyA8IHRhcmdldFMyIC0gdGFyZ2V0TGVuZ3RoICogKDEgLSBzd2FwVGhyZXNob2xkKSAvIDIpIHtcbiAgICAgICAgcmV0dXJuIF9nZXRJbnNlcnREaXJlY3Rpb24odGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbnZlcnQgPSBpbnZlcnQgfHwgaW52ZXJ0U3dhcDtcblxuICBpZiAoaW52ZXJ0KSB7XG4gICAgLy8gSW52ZXJ0IG9mIHJlZ3VsYXJcbiAgICBpZiAobW91c2VPbkF4aXMgPCB0YXJnZXRTMSArIHRhcmdldExlbmd0aCAqIGludmVydGVkU3dhcFRocmVzaG9sZCAvIDIgfHwgbW91c2VPbkF4aXMgPiB0YXJnZXRTMiAtIHRhcmdldExlbmd0aCAqIGludmVydGVkU3dhcFRocmVzaG9sZCAvIDIpIHtcbiAgICAgIHJldHVybiBtb3VzZU9uQXhpcyA+IHRhcmdldFMxICsgdGFyZ2V0TGVuZ3RoIC8gMiA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbi8qKlxuICogR2V0cyB0aGUgZGlyZWN0aW9uIGRyYWdFbCBtdXN0IGJlIHN3YXBwZWQgcmVsYXRpdmUgdG8gdGFyZ2V0IGluIG9yZGVyIHRvIG1ha2UgaXRcbiAqIHNlZW0gdGhhdCBkcmFnRWwgaGFzIGJlZW4gXCJpbnNlcnRlZFwiIGludG8gdGhhdCBlbGVtZW50J3MgcG9zaXRpb25cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSB0YXJnZXQgICAgICAgVGhlIHRhcmdldCB3aG9zZSBwb3NpdGlvbiBkcmFnRWwgaXMgYmVpbmcgaW5zZXJ0ZWQgYXRcbiAqIEByZXR1cm4ge051bWJlcn0gICAgICAgICAgICAgICAgICAgRGlyZWN0aW9uIGRyYWdFbCBtdXN0IGJlIHN3YXBwZWRcbiAqL1xuXG5cbmZ1bmN0aW9uIF9nZXRJbnNlcnREaXJlY3Rpb24odGFyZ2V0KSB7XG4gIGlmIChpbmRleChkcmFnRWwpIDwgaW5kZXgodGFyZ2V0KSkge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAtMTtcbiAgfVxufVxuLyoqXG4gKiBHZW5lcmF0ZSBpZFxuICogQHBhcmFtICAge0hUTUxFbGVtZW50fSBlbFxuICogQHJldHVybnMge1N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBfZ2VuZXJhdGVJZChlbCkge1xuICB2YXIgc3RyID0gZWwudGFnTmFtZSArIGVsLmNsYXNzTmFtZSArIGVsLnNyYyArIGVsLmhyZWYgKyBlbC50ZXh0Q29udGVudCxcbiAgICAgIGkgPSBzdHIubGVuZ3RoLFxuICAgICAgc3VtID0gMDtcblxuICB3aGlsZSAoaS0tKSB7XG4gICAgc3VtICs9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICB9XG5cbiAgcmV0dXJuIHN1bS50b1N0cmluZygzNik7XG59XG5cbmZ1bmN0aW9uIF9zYXZlSW5wdXRDaGVja2VkU3RhdGUocm9vdCkge1xuICBzYXZlZElucHV0Q2hlY2tlZC5sZW5ndGggPSAwO1xuICB2YXIgaW5wdXRzID0gcm9vdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKTtcbiAgdmFyIGlkeCA9IGlucHV0cy5sZW5ndGg7XG5cbiAgd2hpbGUgKGlkeC0tKSB7XG4gICAgdmFyIGVsID0gaW5wdXRzW2lkeF07XG4gICAgZWwuY2hlY2tlZCAmJiBzYXZlZElucHV0Q2hlY2tlZC5wdXNoKGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfbmV4dFRpY2soZm4pIHtcbiAgcmV0dXJuIHNldFRpbWVvdXQoZm4sIDApO1xufVxuXG5mdW5jdGlvbiBfY2FuY2VsTmV4dFRpY2soaWQpIHtcbiAgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7XG59IC8vIEZpeGVkICM5NzM6XG5cblxuaWYgKGRvY3VtZW50RXhpc3RzKSB7XG4gIG9uKGRvY3VtZW50LCAndG91Y2htb3ZlJywgZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmICgoU29ydGFibGUuYWN0aXZlIHx8IGF3YWl0aW5nRHJhZ1N0YXJ0ZWQpICYmIGV2dC5jYW5jZWxhYmxlKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH0pO1xufSAvLyBFeHBvcnQgdXRpbHNcblxuXG5Tb3J0YWJsZS51dGlscyA9IHtcbiAgb246IG9uLFxuICBvZmY6IG9mZixcbiAgY3NzOiBjc3MsXG4gIGZpbmQ6IGZpbmQsXG4gIGlzOiBmdW5jdGlvbiBpcyhlbCwgc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gISFjbG9zZXN0KGVsLCBzZWxlY3RvciwgZWwsIGZhbHNlKTtcbiAgfSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRocm90dGxlOiB0aHJvdHRsZSxcbiAgY2xvc2VzdDogY2xvc2VzdCxcbiAgdG9nZ2xlQ2xhc3M6IHRvZ2dsZUNsYXNzLFxuICBjbG9uZTogY2xvbmUsXG4gIGluZGV4OiBpbmRleCxcbiAgbmV4dFRpY2s6IF9uZXh0VGljayxcbiAgY2FuY2VsTmV4dFRpY2s6IF9jYW5jZWxOZXh0VGljayxcbiAgZGV0ZWN0RGlyZWN0aW9uOiBfZGV0ZWN0RGlyZWN0aW9uLFxuICBnZXRDaGlsZDogZ2V0Q2hpbGRcbn07XG4vKipcbiAqIEdldCB0aGUgU29ydGFibGUgaW5zdGFuY2Ugb2YgYW4gZWxlbWVudFxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnRcbiAqIEByZXR1cm4ge1NvcnRhYmxlfHVuZGVmaW5lZH0gICAgICAgICBUaGUgaW5zdGFuY2Ugb2YgU29ydGFibGVcbiAqL1xuXG5Tb3J0YWJsZS5nZXQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudFtleHBhbmRvXTtcbn07XG4vKipcbiAqIE1vdW50IGEgcGx1Z2luIHRvIFNvcnRhYmxlXG4gKiBAcGFyYW0gIHsuLi5Tb3J0YWJsZVBsdWdpbnxTb3J0YWJsZVBsdWdpbltdfSBwbHVnaW5zICAgICAgIFBsdWdpbnMgYmVpbmcgbW91bnRlZFxuICovXG5cblxuU29ydGFibGUubW91bnQgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBwbHVnaW5zID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIHBsdWdpbnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICBpZiAocGx1Z2luc1swXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHBsdWdpbnMgPSBwbHVnaW5zWzBdO1xuICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbikge1xuICAgIGlmICghcGx1Z2luLnByb3RvdHlwZSB8fCAhcGx1Z2luLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgdGhyb3cgXCJTb3J0YWJsZTogTW91bnRlZCBwbHVnaW4gbXVzdCBiZSBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLCBub3QgXCIuY29uY2F0KHt9LnRvU3RyaW5nLmNhbGwocGx1Z2luKSk7XG4gICAgfVxuXG4gICAgaWYgKHBsdWdpbi51dGlscykgU29ydGFibGUudXRpbHMgPSBfb2JqZWN0U3ByZWFkKHt9LCBTb3J0YWJsZS51dGlscywgcGx1Z2luLnV0aWxzKTtcbiAgICBQbHVnaW5NYW5hZ2VyLm1vdW50KHBsdWdpbik7XG4gIH0pO1xufTtcbi8qKlxuICogQ3JlYXRlIHNvcnRhYmxlIGluc3RhbmNlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAgZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIFtvcHRpb25zXVxuICovXG5cblxuU29ydGFibGUuY3JlYXRlID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgU29ydGFibGUoZWwsIG9wdGlvbnMpO1xufTsgLy8gRXhwb3J0XG5cblxuU29ydGFibGUudmVyc2lvbiA9IHZlcnNpb247XG5cbnZhciBhdXRvU2Nyb2xscyA9IFtdLFxuICAgIHNjcm9sbEVsLFxuICAgIHNjcm9sbFJvb3RFbCxcbiAgICBzY3JvbGxpbmcgPSBmYWxzZSxcbiAgICBsYXN0QXV0b1Njcm9sbFgsXG4gICAgbGFzdEF1dG9TY3JvbGxZLFxuICAgIHRvdWNoRXZ0JDEsXG4gICAgcG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWw7XG5cbmZ1bmN0aW9uIEF1dG9TY3JvbGxQbHVnaW4oKSB7XG4gIGZ1bmN0aW9uIEF1dG9TY3JvbGwoKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIHNjcm9sbDogdHJ1ZSxcbiAgICAgIHNjcm9sbFNlbnNpdGl2aXR5OiAzMCxcbiAgICAgIHNjcm9sbFNwZWVkOiAxMCxcbiAgICAgIGJ1YmJsZVNjcm9sbDogdHJ1ZVxuICAgIH07IC8vIEJpbmQgYWxsIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgZm9yICh2YXIgZm4gaW4gdGhpcykge1xuICAgICAgaWYgKGZuLmNoYXJBdCgwKSA9PT0gJ18nICYmIHR5cGVvZiB0aGlzW2ZuXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzW2ZuXSA9IHRoaXNbZm5dLmJpbmQodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQXV0b1Njcm9sbC5wcm90b3R5cGUgPSB7XG4gICAgZHJhZ1N0YXJ0ZWQ6IGZ1bmN0aW9uIGRyYWdTdGFydGVkKF9yZWYpIHtcbiAgICAgIHZhciBvcmlnaW5hbEV2ZW50ID0gX3JlZi5vcmlnaW5hbEV2ZW50O1xuXG4gICAgICBpZiAodGhpcy5zb3J0YWJsZS5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgICAgb24oZG9jdW1lbnQsICdkcmFnb3ZlcicsIHRoaXMuX2hhbmRsZUF1dG9TY3JvbGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdXBwb3J0UG9pbnRlcikge1xuICAgICAgICAgIG9uKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgICB9IGVsc2UgaWYgKG9yaWdpbmFsRXZlbnQudG91Y2hlcykge1xuICAgICAgICAgIG9uKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy5faGFuZGxlRmFsbGJhY2tBdXRvU2Nyb2xsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbihkb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGRyYWdPdmVyQ29tcGxldGVkOiBmdW5jdGlvbiBkcmFnT3ZlckNvbXBsZXRlZChfcmVmMikge1xuICAgICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBfcmVmMi5vcmlnaW5hbEV2ZW50O1xuXG4gICAgICAvLyBGb3Igd2hlbiBidWJibGluZyBpcyBjYW5jZWxlZCBhbmQgdXNpbmcgZmFsbGJhY2sgKGZhbGxiYWNrICd0b3VjaG1vdmUnIGFsd2F5cyByZWFjaGVkKVxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZHJhZ092ZXJCdWJibGUgJiYgIW9yaWdpbmFsRXZlbnQucm9vdEVsKSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZUF1dG9TY3JvbGwob3JpZ2luYWxFdmVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkcm9wOiBmdW5jdGlvbiBkcm9wKCkge1xuICAgICAgaWYgKHRoaXMuc29ydGFibGUubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgICAgIG9mZihkb2N1bWVudCwgJ2RyYWdvdmVyJywgdGhpcy5faGFuZGxlQXV0b1Njcm9sbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvZmYoZG9jdW1lbnQsICdwb2ludGVybW92ZScsIHRoaXMuX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbCk7XG4gICAgICAgIG9mZihkb2N1bWVudCwgJ3RvdWNobW92ZScsIHRoaXMuX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbCk7XG4gICAgICAgIG9mZihkb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbCk7XG4gICAgICB9XG5cbiAgICAgIGNsZWFyUG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwoKTtcbiAgICAgIGNsZWFyQXV0b1Njcm9sbHMoKTtcbiAgICAgIGNhbmNlbFRocm90dGxlKCk7XG4gICAgfSxcbiAgICBudWxsaW5nOiBmdW5jdGlvbiBudWxsaW5nKCkge1xuICAgICAgdG91Y2hFdnQkMSA9IHNjcm9sbFJvb3RFbCA9IHNjcm9sbEVsID0gc2Nyb2xsaW5nID0gcG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwgPSBsYXN0QXV0b1Njcm9sbFggPSBsYXN0QXV0b1Njcm9sbFkgPSBudWxsO1xuICAgICAgYXV0b1Njcm9sbHMubGVuZ3RoID0gMDtcbiAgICB9LFxuICAgIF9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGw6IGZ1bmN0aW9uIF9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwoZXZ0KSB7XG4gICAgICB0aGlzLl9oYW5kbGVBdXRvU2Nyb2xsKGV2dCwgdHJ1ZSk7XG4gICAgfSxcbiAgICBfaGFuZGxlQXV0b1Njcm9sbDogZnVuY3Rpb24gX2hhbmRsZUF1dG9TY3JvbGwoZXZ0LCBmYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIHggPSAoZXZ0LnRvdWNoZXMgPyBldnQudG91Y2hlc1swXSA6IGV2dCkuY2xpZW50WCxcbiAgICAgICAgICB5ID0gKGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQpLmNsaWVudFksXG4gICAgICAgICAgZWxlbSA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gICAgICB0b3VjaEV2dCQxID0gZXZ0OyAvLyBJRSBkb2VzIG5vdCBzZWVtIHRvIGhhdmUgbmF0aXZlIGF1dG9zY3JvbGwsXG4gICAgICAvLyBFZGdlJ3MgYXV0b3Njcm9sbCBzZWVtcyB0b28gY29uZGl0aW9uYWwsXG4gICAgICAvLyBNQUNPUyBTYWZhcmkgZG9lcyBub3QgaGF2ZSBhdXRvc2Nyb2xsLFxuICAgICAgLy8gRmlyZWZveCBhbmQgQ2hyb21lIGFyZSBnb29kXG5cbiAgICAgIGlmIChmYWxsYmFjayB8fCBFZGdlIHx8IElFMTFPckxlc3MgfHwgU2FmYXJpKSB7XG4gICAgICAgIGF1dG9TY3JvbGwoZXZ0LCB0aGlzLm9wdGlvbnMsIGVsZW0sIGZhbGxiYWNrKTsgLy8gTGlzdGVuZXIgZm9yIHBvaW50ZXIgZWxlbWVudCBjaGFuZ2VcblxuICAgICAgICB2YXIgb2dFbGVtU2Nyb2xsZXIgPSBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChlbGVtLCB0cnVlKTtcblxuICAgICAgICBpZiAoc2Nyb2xsaW5nICYmICghcG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwgfHwgeCAhPT0gbGFzdEF1dG9TY3JvbGxYIHx8IHkgIT09IGxhc3RBdXRvU2Nyb2xsWSkpIHtcbiAgICAgICAgICBwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCAmJiBjbGVhclBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsKCk7IC8vIERldGVjdCBmb3IgcG9pbnRlciBlbGVtIGNoYW5nZSwgZW11bGF0aW5nIG5hdGl2ZSBEbkQgYmVoYXZpb3VyXG5cbiAgICAgICAgICBwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdFbGVtID0gZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmIChuZXdFbGVtICE9PSBvZ0VsZW1TY3JvbGxlcikge1xuICAgICAgICAgICAgICBvZ0VsZW1TY3JvbGxlciA9IG5ld0VsZW07XG4gICAgICAgICAgICAgIGNsZWFyQXV0b1Njcm9sbHMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXV0b1Njcm9sbChldnQsIF90aGlzLm9wdGlvbnMsIG5ld0VsZW0sIGZhbGxiYWNrKTtcbiAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgbGFzdEF1dG9TY3JvbGxYID0geDtcbiAgICAgICAgICBsYXN0QXV0b1Njcm9sbFkgPSB5O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBEbkQgaXMgZW5hYmxlZCAoYW5kIGJyb3dzZXIgaGFzIGdvb2QgYXV0b3Njcm9sbGluZyksIGZpcnN0IGF1dG9zY3JvbGwgd2lsbCBhbHJlYWR5IHNjcm9sbCwgc28gZ2V0IHBhcmVudCBhdXRvc2Nyb2xsIG9mIGZpcnN0IGF1dG9zY3JvbGxcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYnViYmxlU2Nyb2xsIHx8IGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KGVsZW0sIHRydWUpID09PSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCkpIHtcbiAgICAgICAgICBjbGVhckF1dG9TY3JvbGxzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXV0b1Njcm9sbChldnQsIHRoaXMub3B0aW9ucywgZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoZWxlbSwgZmFsc2UpLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICByZXR1cm4gX2V4dGVuZHMoQXV0b1Njcm9sbCwge1xuICAgIHBsdWdpbk5hbWU6ICdzY3JvbGwnLFxuICAgIGluaXRpYWxpemVCeURlZmF1bHQ6IHRydWVcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyQXV0b1Njcm9sbHMoKSB7XG4gIGF1dG9TY3JvbGxzLmZvckVhY2goZnVuY3Rpb24gKGF1dG9TY3JvbGwpIHtcbiAgICBjbGVhckludGVydmFsKGF1dG9TY3JvbGwucGlkKTtcbiAgfSk7XG4gIGF1dG9TY3JvbGxzID0gW107XG59XG5cbmZ1bmN0aW9uIGNsZWFyUG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwoKSB7XG4gIGNsZWFySW50ZXJ2YWwocG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwpO1xufVxuXG52YXIgYXV0b1Njcm9sbCA9IHRocm90dGxlKGZ1bmN0aW9uIChldnQsIG9wdGlvbnMsIHJvb3RFbCwgaXNGYWxsYmFjaykge1xuICAvLyBCdWc6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTUwNTUyMVxuICBpZiAoIW9wdGlvbnMuc2Nyb2xsKSByZXR1cm47XG4gIHZhciB4ID0gKGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQpLmNsaWVudFgsXG4gICAgICB5ID0gKGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQpLmNsaWVudFksXG4gICAgICBzZW5zID0gb3B0aW9ucy5zY3JvbGxTZW5zaXRpdml0eSxcbiAgICAgIHNwZWVkID0gb3B0aW9ucy5zY3JvbGxTcGVlZCxcbiAgICAgIHdpblNjcm9sbGVyID0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICB2YXIgc2Nyb2xsVGhpc0luc3RhbmNlID0gZmFsc2UsXG4gICAgICBzY3JvbGxDdXN0b21GbjsgLy8gTmV3IHNjcm9sbCByb290LCBzZXQgc2Nyb2xsRWxcblxuICBpZiAoc2Nyb2xsUm9vdEVsICE9PSByb290RWwpIHtcbiAgICBzY3JvbGxSb290RWwgPSByb290RWw7XG4gICAgY2xlYXJBdXRvU2Nyb2xscygpO1xuICAgIHNjcm9sbEVsID0gb3B0aW9ucy5zY3JvbGw7XG4gICAgc2Nyb2xsQ3VzdG9tRm4gPSBvcHRpb25zLnNjcm9sbEZuO1xuXG4gICAgaWYgKHNjcm9sbEVsID09PSB0cnVlKSB7XG4gICAgICBzY3JvbGxFbCA9IGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KHJvb3RFbCwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGxheWVyc091dCA9IDA7XG4gIHZhciBjdXJyZW50UGFyZW50ID0gc2Nyb2xsRWw7XG5cbiAgZG8ge1xuICAgIHZhciBlbCA9IGN1cnJlbnRQYXJlbnQsXG4gICAgICAgIHJlY3QgPSBnZXRSZWN0KGVsKSxcbiAgICAgICAgdG9wID0gcmVjdC50b3AsXG4gICAgICAgIGJvdHRvbSA9IHJlY3QuYm90dG9tLFxuICAgICAgICBsZWZ0ID0gcmVjdC5sZWZ0LFxuICAgICAgICByaWdodCA9IHJlY3QucmlnaHQsXG4gICAgICAgIHdpZHRoID0gcmVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gcmVjdC5oZWlnaHQsXG4gICAgICAgIGNhblNjcm9sbFggPSB2b2lkIDAsXG4gICAgICAgIGNhblNjcm9sbFkgPSB2b2lkIDAsXG4gICAgICAgIHNjcm9sbFdpZHRoID0gZWwuc2Nyb2xsV2lkdGgsXG4gICAgICAgIHNjcm9sbEhlaWdodCA9IGVsLnNjcm9sbEhlaWdodCxcbiAgICAgICAgZWxDU1MgPSBjc3MoZWwpLFxuICAgICAgICBzY3JvbGxQb3NYID0gZWwuc2Nyb2xsTGVmdCxcbiAgICAgICAgc2Nyb2xsUG9zWSA9IGVsLnNjcm9sbFRvcDtcblxuICAgIGlmIChlbCA9PT0gd2luU2Nyb2xsZXIpIHtcbiAgICAgIGNhblNjcm9sbFggPSB3aWR0aCA8IHNjcm9sbFdpZHRoICYmIChlbENTUy5vdmVyZmxvd1ggPT09ICdhdXRvJyB8fCBlbENTUy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnIHx8IGVsQ1NTLm92ZXJmbG93WCA9PT0gJ3Zpc2libGUnKTtcbiAgICAgIGNhblNjcm9sbFkgPSBoZWlnaHQgPCBzY3JvbGxIZWlnaHQgJiYgKGVsQ1NTLm92ZXJmbG93WSA9PT0gJ2F1dG8nIHx8IGVsQ1NTLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcgfHwgZWxDU1Mub3ZlcmZsb3dZID09PSAndmlzaWJsZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYW5TY3JvbGxYID0gd2lkdGggPCBzY3JvbGxXaWR0aCAmJiAoZWxDU1Mub3ZlcmZsb3dYID09PSAnYXV0bycgfHwgZWxDU1Mub3ZlcmZsb3dYID09PSAnc2Nyb2xsJyk7XG4gICAgICBjYW5TY3JvbGxZID0gaGVpZ2h0IDwgc2Nyb2xsSGVpZ2h0ICYmIChlbENTUy5vdmVyZmxvd1kgPT09ICdhdXRvJyB8fCBlbENTUy5vdmVyZmxvd1kgPT09ICdzY3JvbGwnKTtcbiAgICB9XG5cbiAgICB2YXIgdnggPSBjYW5TY3JvbGxYICYmIChNYXRoLmFicyhyaWdodCAtIHgpIDw9IHNlbnMgJiYgc2Nyb2xsUG9zWCArIHdpZHRoIDwgc2Nyb2xsV2lkdGgpIC0gKE1hdGguYWJzKGxlZnQgLSB4KSA8PSBzZW5zICYmICEhc2Nyb2xsUG9zWCk7XG4gICAgdmFyIHZ5ID0gY2FuU2Nyb2xsWSAmJiAoTWF0aC5hYnMoYm90dG9tIC0geSkgPD0gc2VucyAmJiBzY3JvbGxQb3NZICsgaGVpZ2h0IDwgc2Nyb2xsSGVpZ2h0KSAtIChNYXRoLmFicyh0b3AgLSB5KSA8PSBzZW5zICYmICEhc2Nyb2xsUG9zWSk7XG5cbiAgICBpZiAoIWF1dG9TY3JvbGxzW2xheWVyc091dF0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGxheWVyc091dDsgaSsrKSB7XG4gICAgICAgIGlmICghYXV0b1Njcm9sbHNbaV0pIHtcbiAgICAgICAgICBhdXRvU2Nyb2xsc1tpXSA9IHt9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGF1dG9TY3JvbGxzW2xheWVyc091dF0udnggIT0gdnggfHwgYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS52eSAhPSB2eSB8fCBhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLmVsICE9PSBlbCkge1xuICAgICAgYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS5lbCA9IGVsO1xuICAgICAgYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS52eCA9IHZ4O1xuICAgICAgYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS52eSA9IHZ5O1xuICAgICAgY2xlYXJJbnRlcnZhbChhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLnBpZCk7XG5cbiAgICAgIGlmICh2eCAhPSAwIHx8IHZ5ICE9IDApIHtcbiAgICAgICAgc2Nyb2xsVGhpc0luc3RhbmNlID0gdHJ1ZTtcbiAgICAgICAgLyoganNoaW50IGxvb3BmdW5jOnRydWUgKi9cblxuICAgICAgICBhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLnBpZCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBlbXVsYXRlIGRyYWcgb3ZlciBkdXJpbmcgYXV0b3Njcm9sbCAoZmFsbGJhY2spLCBlbXVsYXRpbmcgbmF0aXZlIERuRCBiZWhhdmlvdXJcbiAgICAgICAgICBpZiAoaXNGYWxsYmFjayAmJiB0aGlzLmxheWVyID09PSAwKSB7XG4gICAgICAgICAgICBTb3J0YWJsZS5hY3RpdmUuX29uVG91Y2hNb3ZlKHRvdWNoRXZ0JDEpOyAvLyBUbyBtb3ZlIGdob3N0IGlmIGl0IGlzIHBvc2l0aW9uZWQgYWJzb2x1dGVseVxuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHNjcm9sbE9mZnNldFkgPSBhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS52eSA/IGF1dG9TY3JvbGxzW3RoaXMubGF5ZXJdLnZ5ICogc3BlZWQgOiAwO1xuICAgICAgICAgIHZhciBzY3JvbGxPZmZzZXRYID0gYXV0b1Njcm9sbHNbdGhpcy5sYXllcl0udnggPyBhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS52eCAqIHNwZWVkIDogMDtcblxuICAgICAgICAgIGlmICh0eXBlb2Ygc2Nyb2xsQ3VzdG9tRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChzY3JvbGxDdXN0b21Gbi5jYWxsKFNvcnRhYmxlLmRyYWdnZWQucGFyZW50Tm9kZVtleHBhbmRvXSwgc2Nyb2xsT2Zmc2V0WCwgc2Nyb2xsT2Zmc2V0WSwgZXZ0LCB0b3VjaEV2dCQxLCBhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS5lbCkgIT09ICdjb250aW51ZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHNjcm9sbEJ5KGF1dG9TY3JvbGxzW3RoaXMubGF5ZXJdLmVsLCBzY3JvbGxPZmZzZXRYLCBzY3JvbGxPZmZzZXRZKTtcbiAgICAgICAgfS5iaW5kKHtcbiAgICAgICAgICBsYXllcjogbGF5ZXJzT3V0XG4gICAgICAgIH0pLCAyNCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGF5ZXJzT3V0Kys7XG4gIH0gd2hpbGUgKG9wdGlvbnMuYnViYmxlU2Nyb2xsICYmIGN1cnJlbnRQYXJlbnQgIT09IHdpblNjcm9sbGVyICYmIChjdXJyZW50UGFyZW50ID0gZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoY3VycmVudFBhcmVudCwgZmFsc2UpKSk7XG5cbiAgc2Nyb2xsaW5nID0gc2Nyb2xsVGhpc0luc3RhbmNlOyAvLyBpbiBjYXNlIGFub3RoZXIgZnVuY3Rpb24gY2F0Y2hlcyBzY3JvbGxpbmcgYXMgZmFsc2UgaW4gYmV0d2VlbiB3aGVuIGl0IGlzIG5vdFxufSwgMzApO1xuXG52YXIgZHJvcCA9IGZ1bmN0aW9uIGRyb3AoX3JlZikge1xuICB2YXIgb3JpZ2luYWxFdmVudCA9IF9yZWYub3JpZ2luYWxFdmVudCxcbiAgICAgIHB1dFNvcnRhYmxlID0gX3JlZi5wdXRTb3J0YWJsZSxcbiAgICAgIGRyYWdFbCA9IF9yZWYuZHJhZ0VsLFxuICAgICAgYWN0aXZlU29ydGFibGUgPSBfcmVmLmFjdGl2ZVNvcnRhYmxlLFxuICAgICAgZGlzcGF0Y2hTb3J0YWJsZUV2ZW50ID0gX3JlZi5kaXNwYXRjaFNvcnRhYmxlRXZlbnQsXG4gICAgICBoaWRlR2hvc3RGb3JUYXJnZXQgPSBfcmVmLmhpZGVHaG9zdEZvclRhcmdldCxcbiAgICAgIHVuaGlkZUdob3N0Rm9yVGFyZ2V0ID0gX3JlZi51bmhpZGVHaG9zdEZvclRhcmdldDtcbiAgaWYgKCFvcmlnaW5hbEV2ZW50KSByZXR1cm47XG4gIHZhciB0b1NvcnRhYmxlID0gcHV0U29ydGFibGUgfHwgYWN0aXZlU29ydGFibGU7XG4gIGhpZGVHaG9zdEZvclRhcmdldCgpO1xuICB2YXIgdG91Y2ggPSBvcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIG9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID8gb3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSA6IG9yaWdpbmFsRXZlbnQ7XG4gIHZhciB0YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHRvdWNoLmNsaWVudFgsIHRvdWNoLmNsaWVudFkpO1xuICB1bmhpZGVHaG9zdEZvclRhcmdldCgpO1xuXG4gIGlmICh0b1NvcnRhYmxlICYmICF0b1NvcnRhYmxlLmVsLmNvbnRhaW5zKHRhcmdldCkpIHtcbiAgICBkaXNwYXRjaFNvcnRhYmxlRXZlbnQoJ3NwaWxsJyk7XG4gICAgdGhpcy5vblNwaWxsKHtcbiAgICAgIGRyYWdFbDogZHJhZ0VsLFxuICAgICAgcHV0U29ydGFibGU6IHB1dFNvcnRhYmxlXG4gICAgfSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFJldmVydCgpIHt9XG5cblJldmVydC5wcm90b3R5cGUgPSB7XG4gIHN0YXJ0SW5kZXg6IG51bGwsXG4gIGRyYWdTdGFydDogZnVuY3Rpb24gZHJhZ1N0YXJ0KF9yZWYyKSB7XG4gICAgdmFyIG9sZERyYWdnYWJsZUluZGV4ID0gX3JlZjIub2xkRHJhZ2dhYmxlSW5kZXg7XG4gICAgdGhpcy5zdGFydEluZGV4ID0gb2xkRHJhZ2dhYmxlSW5kZXg7XG4gIH0sXG4gIG9uU3BpbGw6IGZ1bmN0aW9uIG9uU3BpbGwoX3JlZjMpIHtcbiAgICB2YXIgZHJhZ0VsID0gX3JlZjMuZHJhZ0VsLFxuICAgICAgICBwdXRTb3J0YWJsZSA9IF9yZWYzLnB1dFNvcnRhYmxlO1xuICAgIHRoaXMuc29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG5cbiAgICBpZiAocHV0U29ydGFibGUpIHtcbiAgICAgIHB1dFNvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuICAgIH1cblxuICAgIHZhciBuZXh0U2libGluZyA9IGdldENoaWxkKHRoaXMuc29ydGFibGUuZWwsIHRoaXMuc3RhcnRJbmRleCwgdGhpcy5vcHRpb25zKTtcblxuICAgIGlmIChuZXh0U2libGluZykge1xuICAgICAgdGhpcy5zb3J0YWJsZS5lbC5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBuZXh0U2libGluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc29ydGFibGUuZWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcbiAgICB9XG5cbiAgICB0aGlzLnNvcnRhYmxlLmFuaW1hdGVBbGwoKTtcblxuICAgIGlmIChwdXRTb3J0YWJsZSkge1xuICAgICAgcHV0U29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgIH1cbiAgfSxcbiAgZHJvcDogZHJvcFxufTtcblxuX2V4dGVuZHMoUmV2ZXJ0LCB7XG4gIHBsdWdpbk5hbWU6ICdyZXZlcnRPblNwaWxsJ1xufSk7XG5cbmZ1bmN0aW9uIFJlbW92ZSgpIHt9XG5cblJlbW92ZS5wcm90b3R5cGUgPSB7XG4gIG9uU3BpbGw6IGZ1bmN0aW9uIG9uU3BpbGwoX3JlZjQpIHtcbiAgICB2YXIgZHJhZ0VsID0gX3JlZjQuZHJhZ0VsLFxuICAgICAgICBwdXRTb3J0YWJsZSA9IF9yZWY0LnB1dFNvcnRhYmxlO1xuICAgIHZhciBwYXJlbnRTb3J0YWJsZSA9IHB1dFNvcnRhYmxlIHx8IHRoaXMuc29ydGFibGU7XG4gICAgcGFyZW50U29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgZHJhZ0VsLnBhcmVudE5vZGUgJiYgZHJhZ0VsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZHJhZ0VsKTtcbiAgICBwYXJlbnRTb3J0YWJsZS5hbmltYXRlQWxsKCk7XG4gIH0sXG4gIGRyb3A6IGRyb3Bcbn07XG5cbl9leHRlbmRzKFJlbW92ZSwge1xuICBwbHVnaW5OYW1lOiAncmVtb3ZlT25TcGlsbCdcbn0pO1xuXG52YXIgbGFzdFN3YXBFbDtcblxuZnVuY3Rpb24gU3dhcFBsdWdpbigpIHtcbiAgZnVuY3Rpb24gU3dhcCgpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgc3dhcENsYXNzOiAnc29ydGFibGUtc3dhcC1oaWdobGlnaHQnXG4gICAgfTtcbiAgfVxuXG4gIFN3YXAucHJvdG90eXBlID0ge1xuICAgIGRyYWdTdGFydDogZnVuY3Rpb24gZHJhZ1N0YXJ0KF9yZWYpIHtcbiAgICAgIHZhciBkcmFnRWwgPSBfcmVmLmRyYWdFbDtcbiAgICAgIGxhc3RTd2FwRWwgPSBkcmFnRWw7XG4gICAgfSxcbiAgICBkcmFnT3ZlclZhbGlkOiBmdW5jdGlvbiBkcmFnT3ZlclZhbGlkKF9yZWYyKSB7XG4gICAgICB2YXIgY29tcGxldGVkID0gX3JlZjIuY29tcGxldGVkLFxuICAgICAgICAgIHRhcmdldCA9IF9yZWYyLnRhcmdldCxcbiAgICAgICAgICBvbk1vdmUgPSBfcmVmMi5vbk1vdmUsXG4gICAgICAgICAgYWN0aXZlU29ydGFibGUgPSBfcmVmMi5hY3RpdmVTb3J0YWJsZSxcbiAgICAgICAgICBjaGFuZ2VkID0gX3JlZjIuY2hhbmdlZCxcbiAgICAgICAgICBjYW5jZWwgPSBfcmVmMi5jYW5jZWw7XG4gICAgICBpZiAoIWFjdGl2ZVNvcnRhYmxlLm9wdGlvbnMuc3dhcCkgcmV0dXJuO1xuICAgICAgdmFyIGVsID0gdGhpcy5zb3J0YWJsZS5lbCxcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldCAhPT0gZWwpIHtcbiAgICAgICAgdmFyIHByZXZTd2FwRWwgPSBsYXN0U3dhcEVsO1xuXG4gICAgICAgIGlmIChvbk1vdmUodGFyZ2V0KSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0b2dnbGVDbGFzcyh0YXJnZXQsIG9wdGlvbnMuc3dhcENsYXNzLCB0cnVlKTtcbiAgICAgICAgICBsYXN0U3dhcEVsID0gdGFyZ2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhc3RTd2FwRWwgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZXZTd2FwRWwgJiYgcHJldlN3YXBFbCAhPT0gbGFzdFN3YXBFbCkge1xuICAgICAgICAgIHRvZ2dsZUNsYXNzKHByZXZTd2FwRWwsIG9wdGlvbnMuc3dhcENsYXNzLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2hhbmdlZCgpO1xuICAgICAgY29tcGxldGVkKHRydWUpO1xuICAgICAgY2FuY2VsKCk7XG4gICAgfSxcbiAgICBkcm9wOiBmdW5jdGlvbiBkcm9wKF9yZWYzKSB7XG4gICAgICB2YXIgYWN0aXZlU29ydGFibGUgPSBfcmVmMy5hY3RpdmVTb3J0YWJsZSxcbiAgICAgICAgICBwdXRTb3J0YWJsZSA9IF9yZWYzLnB1dFNvcnRhYmxlLFxuICAgICAgICAgIGRyYWdFbCA9IF9yZWYzLmRyYWdFbDtcbiAgICAgIHZhciB0b1NvcnRhYmxlID0gcHV0U29ydGFibGUgfHwgdGhpcy5zb3J0YWJsZTtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgbGFzdFN3YXBFbCAmJiB0b2dnbGVDbGFzcyhsYXN0U3dhcEVsLCBvcHRpb25zLnN3YXBDbGFzcywgZmFsc2UpO1xuXG4gICAgICBpZiAobGFzdFN3YXBFbCAmJiAob3B0aW9ucy5zd2FwIHx8IHB1dFNvcnRhYmxlICYmIHB1dFNvcnRhYmxlLm9wdGlvbnMuc3dhcCkpIHtcbiAgICAgICAgaWYgKGRyYWdFbCAhPT0gbGFzdFN3YXBFbCkge1xuICAgICAgICAgIHRvU29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgICAgICAgaWYgKHRvU29ydGFibGUgIT09IGFjdGl2ZVNvcnRhYmxlKSBhY3RpdmVTb3J0YWJsZS5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcbiAgICAgICAgICBzd2FwTm9kZXMoZHJhZ0VsLCBsYXN0U3dhcEVsKTtcbiAgICAgICAgICB0b1NvcnRhYmxlLmFuaW1hdGVBbGwoKTtcbiAgICAgICAgICBpZiAodG9Tb3J0YWJsZSAhPT0gYWN0aXZlU29ydGFibGUpIGFjdGl2ZVNvcnRhYmxlLmFuaW1hdGVBbGwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbnVsbGluZzogZnVuY3Rpb24gbnVsbGluZygpIHtcbiAgICAgIGxhc3RTd2FwRWwgPSBudWxsO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIF9leHRlbmRzKFN3YXAsIHtcbiAgICBwbHVnaW5OYW1lOiAnc3dhcCcsXG4gICAgZXZlbnRQcm9wZXJ0aWVzOiBmdW5jdGlvbiBldmVudFByb3BlcnRpZXMoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzd2FwSXRlbTogbGFzdFN3YXBFbFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzd2FwTm9kZXMobjEsIG4yKSB7XG4gIHZhciBwMSA9IG4xLnBhcmVudE5vZGUsXG4gICAgICBwMiA9IG4yLnBhcmVudE5vZGUsXG4gICAgICBpMSxcbiAgICAgIGkyO1xuICBpZiAoIXAxIHx8ICFwMiB8fCBwMS5pc0VxdWFsTm9kZShuMikgfHwgcDIuaXNFcXVhbE5vZGUobjEpKSByZXR1cm47XG4gIGkxID0gaW5kZXgobjEpO1xuICBpMiA9IGluZGV4KG4yKTtcblxuICBpZiAocDEuaXNFcXVhbE5vZGUocDIpICYmIGkxIDwgaTIpIHtcbiAgICBpMisrO1xuICB9XG5cbiAgcDEuaW5zZXJ0QmVmb3JlKG4yLCBwMS5jaGlsZHJlbltpMV0pO1xuICBwMi5pbnNlcnRCZWZvcmUobjEsIHAyLmNoaWxkcmVuW2kyXSk7XG59XG5cbnZhciBtdWx0aURyYWdFbGVtZW50cyA9IFtdLFxuICAgIG11bHRpRHJhZ0Nsb25lcyA9IFtdLFxuICAgIGxhc3RNdWx0aURyYWdTZWxlY3QsXG4gICAgLy8gZm9yIHNlbGVjdGlvbiB3aXRoIG1vZGlmaWVyIGtleSBkb3duIChTSElGVClcbm11bHRpRHJhZ1NvcnRhYmxlLFxuICAgIGluaXRpYWxGb2xkaW5nID0gZmFsc2UsXG4gICAgLy8gSW5pdGlhbCBtdWx0aS1kcmFnIGZvbGQgd2hlbiBkcmFnIHN0YXJ0ZWRcbmZvbGRpbmcgPSBmYWxzZSxcbiAgICAvLyBGb2xkaW5nIGFueSBvdGhlciB0aW1lXG5kcmFnU3RhcnRlZCA9IGZhbHNlLFxuICAgIGRyYWdFbCQxLFxuICAgIGNsb25lc0Zyb21SZWN0LFxuICAgIGNsb25lc0hpZGRlbjtcblxuZnVuY3Rpb24gTXVsdGlEcmFnUGx1Z2luKCkge1xuICBmdW5jdGlvbiBNdWx0aURyYWcoc29ydGFibGUpIHtcbiAgICAvLyBCaW5kIGFsbCBwcml2YXRlIG1ldGhvZHNcbiAgICBmb3IgKHZhciBmbiBpbiB0aGlzKSB7XG4gICAgICBpZiAoZm4uY2hhckF0KDApID09PSAnXycgJiYgdHlwZW9mIHRoaXNbZm5dID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXNbZm5dID0gdGhpc1tmbl0uYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc29ydGFibGUub3B0aW9ucy5zdXBwb3J0UG9pbnRlcikge1xuICAgICAgb24oZG9jdW1lbnQsICdwb2ludGVydXAnLCB0aGlzLl9kZXNlbGVjdE11bHRpRHJhZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uKGRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgIG9uKGRvY3VtZW50LCAndG91Y2hlbmQnLCB0aGlzLl9kZXNlbGVjdE11bHRpRHJhZyk7XG4gICAgfVxuXG4gICAgb24oZG9jdW1lbnQsICdrZXlkb3duJywgdGhpcy5fY2hlY2tLZXlEb3duKTtcbiAgICBvbihkb2N1bWVudCwgJ2tleXVwJywgdGhpcy5fY2hlY2tLZXlVcCk7XG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIHNlbGVjdGVkQ2xhc3M6ICdzb3J0YWJsZS1zZWxlY3RlZCcsXG4gICAgICBtdWx0aURyYWdLZXk6IG51bGwsXG4gICAgICBzZXREYXRhOiBmdW5jdGlvbiBzZXREYXRhKGRhdGFUcmFuc2ZlciwgZHJhZ0VsKSB7XG4gICAgICAgIHZhciBkYXRhID0gJyc7XG5cbiAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCAmJiBtdWx0aURyYWdTb3J0YWJsZSA9PT0gc29ydGFibGUpIHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50LCBpKSB7XG4gICAgICAgICAgICBkYXRhICs9ICghaSA/ICcnIDogJywgJykgKyBtdWx0aURyYWdFbGVtZW50LnRleHRDb250ZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEgPSBkcmFnRWwudGV4dENvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhVHJhbnNmZXIuc2V0RGF0YSgnVGV4dCcsIGRhdGEpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBNdWx0aURyYWcucHJvdG90eXBlID0ge1xuICAgIG11bHRpRHJhZ0tleURvd246IGZhbHNlLFxuICAgIGlzTXVsdGlEcmFnOiBmYWxzZSxcbiAgICBkZWxheVN0YXJ0R2xvYmFsOiBmdW5jdGlvbiBkZWxheVN0YXJ0R2xvYmFsKF9yZWYpIHtcbiAgICAgIHZhciBkcmFnZ2VkID0gX3JlZi5kcmFnRWw7XG4gICAgICBkcmFnRWwkMSA9IGRyYWdnZWQ7XG4gICAgfSxcbiAgICBkZWxheUVuZGVkOiBmdW5jdGlvbiBkZWxheUVuZGVkKCkge1xuICAgICAgdGhpcy5pc011bHRpRHJhZyA9IH5tdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKGRyYWdFbCQxKTtcbiAgICB9LFxuICAgIHNldHVwQ2xvbmU6IGZ1bmN0aW9uIHNldHVwQ2xvbmUoX3JlZjIpIHtcbiAgICAgIHZhciBzb3J0YWJsZSA9IF9yZWYyLnNvcnRhYmxlLFxuICAgICAgICAgIGNhbmNlbCA9IF9yZWYyLmNhbmNlbDtcbiAgICAgIGlmICghdGhpcy5pc011bHRpRHJhZykgcmV0dXJuO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG11bHRpRHJhZ0Nsb25lcy5wdXNoKGNsb25lKG11bHRpRHJhZ0VsZW1lbnRzW2ldKSk7XG4gICAgICAgIG11bHRpRHJhZ0Nsb25lc1tpXS5zb3J0YWJsZUluZGV4ID0gbXVsdGlEcmFnRWxlbWVudHNbaV0uc29ydGFibGVJbmRleDtcbiAgICAgICAgbXVsdGlEcmFnQ2xvbmVzW2ldLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBtdWx0aURyYWdDbG9uZXNbaV0uc3R5bGVbJ3dpbGwtY2hhbmdlJ10gPSAnJztcbiAgICAgICAgdG9nZ2xlQ2xhc3MobXVsdGlEcmFnQ2xvbmVzW2ldLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgZmFsc2UpO1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50c1tpXSA9PT0gZHJhZ0VsJDEgJiYgdG9nZ2xlQ2xhc3MobXVsdGlEcmFnQ2xvbmVzW2ldLCB0aGlzLm9wdGlvbnMuY2hvc2VuQ2xhc3MsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgc29ydGFibGUuX2hpZGVDbG9uZSgpO1xuXG4gICAgICBjYW5jZWwoKTtcbiAgICB9LFxuICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZShfcmVmMykge1xuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjMuc29ydGFibGUsXG4gICAgICAgICAgcm9vdEVsID0gX3JlZjMucm9vdEVsLFxuICAgICAgICAgIGRpc3BhdGNoU29ydGFibGVFdmVudCA9IF9yZWYzLmRpc3BhdGNoU29ydGFibGVFdmVudCxcbiAgICAgICAgICBjYW5jZWwgPSBfcmVmMy5jYW5jZWw7XG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcpIHJldHVybjtcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlQ2xvbmVPbkhpZGUpIHtcbiAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCAmJiBtdWx0aURyYWdTb3J0YWJsZSA9PT0gc29ydGFibGUpIHtcbiAgICAgICAgICBpbnNlcnRNdWx0aURyYWdDbG9uZXModHJ1ZSwgcm9vdEVsKTtcbiAgICAgICAgICBkaXNwYXRjaFNvcnRhYmxlRXZlbnQoJ2Nsb25lJyk7XG4gICAgICAgICAgY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNob3dDbG9uZTogZnVuY3Rpb24gc2hvd0Nsb25lKF9yZWY0KSB7XG4gICAgICB2YXIgY2xvbmVOb3dTaG93biA9IF9yZWY0LmNsb25lTm93U2hvd24sXG4gICAgICAgICAgcm9vdEVsID0gX3JlZjQucm9vdEVsLFxuICAgICAgICAgIGNhbmNlbCA9IF9yZWY0LmNhbmNlbDtcbiAgICAgIGlmICghdGhpcy5pc011bHRpRHJhZykgcmV0dXJuO1xuICAgICAgaW5zZXJ0TXVsdGlEcmFnQ2xvbmVzKGZhbHNlLCByb290RWwpO1xuICAgICAgbXVsdGlEcmFnQ2xvbmVzLmZvckVhY2goZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgIGNzcyhjbG9uZSwgJ2Rpc3BsYXknLCAnJyk7XG4gICAgICB9KTtcbiAgICAgIGNsb25lTm93U2hvd24oKTtcbiAgICAgIGNsb25lc0hpZGRlbiA9IGZhbHNlO1xuICAgICAgY2FuY2VsKCk7XG4gICAgfSxcbiAgICBoaWRlQ2xvbmU6IGZ1bmN0aW9uIGhpZGVDbG9uZShfcmVmNSkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjUuc29ydGFibGUsXG4gICAgICAgICAgY2xvbmVOb3dIaWRkZW4gPSBfcmVmNS5jbG9uZU5vd0hpZGRlbixcbiAgICAgICAgICBjYW5jZWwgPSBfcmVmNS5jYW5jZWw7XG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcpIHJldHVybjtcbiAgICAgIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSkge1xuICAgICAgICBjc3MoY2xvbmUsICdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5yZW1vdmVDbG9uZU9uSGlkZSAmJiBjbG9uZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgY2xvbmUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY2xvbmVOb3dIaWRkZW4oKTtcbiAgICAgIGNsb25lc0hpZGRlbiA9IHRydWU7XG4gICAgICBjYW5jZWwoKTtcbiAgICB9LFxuICAgIGRyYWdTdGFydEdsb2JhbDogZnVuY3Rpb24gZHJhZ1N0YXJ0R2xvYmFsKF9yZWY2KSB7XG4gICAgICB2YXIgc29ydGFibGUgPSBfcmVmNi5zb3J0YWJsZTtcblxuICAgICAgaWYgKCF0aGlzLmlzTXVsdGlEcmFnICYmIG11bHRpRHJhZ1NvcnRhYmxlKSB7XG4gICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlLm11bHRpRHJhZy5fZGVzZWxlY3RNdWx0aURyYWcoKTtcbiAgICAgIH1cblxuICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50LnNvcnRhYmxlSW5kZXggPSBpbmRleChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgIH0pOyAvLyBTb3J0IG11bHRpLWRyYWcgZWxlbWVudHNcblxuICAgICAgbXVsdGlEcmFnRWxlbWVudHMgPSBtdWx0aURyYWdFbGVtZW50cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLnNvcnRhYmxlSW5kZXggLSBiLnNvcnRhYmxlSW5kZXg7XG4gICAgICB9KTtcbiAgICAgIGRyYWdTdGFydGVkID0gdHJ1ZTtcbiAgICB9LFxuICAgIGRyYWdTdGFydGVkOiBmdW5jdGlvbiBkcmFnU3RhcnRlZChfcmVmNykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciBzb3J0YWJsZSA9IF9yZWY3LnNvcnRhYmxlO1xuICAgICAgaWYgKCF0aGlzLmlzTXVsdGlEcmFnKSByZXR1cm47XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydCkge1xuICAgICAgICAvLyBDYXB0dXJlIHJlY3RzLFxuICAgICAgICAvLyBoaWRlIG11bHRpIGRyYWcgZWxlbWVudHMgKGJ5IHBvc2l0aW9uaW5nIHRoZW0gYWJzb2x1dGUpLFxuICAgICAgICAvLyBzZXQgbXVsdGkgZHJhZyBlbGVtZW50cyByZWN0cyB0byBkcmFnUmVjdCxcbiAgICAgICAgLy8gc2hvdyBtdWx0aSBkcmFnIGVsZW1lbnRzLFxuICAgICAgICAvLyBhbmltYXRlIHRvIHJlY3RzLFxuICAgICAgICAvLyB1bnNldCByZWN0cyAmIHJlbW92ZSBmcm9tIERPTVxuICAgICAgICBzb3J0YWJsZS5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50ID09PSBkcmFnRWwkMSkgcmV0dXJuO1xuICAgICAgICAgICAgY3NzKG11bHRpRHJhZ0VsZW1lbnQsICdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhciBkcmFnUmVjdCA9IGdldFJlY3QoZHJhZ0VsJDEsIGZhbHNlLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAobXVsdGlEcmFnRWxlbWVudCA9PT0gZHJhZ0VsJDEpIHJldHVybjtcbiAgICAgICAgICAgIHNldFJlY3QobXVsdGlEcmFnRWxlbWVudCwgZHJhZ1JlY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZvbGRpbmcgPSB0cnVlO1xuICAgICAgICAgIGluaXRpYWxGb2xkaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzb3J0YWJsZS5hbmltYXRlQWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9sZGluZyA9IGZhbHNlO1xuICAgICAgICBpbml0aWFsRm9sZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChfdGhpczIub3B0aW9ucy5hbmltYXRpb24pIHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICB1bnNldFJlY3QobXVsdGlEcmFnRWxlbWVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gLy8gUmVtb3ZlIGFsbCBhdXhpbGlhcnkgbXVsdGlkcmFnIGl0ZW1zIGZyb20gZWwsIGlmIHNvcnRpbmcgZW5hYmxlZFxuXG5cbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLnNvcnQpIHtcbiAgICAgICAgICByZW1vdmVNdWx0aURyYWdFbGVtZW50cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGRyYWdPdmVyOiBmdW5jdGlvbiBkcmFnT3ZlcihfcmVmOCkge1xuICAgICAgdmFyIHRhcmdldCA9IF9yZWY4LnRhcmdldCxcbiAgICAgICAgICBjb21wbGV0ZWQgPSBfcmVmOC5jb21wbGV0ZWQsXG4gICAgICAgICAgY2FuY2VsID0gX3JlZjguY2FuY2VsO1xuXG4gICAgICBpZiAoZm9sZGluZyAmJiB+bXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZih0YXJnZXQpKSB7XG4gICAgICAgIGNvbXBsZXRlZChmYWxzZSk7XG4gICAgICAgIGNhbmNlbCgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmV2ZXJ0OiBmdW5jdGlvbiByZXZlcnQoX3JlZjkpIHtcbiAgICAgIHZhciBmcm9tU29ydGFibGUgPSBfcmVmOS5mcm9tU29ydGFibGUsXG4gICAgICAgICAgcm9vdEVsID0gX3JlZjkucm9vdEVsLFxuICAgICAgICAgIHNvcnRhYmxlID0gX3JlZjkuc29ydGFibGUsXG4gICAgICAgICAgZHJhZ1JlY3QgPSBfcmVmOS5kcmFnUmVjdDtcblxuICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgLy8gU2V0dXAgdW5mb2xkIGFuaW1hdGlvblxuICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgc29ydGFibGUuYWRkQW5pbWF0aW9uU3RhdGUoe1xuICAgICAgICAgICAgdGFyZ2V0OiBtdWx0aURyYWdFbGVtZW50LFxuICAgICAgICAgICAgcmVjdDogZm9sZGluZyA/IGdldFJlY3QobXVsdGlEcmFnRWxlbWVudCkgOiBkcmFnUmVjdFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHVuc2V0UmVjdChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50LmZyb21SZWN0ID0gZHJhZ1JlY3Q7XG4gICAgICAgICAgZnJvbVNvcnRhYmxlLnJlbW92ZUFuaW1hdGlvblN0YXRlKG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9sZGluZyA9IGZhbHNlO1xuICAgICAgICBpbnNlcnRNdWx0aURyYWdFbGVtZW50cyghdGhpcy5vcHRpb25zLnJlbW92ZUNsb25lT25IaWRlLCByb290RWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZHJhZ092ZXJDb21wbGV0ZWQ6IGZ1bmN0aW9uIGRyYWdPdmVyQ29tcGxldGVkKF9yZWYxMCkge1xuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjEwLnNvcnRhYmxlLFxuICAgICAgICAgIGlzT3duZXIgPSBfcmVmMTAuaXNPd25lcixcbiAgICAgICAgICBpbnNlcnRpb24gPSBfcmVmMTAuaW5zZXJ0aW9uLFxuICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlID0gX3JlZjEwLmFjdGl2ZVNvcnRhYmxlLFxuICAgICAgICAgIHBhcmVudEVsID0gX3JlZjEwLnBhcmVudEVsLFxuICAgICAgICAgIHB1dFNvcnRhYmxlID0gX3JlZjEwLnB1dFNvcnRhYmxlO1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgIGlmIChpbnNlcnRpb24pIHtcbiAgICAgICAgLy8gQ2xvbmVzIG11c3QgYmUgaGlkZGVuIGJlZm9yZSBmb2xkaW5nIGFuaW1hdGlvbiB0byBjYXB0dXJlIGRyYWdSZWN0QWJzb2x1dGUgcHJvcGVybHlcbiAgICAgICAgaWYgKGlzT3duZXIpIHtcbiAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5faGlkZUNsb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0aWFsRm9sZGluZyA9IGZhbHNlOyAvLyBJZiBsZWF2aW5nIHNvcnQ6ZmFsc2Ugcm9vdCwgb3IgYWxyZWFkeSBmb2xkaW5nIC0gRm9sZCB0byBuZXcgbG9jYXRpb25cblxuICAgICAgICBpZiAob3B0aW9ucy5hbmltYXRpb24gJiYgbXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoID4gMSAmJiAoZm9sZGluZyB8fCAhaXNPd25lciAmJiAhYWN0aXZlU29ydGFibGUub3B0aW9ucy5zb3J0ICYmICFwdXRTb3J0YWJsZSkpIHtcbiAgICAgICAgICAvLyBGb2xkOiBTZXQgYWxsIG11bHRpIGRyYWcgZWxlbWVudHMncyByZWN0cyB0byBkcmFnRWwncyByZWN0IHdoZW4gbXVsdGktZHJhZyBlbGVtZW50cyBhcmUgaW52aXNpYmxlXG4gICAgICAgICAgdmFyIGRyYWdSZWN0QWJzb2x1dGUgPSBnZXRSZWN0KGRyYWdFbCQxLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnQgPT09IGRyYWdFbCQxKSByZXR1cm47XG4gICAgICAgICAgICBzZXRSZWN0KG11bHRpRHJhZ0VsZW1lbnQsIGRyYWdSZWN0QWJzb2x1dGUpOyAvLyBNb3ZlIGVsZW1lbnQocykgdG8gZW5kIG9mIHBhcmVudEVsIHNvIHRoYXQgaXQgZG9lcyBub3QgaW50ZXJmZXJlIHdpdGggbXVsdGktZHJhZyBjbG9uZXMgaW5zZXJ0aW9uIGlmIHRoZXkgYXJlIGluc2VydGVkXG4gICAgICAgICAgICAvLyB3aGlsZSBmb2xkaW5nLCBhbmQgc28gdGhhdCB3ZSBjYW4gY2FwdHVyZSB0aGVtIGFnYWluIGJlY2F1c2Ugb2xkIHNvcnRhYmxlIHdpbGwgbm8gbG9uZ2VyIGJlIGZyb21Tb3J0YWJsZVxuXG4gICAgICAgICAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmb2xkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSAvLyBDbG9uZXMgbXVzdCBiZSBzaG93biAoYW5kIGNoZWNrIHRvIHJlbW92ZSBtdWx0aSBkcmFncykgYWZ0ZXIgZm9sZGluZyB3aGVuIGludGVyZmVyaW5nIG11bHRpRHJhZ0VsZW1lbnRzIGFyZSBtb3ZlZCBvdXRcblxuXG4gICAgICAgIGlmICghaXNPd25lcikge1xuICAgICAgICAgIC8vIE9ubHkgcmVtb3ZlIGlmIG5vdCBmb2xkaW5nIChmb2xkaW5nIHdpbGwgcmVtb3ZlIHRoZW0gYW55d2F5cylcbiAgICAgICAgICBpZiAoIWZvbGRpbmcpIHtcbiAgICAgICAgICAgIHJlbW92ZU11bHRpRHJhZ0VsZW1lbnRzKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZXNIaWRkZW5CZWZvcmUgPSBjbG9uZXNIaWRkZW47XG5cbiAgICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlLl9zaG93Q2xvbmUoc29ydGFibGUpOyAvLyBVbmZvbGQgYW5pbWF0aW9uIGZvciBjbG9uZXMgaWYgc2hvd2luZyBmcm9tIGhpZGRlblxuXG5cbiAgICAgICAgICAgIGlmIChhY3RpdmVTb3J0YWJsZS5vcHRpb25zLmFuaW1hdGlvbiAmJiAhY2xvbmVzSGlkZGVuICYmIGNsb25lc0hpZGRlbkJlZm9yZSkge1xuICAgICAgICAgICAgICBtdWx0aURyYWdDbG9uZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xvbmUpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5hZGRBbmltYXRpb25TdGF0ZSh7XG4gICAgICAgICAgICAgICAgICB0YXJnZXQ6IGNsb25lLFxuICAgICAgICAgICAgICAgICAgcmVjdDogY2xvbmVzRnJvbVJlY3RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjbG9uZS5mcm9tUmVjdCA9IGNsb25lc0Zyb21SZWN0O1xuICAgICAgICAgICAgICAgIGNsb25lLnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5fc2hvd0Nsb25lKHNvcnRhYmxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGRyYWdPdmVyQW5pbWF0aW9uQ2FwdHVyZTogZnVuY3Rpb24gZHJhZ092ZXJBbmltYXRpb25DYXB0dXJlKF9yZWYxMSkge1xuICAgICAgdmFyIGRyYWdSZWN0ID0gX3JlZjExLmRyYWdSZWN0LFxuICAgICAgICAgIGlzT3duZXIgPSBfcmVmMTEuaXNPd25lcixcbiAgICAgICAgICBhY3RpdmVTb3J0YWJsZSA9IF9yZWYxMS5hY3RpdmVTb3J0YWJsZTtcbiAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgbXVsdGlEcmFnRWxlbWVudC50aGlzQW5pbWF0aW9uRHVyYXRpb24gPSBudWxsO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChhY3RpdmVTb3J0YWJsZS5vcHRpb25zLmFuaW1hdGlvbiAmJiAhaXNPd25lciAmJiBhY3RpdmVTb3J0YWJsZS5tdWx0aURyYWcuaXNNdWx0aURyYWcpIHtcbiAgICAgICAgY2xvbmVzRnJvbVJlY3QgPSBfZXh0ZW5kcyh7fSwgZHJhZ1JlY3QpO1xuICAgICAgICB2YXIgZHJhZ01hdHJpeCA9IG1hdHJpeChkcmFnRWwkMSwgdHJ1ZSk7XG4gICAgICAgIGNsb25lc0Zyb21SZWN0LnRvcCAtPSBkcmFnTWF0cml4LmY7XG4gICAgICAgIGNsb25lc0Zyb21SZWN0LmxlZnQgLT0gZHJhZ01hdHJpeC5lO1xuICAgICAgfVxuICAgIH0sXG4gICAgZHJhZ092ZXJBbmltYXRpb25Db21wbGV0ZTogZnVuY3Rpb24gZHJhZ092ZXJBbmltYXRpb25Db21wbGV0ZSgpIHtcbiAgICAgIGlmIChmb2xkaW5nKSB7XG4gICAgICAgIGZvbGRpbmcgPSBmYWxzZTtcbiAgICAgICAgcmVtb3ZlTXVsdGlEcmFnRWxlbWVudHMoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRyb3A6IGZ1bmN0aW9uIGRyb3AoX3JlZjEyKSB7XG4gICAgICB2YXIgZXZ0ID0gX3JlZjEyLm9yaWdpbmFsRXZlbnQsXG4gICAgICAgICAgcm9vdEVsID0gX3JlZjEyLnJvb3RFbCxcbiAgICAgICAgICBwYXJlbnRFbCA9IF9yZWYxMi5wYXJlbnRFbCxcbiAgICAgICAgICBzb3J0YWJsZSA9IF9yZWYxMi5zb3J0YWJsZSxcbiAgICAgICAgICBkaXNwYXRjaFNvcnRhYmxlRXZlbnQgPSBfcmVmMTIuZGlzcGF0Y2hTb3J0YWJsZUV2ZW50LFxuICAgICAgICAgIG9sZEluZGV4ID0gX3JlZjEyLm9sZEluZGV4LFxuICAgICAgICAgIHB1dFNvcnRhYmxlID0gX3JlZjEyLnB1dFNvcnRhYmxlO1xuICAgICAgdmFyIHRvU29ydGFibGUgPSBwdXRTb3J0YWJsZSB8fCB0aGlzLnNvcnRhYmxlO1xuICAgICAgaWYgKCFldnQpIHJldHVybjtcbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGNoaWxkcmVuID0gcGFyZW50RWwuY2hpbGRyZW47IC8vIE11bHRpLWRyYWcgc2VsZWN0aW9uXG5cbiAgICAgIGlmICghZHJhZ1N0YXJ0ZWQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMubXVsdGlEcmFnS2V5ICYmICF0aGlzLm11bHRpRHJhZ0tleURvd24pIHtcbiAgICAgICAgICB0aGlzLl9kZXNlbGVjdE11bHRpRHJhZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlQ2xhc3MoZHJhZ0VsJDEsIG9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgIX5tdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKGRyYWdFbCQxKSk7XG5cbiAgICAgICAgaWYgKCF+bXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihkcmFnRWwkMSkpIHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5wdXNoKGRyYWdFbCQxKTtcbiAgICAgICAgICBkaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgIHNvcnRhYmxlOiBzb3J0YWJsZSxcbiAgICAgICAgICAgIHJvb3RFbDogcm9vdEVsLFxuICAgICAgICAgICAgbmFtZTogJ3NlbGVjdCcsXG4gICAgICAgICAgICB0YXJnZXRFbDogZHJhZ0VsJDEsXG4gICAgICAgICAgICBvcmlnaW5hbEV2dDogZXZ0XG4gICAgICAgICAgfSk7IC8vIE1vZGlmaWVyIGFjdGl2YXRlZCwgc2VsZWN0IGZyb20gbGFzdCB0byBkcmFnRWxcblxuICAgICAgICAgIGlmIChldnQuc2hpZnRLZXkgJiYgbGFzdE11bHRpRHJhZ1NlbGVjdCAmJiBzb3J0YWJsZS5lbC5jb250YWlucyhsYXN0TXVsdGlEcmFnU2VsZWN0KSkge1xuICAgICAgICAgICAgdmFyIGxhc3RJbmRleCA9IGluZGV4KGxhc3RNdWx0aURyYWdTZWxlY3QpLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGluZGV4KGRyYWdFbCQxKTtcblxuICAgICAgICAgICAgaWYgKH5sYXN0SW5kZXggJiYgfmN1cnJlbnRJbmRleCAmJiBsYXN0SW5kZXggIT09IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgICAgICAvLyBNdXN0IGluY2x1ZGUgbGFzdE11bHRpRHJhZ1NlbGVjdCAoc2VsZWN0IGl0KSwgaW4gY2FzZSBtb2RpZmllZCBzZWxlY3Rpb24gZnJvbSBubyBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgLy8gKGJ1dCBwcmV2aW91cyBzZWxlY3Rpb24gZXhpc3RlZClcbiAgICAgICAgICAgICAgdmFyIG4sIGk7XG5cbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IGxhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgIGkgPSBsYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgbiA9IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpID0gY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgIG4gPSBsYXN0SW5kZXggKyAxO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZm9yICg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAofm11bHRpRHJhZ0VsZW1lbnRzLmluZGV4T2YoY2hpbGRyZW5baV0pKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB0b2dnbGVDbGFzcyhjaGlsZHJlbltpXSwgb3B0aW9ucy5zZWxlY3RlZENsYXNzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5wdXNoKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgICAgIHNvcnRhYmxlOiBzb3J0YWJsZSxcbiAgICAgICAgICAgICAgICAgIHJvb3RFbDogcm9vdEVsLFxuICAgICAgICAgICAgICAgICAgbmFtZTogJ3NlbGVjdCcsXG4gICAgICAgICAgICAgICAgICB0YXJnZXRFbDogY2hpbGRyZW5baV0sXG4gICAgICAgICAgICAgICAgICBvcmlnaW5hbEV2dDogZXZ0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFzdE11bHRpRHJhZ1NlbGVjdCA9IGRyYWdFbCQxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlID0gdG9Tb3J0YWJsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5zcGxpY2UobXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihkcmFnRWwkMSksIDEpO1xuICAgICAgICAgIGxhc3RNdWx0aURyYWdTZWxlY3QgPSBudWxsO1xuICAgICAgICAgIGRpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlLFxuICAgICAgICAgICAgcm9vdEVsOiByb290RWwsXG4gICAgICAgICAgICBuYW1lOiAnZGVzZWxlY3QnLFxuICAgICAgICAgICAgdGFyZ2V0RWw6IGRyYWdFbCQxLFxuICAgICAgICAgICAgb3JpZ2luYWxFdnQ6IGV2dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IC8vIE11bHRpLWRyYWcgZHJvcFxuXG5cbiAgICAgIGlmIChkcmFnU3RhcnRlZCAmJiB0aGlzLmlzTXVsdGlEcmFnKSB7XG4gICAgICAgIC8vIERvIG5vdCBcInVuZm9sZFwiIGFmdGVyIGFyb3VuZCBkcmFnRWwgaWYgcmV2ZXJ0ZWRcbiAgICAgICAgaWYgKChwYXJlbnRFbFtleHBhbmRvXS5vcHRpb25zLnNvcnQgfHwgcGFyZW50RWwgIT09IHJvb3RFbCkgJiYgbXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHZhciBkcmFnUmVjdCA9IGdldFJlY3QoZHJhZ0VsJDEpLFxuICAgICAgICAgICAgICBtdWx0aURyYWdJbmRleCA9IGluZGV4KGRyYWdFbCQxLCAnOm5vdCguJyArIHRoaXMub3B0aW9ucy5zZWxlY3RlZENsYXNzICsgJyknKTtcbiAgICAgICAgICBpZiAoIWluaXRpYWxGb2xkaW5nICYmIG9wdGlvbnMuYW5pbWF0aW9uKSBkcmFnRWwkMS50aGlzQW5pbWF0aW9uRHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgIHRvU29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG5cbiAgICAgICAgICBpZiAoIWluaXRpYWxGb2xkaW5nKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgZHJhZ0VsJDEuZnJvbVJlY3QgPSBkcmFnUmVjdDtcbiAgICAgICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnQudGhpc0FuaW1hdGlvbkR1cmF0aW9uID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50ICE9PSBkcmFnRWwkMSkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJlY3QgPSBmb2xkaW5nID8gZ2V0UmVjdChtdWx0aURyYWdFbGVtZW50KSA6IGRyYWdSZWN0O1xuICAgICAgICAgICAgICAgICAgbXVsdGlEcmFnRWxlbWVudC5mcm9tUmVjdCA9IHJlY3Q7IC8vIFByZXBhcmUgdW5mb2xkIGFuaW1hdGlvblxuXG4gICAgICAgICAgICAgICAgICB0b1NvcnRhYmxlLmFkZEFuaW1hdGlvblN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBtdWx0aURyYWdFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICByZWN0OiByZWN0XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSAvLyBNdWx0aSBkcmFnIGVsZW1lbnRzIGFyZSBub3QgbmVjZXNzYXJpbHkgcmVtb3ZlZCBmcm9tIHRoZSBET00gb24gZHJvcCwgc28gdG8gcmVpbnNlcnRcbiAgICAgICAgICAgIC8vIHByb3Blcmx5IHRoZXkgbXVzdCBhbGwgYmUgcmVtb3ZlZFxuXG5cbiAgICAgICAgICAgIHJlbW92ZU11bHRpRHJhZ0VsZW1lbnRzKCk7XG4gICAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICAgIGlmIChjaGlsZHJlblttdWx0aURyYWdJbmRleF0pIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRFbC5pbnNlcnRCZWZvcmUobXVsdGlEcmFnRWxlbWVudCwgY2hpbGRyZW5bbXVsdGlEcmFnSW5kZXhdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG11bHRpRHJhZ0luZGV4Kys7XG4gICAgICAgICAgICB9KTsgLy8gSWYgaW5pdGlhbCBmb2xkaW5nIGlzIGRvbmUsIHRoZSBlbGVtZW50cyBtYXkgaGF2ZSBjaGFuZ2VkIHBvc2l0aW9uIGJlY2F1c2UgdGhleSBhcmUgbm93XG4gICAgICAgICAgICAvLyB1bmZvbGRpbmcgYXJvdW5kIGRyYWdFbCwgZXZlbiB0aG91Z2ggZHJhZ0VsIG1heSBub3QgaGF2ZSBoaXMgaW5kZXggY2hhbmdlZCwgc28gdXBkYXRlIGV2ZW50XG4gICAgICAgICAgICAvLyBtdXN0IGJlIGZpcmVkIGhlcmUgYXMgU29ydGFibGUgd2lsbCBub3QuXG5cbiAgICAgICAgICAgIGlmIChvbGRJbmRleCA9PT0gaW5kZXgoZHJhZ0VsJDEpKSB7XG4gICAgICAgICAgICAgIHZhciB1cGRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50LnNvcnRhYmxlSW5kZXggIT09IGluZGV4KG11bHRpRHJhZ0VsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICB1cGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKHVwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoU29ydGFibGVFdmVudCgndXBkYXRlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IC8vIE11c3QgYmUgZG9uZSBhZnRlciBjYXB0dXJpbmcgaW5kaXZpZHVhbCByZWN0cyAoc2Nyb2xsIGJhcilcblxuXG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgdW5zZXRSZWN0KG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRvU29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXVsdGlEcmFnU29ydGFibGUgPSB0b1NvcnRhYmxlO1xuICAgICAgfSAvLyBSZW1vdmUgY2xvbmVzIGlmIG5lY2Vzc2FyeVxuXG5cbiAgICAgIGlmIChyb290RWwgPT09IHBhcmVudEVsIHx8IHB1dFNvcnRhYmxlICYmIHB1dFNvcnRhYmxlLmxhc3RQdXRNb2RlICE9PSAnY2xvbmUnKSB7XG4gICAgICAgIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSkge1xuICAgICAgICAgIGNsb25lLnBhcmVudE5vZGUgJiYgY2xvbmUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgbnVsbGluZ0dsb2JhbDogZnVuY3Rpb24gbnVsbGluZ0dsb2JhbCgpIHtcbiAgICAgIHRoaXMuaXNNdWx0aURyYWcgPSBkcmFnU3RhcnRlZCA9IGZhbHNlO1xuICAgICAgbXVsdGlEcmFnQ2xvbmVzLmxlbmd0aCA9IDA7XG4gICAgfSxcbiAgICBkZXN0cm95R2xvYmFsOiBmdW5jdGlvbiBkZXN0cm95R2xvYmFsKCkge1xuICAgICAgdGhpcy5fZGVzZWxlY3RNdWx0aURyYWcoKTtcblxuICAgICAgb2ZmKGRvY3VtZW50LCAncG9pbnRlcnVwJywgdGhpcy5fZGVzZWxlY3RNdWx0aURyYWcpO1xuICAgICAgb2ZmKGRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fZGVzZWxlY3RNdWx0aURyYWcpO1xuICAgICAgb2ZmKGRvY3VtZW50LCAna2V5ZG93bicsIHRoaXMuX2NoZWNrS2V5RG93bik7XG4gICAgICBvZmYoZG9jdW1lbnQsICdrZXl1cCcsIHRoaXMuX2NoZWNrS2V5VXApO1xuICAgIH0sXG4gICAgX2Rlc2VsZWN0TXVsdGlEcmFnOiBmdW5jdGlvbiBfZGVzZWxlY3RNdWx0aURyYWcoZXZ0KSB7XG4gICAgICBpZiAodHlwZW9mIGRyYWdTdGFydGVkICE9PSBcInVuZGVmaW5lZFwiICYmIGRyYWdTdGFydGVkKSByZXR1cm47IC8vIE9ubHkgZGVzZWxlY3QgaWYgc2VsZWN0aW9uIGlzIGluIHRoaXMgc29ydGFibGVcblxuICAgICAgaWYgKG11bHRpRHJhZ1NvcnRhYmxlICE9PSB0aGlzLnNvcnRhYmxlKSByZXR1cm47IC8vIE9ubHkgZGVzZWxlY3QgaWYgdGFyZ2V0IGlzIG5vdCBpdGVtIGluIHRoaXMgc29ydGFibGVcblxuICAgICAgaWYgKGV2dCAmJiBjbG9zZXN0KGV2dC50YXJnZXQsIHRoaXMub3B0aW9ucy5kcmFnZ2FibGUsIHRoaXMuc29ydGFibGUuZWwsIGZhbHNlKSkgcmV0dXJuOyAvLyBPbmx5IGRlc2VsZWN0IGlmIGxlZnQgY2xpY2tcblxuICAgICAgaWYgKGV2dCAmJiBldnQuYnV0dG9uICE9PSAwKSByZXR1cm47XG5cbiAgICAgIHdoaWxlIChtdWx0aURyYWdFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGVsID0gbXVsdGlEcmFnRWxlbWVudHNbMF07XG4gICAgICAgIHRvZ2dsZUNsYXNzKGVsLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgZmFsc2UpO1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5zaGlmdCgpO1xuICAgICAgICBkaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICBzb3J0YWJsZTogdGhpcy5zb3J0YWJsZSxcbiAgICAgICAgICByb290RWw6IHRoaXMuc29ydGFibGUuZWwsXG4gICAgICAgICAgbmFtZTogJ2Rlc2VsZWN0JyxcbiAgICAgICAgICB0YXJnZXRFbDogZWwsXG4gICAgICAgICAgb3JpZ2luYWxFdnQ6IGV2dFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9jaGVja0tleURvd246IGZ1bmN0aW9uIF9jaGVja0tleURvd24oZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gdGhpcy5vcHRpb25zLm11bHRpRHJhZ0tleSkge1xuICAgICAgICB0aGlzLm11bHRpRHJhZ0tleURvd24gPSB0cnVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgX2NoZWNrS2V5VXA6IGZ1bmN0aW9uIF9jaGVja0tleVVwKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXkgPT09IHRoaXMub3B0aW9ucy5tdWx0aURyYWdLZXkpIHtcbiAgICAgICAgdGhpcy5tdWx0aURyYWdLZXlEb3duID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICByZXR1cm4gX2V4dGVuZHMoTXVsdGlEcmFnLCB7XG4gICAgLy8gU3RhdGljIG1ldGhvZHMgJiBwcm9wZXJ0aWVzXG4gICAgcGx1Z2luTmFtZTogJ211bHRpRHJhZycsXG4gICAgdXRpbHM6IHtcbiAgICAgIC8qKlxyXG4gICAgICAgKiBTZWxlY3RzIHRoZSBwcm92aWRlZCBtdWx0aS1kcmFnIGl0ZW1cclxuICAgICAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsICAgIFRoZSBlbGVtZW50IHRvIGJlIHNlbGVjdGVkXHJcbiAgICAgICAqL1xuICAgICAgc2VsZWN0OiBmdW5jdGlvbiBzZWxlY3QoZWwpIHtcbiAgICAgICAgdmFyIHNvcnRhYmxlID0gZWwucGFyZW50Tm9kZVtleHBhbmRvXTtcbiAgICAgICAgaWYgKCFzb3J0YWJsZSB8fCAhc29ydGFibGUub3B0aW9ucy5tdWx0aURyYWcgfHwgfm11bHRpRHJhZ0VsZW1lbnRzLmluZGV4T2YoZWwpKSByZXR1cm47XG5cbiAgICAgICAgaWYgKG11bHRpRHJhZ1NvcnRhYmxlICYmIG11bHRpRHJhZ1NvcnRhYmxlICE9PSBzb3J0YWJsZSkge1xuICAgICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlLm11bHRpRHJhZy5fZGVzZWxlY3RNdWx0aURyYWcoKTtcblxuICAgICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlID0gc29ydGFibGU7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVDbGFzcyhlbCwgc29ydGFibGUub3B0aW9ucy5zZWxlY3RlZENsYXNzLCB0cnVlKTtcbiAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMucHVzaChlbCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcclxuICAgICAgICogRGVzZWxlY3RzIHRoZSBwcm92aWRlZCBtdWx0aS1kcmFnIGl0ZW1cclxuICAgICAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsICAgIFRoZSBlbGVtZW50IHRvIGJlIGRlc2VsZWN0ZWRcclxuICAgICAgICovXG4gICAgICBkZXNlbGVjdDogZnVuY3Rpb24gZGVzZWxlY3QoZWwpIHtcbiAgICAgICAgdmFyIHNvcnRhYmxlID0gZWwucGFyZW50Tm9kZVtleHBhbmRvXSxcbiAgICAgICAgICAgIGluZGV4ID0gbXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihlbCk7XG4gICAgICAgIGlmICghc29ydGFibGUgfHwgIXNvcnRhYmxlLm9wdGlvbnMubXVsdGlEcmFnIHx8ICF+aW5kZXgpIHJldHVybjtcbiAgICAgICAgdG9nZ2xlQ2xhc3MoZWwsIHNvcnRhYmxlLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgZmFsc2UpO1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZXZlbnRQcm9wZXJ0aWVzOiBmdW5jdGlvbiBldmVudFByb3BlcnRpZXMoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIG9sZEluZGljaWVzID0gW10sXG4gICAgICAgICAgbmV3SW5kaWNpZXMgPSBbXTtcbiAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgb2xkSW5kaWNpZXMucHVzaCh7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudDogbXVsdGlEcmFnRWxlbWVudCxcbiAgICAgICAgICBpbmRleDogbXVsdGlEcmFnRWxlbWVudC5zb3J0YWJsZUluZGV4XG4gICAgICAgIH0pOyAvLyBtdWx0aURyYWdFbGVtZW50cyB3aWxsIGFscmVhZHkgYmUgc29ydGVkIGlmIGZvbGRpbmdcblxuICAgICAgICB2YXIgbmV3SW5kZXg7XG5cbiAgICAgICAgaWYgKGZvbGRpbmcgJiYgbXVsdGlEcmFnRWxlbWVudCAhPT0gZHJhZ0VsJDEpIHtcbiAgICAgICAgICBuZXdJbmRleCA9IC0xO1xuICAgICAgICB9IGVsc2UgaWYgKGZvbGRpbmcpIHtcbiAgICAgICAgICBuZXdJbmRleCA9IGluZGV4KG11bHRpRHJhZ0VsZW1lbnQsICc6bm90KC4nICsgX3RoaXMzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcyArICcpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3SW5kZXggPSBpbmRleChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0luZGljaWVzLnB1c2goe1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnQ6IG11bHRpRHJhZ0VsZW1lbnQsXG4gICAgICAgICAgaW5kZXg6IG5ld0luZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpdGVtczogX3RvQ29uc3VtYWJsZUFycmF5KG11bHRpRHJhZ0VsZW1lbnRzKSxcbiAgICAgICAgY2xvbmVzOiBbXS5jb25jYXQobXVsdGlEcmFnQ2xvbmVzKSxcbiAgICAgICAgb2xkSW5kaWNpZXM6IG9sZEluZGljaWVzLFxuICAgICAgICBuZXdJbmRpY2llczogbmV3SW5kaWNpZXNcbiAgICAgIH07XG4gICAgfSxcbiAgICBvcHRpb25MaXN0ZW5lcnM6IHtcbiAgICAgIG11bHRpRHJhZ0tleTogZnVuY3Rpb24gbXVsdGlEcmFnS2V5KGtleSkge1xuICAgICAgICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoa2V5ID09PSAnY3RybCcpIHtcbiAgICAgICAgICBrZXkgPSAnQ29udHJvbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBrZXkgPSBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXkuc3Vic3RyKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRNdWx0aURyYWdFbGVtZW50cyhjbG9uZXNJbnNlcnRlZCwgcm9vdEVsKSB7XG4gIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQsIGkpIHtcbiAgICB2YXIgdGFyZ2V0ID0gcm9vdEVsLmNoaWxkcmVuW211bHRpRHJhZ0VsZW1lbnQuc29ydGFibGVJbmRleCArIChjbG9uZXNJbnNlcnRlZCA/IE51bWJlcihpKSA6IDApXTtcblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUobXVsdGlEcmFnRWxlbWVudCwgdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdEVsLmFwcGVuZENoaWxkKG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgIH1cbiAgfSk7XG59XG4vKipcclxuICogSW5zZXJ0IG11bHRpLWRyYWcgY2xvbmVzXHJcbiAqIEBwYXJhbSAge1tCb29sZWFuXX0gZWxlbWVudHNJbnNlcnRlZCAgV2hldGhlciB0aGUgbXVsdGktZHJhZyBlbGVtZW50cyBhcmUgaW5zZXJ0ZWRcclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHJvb3RFbFxyXG4gKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRNdWx0aURyYWdDbG9uZXMoZWxlbWVudHNJbnNlcnRlZCwgcm9vdEVsKSB7XG4gIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSwgaSkge1xuICAgIHZhciB0YXJnZXQgPSByb290RWwuY2hpbGRyZW5bY2xvbmUuc29ydGFibGVJbmRleCArIChlbGVtZW50c0luc2VydGVkID8gTnVtYmVyKGkpIDogMCldO1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShjbG9uZSwgdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdEVsLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW1vdmVNdWx0aURyYWdFbGVtZW50cygpIHtcbiAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgIGlmIChtdWx0aURyYWdFbGVtZW50ID09PSBkcmFnRWwkMSkgcmV0dXJuO1xuICAgIG11bHRpRHJhZ0VsZW1lbnQucGFyZW50Tm9kZSAmJiBtdWx0aURyYWdFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobXVsdGlEcmFnRWxlbWVudCk7XG4gIH0pO1xufVxuXG5Tb3J0YWJsZS5tb3VudChuZXcgQXV0b1Njcm9sbFBsdWdpbigpKTtcblNvcnRhYmxlLm1vdW50KFJlbW92ZSwgUmV2ZXJ0KTtcblxuZXhwb3J0IGRlZmF1bHQgU29ydGFibGU7XG5leHBvcnQgeyBNdWx0aURyYWdQbHVnaW4gYXMgTXVsdGlEcmFnLCBTb3J0YWJsZSwgU3dhcFBsdWdpbiBhcyBTd2FwIH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHRpZiAoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblx0XHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9