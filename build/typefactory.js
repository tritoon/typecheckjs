'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (plugins) {

    // Add useful properties to plugins
    plugins = plugins.map(function (plugin) {
        return defineLockedProperties({ type: type, makeChecker: makeChecker }, plugin);
    });

    return type;

    function type() {
        var test = undefined;

        // If requirement is a legit typecheckjs test, reuse the 'is' method
        // Useful for more complex constructs like .or(), .of(), ...

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (args.length === 1 && isChecker(args[0])) {
            test = args[0];

            // If not, search for a plugin that recognizes the requirement
        } else {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {

                    for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var plugin = _step.value;

                        // Get a test. If none is found, should return `false`
                        try {
                            test = plugin.getTest.apply(plugin, args);

                            // Plugin threw error
                        } catch (originalError) {
                            var err = new Error('Plugin ' + plugin.name + ' threw an error');
                            err.original = originalError;
                            throw err;
                        }

                        // Found test, now ensure it is well-formatted and break
                        if (test !== false) {
                            if (!isChecker(test)) {
                                if ((typeof plugin === 'undefined' ? 'undefined' : _typeof(plugin)) === 'object') {
                                    throw new Error('Typecheckjs plugin ' + plugin.name + ' has failed');
                                } else {
                                    throw new Error('Typecheckjs plugin has failed');
                                }
                            } else break;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (test === false) throw new Error('No plugins recognized requirement');
            }

        return _extends({}, test, {
            or: makeOr(test)
        });
    }

    // Defined inside this function since it needs access to type and vice versa
    function makeOr(test1) {
        return function (req2) {

            var test = function test(x) {
                return test1.is(x) || type(req2).is(x);
            };

            return makeChecker(test, { or: makeOr(test) });
        };
    }
};

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ISCHECKER = exports.ISCHECKER = '_isTypecheckjsCheckerObject';

function defineLockedProperties(props, plugin) {

    // Copy the plugin (to enable user to use multiple plugin combinations)
    //      ...which will never happen, I know
    var copy = _extends({}, plugin);

    // Set props

    var _loop = function _loop(key) {
        Object.defineProperty(copy, key, {
            get: function get() {
                return props[key];
            },
            set: function set() {
                throw new Error('Forbidden to modify this property');
            }
        });
    };

    for (var key in props) {
        _loop(key);
    }

    return copy;
}

function makeChecker(opts) {
    if (typeof opts === 'function') {
        return _defineProperty({
            is: opts
        }, ISCHECKER, true);
    } else if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
        throw new Error('Argument should be an object');
    } else if (typeof opts.is !== 'function') {
        throw new Error("Argument has to contain an is function");
    } else return _extends({}, opts, _defineProperty({}, ISCHECKER, true));
}

function isChecker(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.is === 'function' && obj[ISCHECKER] === true;
}