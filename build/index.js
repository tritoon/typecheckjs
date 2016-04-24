'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _typefactory = require('./typefactory');

var _typefactory2 = _interopRequireDefault(_typefactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var type = (0, _typefactory2.default)([_core2.default]);

// Helper to extend the core plugin
type.withPlugins = function (plugins) {
    if (!type(Array).is(plugins)) throw Error('Expected an array');

    // Throws if one of the plugins doesn't conform to the spec
    plugins.forEach(validatePlugin);

    return (0, _typefactory2.default)(plugins.concat(_core2.default));
};

exports.default = type;

function validatePlugin(plugin) {
    if (!type(Object).is(plugin)) {
        throw new Error('A plugin should export an object');
    }

    if (!type(Object).of({ name: String }).is(plugin)) {
        throw new Error("A plugin hasn't exposed a `name` property of type string");
    }

    if (!type(Object).of({ getTest: Function }).is(plugin)) {
        throw new Error('Plugin \'' + plugin.name + '\' does not expose a \'getTest\' function');
    }
}