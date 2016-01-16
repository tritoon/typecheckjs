'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UnrecognizedError = require('./errors.js');

var ISCHECKER = '_isCheckerFunction';

var type = module.exports = function (requirement) {
    if (requirement[ISCHECKER]) return prepareFn(requirement.is);

    //Recognized: any constructor or NaN
    if (!isRecognized(requirement)) throwUnrecognized(requirement);

    var testFn = undefined,
        ofFn = undefined;
    switch (requirement) {
        case String:
            testFn = function testFn(x) {
                return typeof x === 'string' || x instanceof String;
            };
            break;

        case Number:
            testFn = function testFn(x) {
                return typeof x === 'number' || x instanceof Number;
            };
            break;

        case Boolean:
            testFn = function testFn(x) {
                return typeof x === 'boolean' || x instanceof Boolean;
            };
            break;

        case Function:
            testFn = function testFn(x) {
                return typeof x === 'function' || x instanceof Function;
            };
            break;

        default:
            if (isNaN(requirement)) {
                testFn = isNaN;
            } else if (requirement === Array) {
                testFn = Array.isArray;
                ofFn = constructOf(Array);
            } else {
                testFn = function testFn(x) {
                    return x instanceof requirement;
                };
                ofFn = constructOf(Object);
            }
    }

    return prepareFn(testFn, ofFn);
};

function prepareFn(testFn, ofFn) {
    var _ref;

    return _ref = {}, _defineProperty(_ref, ISCHECKER, true), _defineProperty(_ref, 'is', testFn), _defineProperty(_ref, 'of', ofFn || throwUnrecognizedOf), _defineProperty(_ref, 'or', function or(newReq) {
        return prepareFn(function (x) {
            return testFn(x) || normalizeTestFn(newReq)(x);
        });
    }), _ref;
}

function constructOf(arrOrObj) {
    return function (requirement) {
        var _ref2;

        var testFn = normalizeTestFn(requirement);

        return _ref2 = {}, _defineProperty(_ref2, ISCHECKER, true), _defineProperty(_ref2, 'is', function is(x) {
            if (!type(arrOrObj).is(x)) return false;

            return Object.keys(x).reduce(function (acc, key) {
                return acc && testFn(x[key], key);
            }, true);
        }), _ref2;
    };
}

function normalizeTestFn(requirement) {
    if (requirement[ISCHECKER] || isRecognized(requirement)) {
        return requirement[ISCHECKER] ? requirement.is : type(requirement).is;
    } else {
        if (!type(Object).is(requirement)) throwUnrecognized(requirement);

        return function (value, keyOfTest) {
            if (!requirement.hasOwnProperty(keyOfTest)) return true;
            var test = normalizeTestFn(requirement[keyOfTest]);
            return test(value);
        };
    }
}

function isNaN(x) {
    return (typeof x === 'number' || x instanceof Number) && x !== x;
}

function isRecognized(requirement) {
    return typeof requirement === 'function' || isNaN(requirement);
}

function throwUnrecognized() {
    throw new UnrecognizedError('Unrecognized requirement');
}

function throwUnrecognizedOf() {
    throw new UnrecognizedError('This type does not support \'of\' queries');
}