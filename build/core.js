'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    name: 'corePlugin',

    getTest: function getTest(req) {
        var _this = this;

        var result = {};

        // This plugin only recognizes constructors (which are functions) and NaN
        if (typeof req !== 'function' && !this.isNaN(req)) return false;

        switch (req) {
            case String:
                result.is = function (x) {
                    return typeof x === 'string' || x instanceof String;
                };
                break;

            case Number:
                result.is = function (x) {
                    return !_this.isNaN(x) && (typeof x === 'number' || x instanceof Number);
                };
                break;

            case Boolean:
                result.is = function (x) {
                    return typeof x === 'boolean' || x instanceof Boolean;
                };
                break;

            case Function:
                result.is = function (x) {
                    return typeof x === 'function' || x instanceof Function;
                };
                break;

            case Array:
                result.is = Array.isArray;
                result.of = this.constructOf(Array);
                break;

            case Object:
                result.is = function (x) {
                    return x instanceof Object && x !== null;
                };
                result.of = this.constructOf(Object);
                break;

            default:
                if (this.isNaN(req)) result.is = this.isNaN;else result.is = function (x) {
                    return x instanceof req;
                };
        }

        return this.makeChecker(result);
    },

    // Check the contents of an array or object
    // Used for eg in `type(Array).of(String).is(['a', 'b'])`
    // In this example, arrOrObj would be Array
    constructOf: function constructOf(arrOrObj) {
        var _this2 = this;

        // In the example above, requirement would be String
        return function (requirement) {

            // Get a test for this requirement
            var testFn = _this2.normalizeTestFn(requirement);

            return _this2.makeChecker(function (x) {

                // It isn't even an array/object
                if (!_this2.type(arrOrObj).is(x)) return false;

                // Now test it
                else return testFn(x);
            });
        };
    },

    /*  
     *  Returns a test FUNCTION from a requirement, specialized for .of() checking
     *  3 possibilities for requirement: a typecheckjs test, something that `type`
     *  recognizes and an plain object or array with things that this.type recognizes
     */

    normalizeTestFn: function normalizeTestFn(requirement) {
        var _this3 = this;

        // Make it into a valid test (works for real typecheckjs tests too)
        // If this.type throws, we make a test ourselves
        try {
            var _ret = function () {
                var test = _this3.type(requirement);

                // Loop over all properties and assert they fit requirement
                return {
                    v: function v(x) {
                        for (var key in x) {
                            if (!test.is(x[key])) return false;
                        }

                        return true;
                    }
                };

                // Default this.type() didn't recognize it, so it threw an error
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } catch (e) {

            // We have only one extra case. If it's not applicable, throw error
            if (!this.type(Object).or(Array).is(requirement)) {
                throw new Error('Requirement not recognized');
            }

            // Loop over every property and test it against its specific test
            return function (x) {

                for (var key in requirement) {

                    // If property doesn't exist in the tested obj, it fails
                    if (!(key in x)) return false;

                    // Test this property
                    else if (!_this3.type(requirement[key]).is(x[key])) return false;

                        // Proceed to check the other specified properties
                        else continue;
                }

                return true;
            };
        }
    },

    // Built-in isNaN is not sufficient: isNaN('string') evaluates to true
    isNaN: function isNaN(x) {
        return (typeof x === 'number' || x instanceof Number) && x !== x;
    }
};