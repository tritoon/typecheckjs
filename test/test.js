'use strict'
const assert = require('assert')
const type = require('..')

const badPlugins = require('./badplugins')
const dummyPlugins = require('./dummyplugin')

assert.throws(() => type('unrecognized_requirement'))
assert.doesNotThrow(() => type(x => x)
    , 'Calling type with a function should be possible')
assert.doesNotThrow(() => type(NaN)
    , 'Calling type with NaN should be possible')


assert(type(String).is('a') === true, 'String is string')
assert(type(String).is(String('abc')) === true, 'Object string is string')
assert(type(String).is(1) === false, 'Number is not string')

assert(type(Number).is(1) === true, 'Number is number')
assert(type(Number).is(Number(1)) === true, 'Object number is number')
assert(type(Number).is(Infinity) === true, 'Infinity is number')
assert(!type(Number).is('a'), 'String is not a number')
assert(!type(Number).is(NaN), 'NaN is not of type number')

assert(type(Boolean).is(true) === true, 'True is boolean')
assert(type(Boolean).is(false) === true, 'False is boolean')
assert(type(Boolean).is(Boolean(true)) === true, 'Object bool is bool')
assert(!type(Boolean).is('string'), 'String is not boolean')

assert(type(Function).is(x => x) === true, 'Fn is fn')
assert(type(Function).is(Function()) === true, 'Object fn is fn')
assert(!type(Function).is({}), 'Object is not function')

assert(type(NaN).is(NaN) === true, 'NaN is NaN')
assert(!type(NaN).is(2), 'Number is not NaN')
assert(!type(Number).is(NaN), 'NaN is not of type number')

assert(type(Function).is(x => x) === true, 'Function is function')
assert(type(Function).is(Function()) === true, 'Object function is fn')
assert(!type(Function).is(''), 'String is not function')

assert(type(Array).is([1,2]) === true, 'Array is array')
assert(type(Array).of(Number).is({reduce() {return true}, length: 10}) === false, 'Mock array is not array of num')

assert(type(Object).is({}) === true, 'Object is Object')
assert(type(Object).is(new Date()) === true, 'Date is Object')
assert(type(Date).is(new Date()) === true, 'Date is Date')
assert(!type(Object).is('aaa'), 'String is not object')
assert(!type(Date).is({}), 'Bare object is not date')

assert(type(Number).or(String).is('abc') === true, 'String is num or string')
assert(type(Number).or(String).is(123) === true, 'Num is num or string')
assert(type(Number).or(String).is(Object) === false, 'Obj is not num or string')

assert(type(Number).of === undefined, 'Number.of does not exist')

assert(typeof type(Array).of === 'function', '"Array of" function exists')
assert(type(Array).of(String).is([]) === true, '[] is array of string')
assert(type(Array).of(String).is(['a', 'b']) === true, 'Array of string is aos')
assert(type(Array).of(String).is(['a', 1]) === false, 'Mixed array is not aos')
assert(type(Array).of(Number).is([3,4]) === true, 'Array of number is aon')

assert(type(Array).of(type(String).or(Number)).is(['a', 1]), 'Array of or')
assert(!type(Array).of(type(String).or(Number)).is(['a', {}]), 'Array of or')

assert(type(Object).of(String).is({}) === true, '{} is obj of string')
assert(type(Object).of(String).is({a: 'a'}) === true, 'Object of string is oos')
assert(type(Object).of(Number).is({a: 'a'}) === false, 'Object of string is not oonum')
assert(type(Object).of(Number).is({a: 1}) === true, 'Object of number is oonum')

assert(type(Object).of(type(String).or(Number)).is({a:0,b:'a'}) === true, 'Object of or')
assert(type(Object).of({a: String}).is({a: 'a'}) === true, 'Object of a:String')

assert(
    type(Object)
        .of({x: type(Number).or(String)})
        .is({x: 1})
        === true
    , '{x: 1} is object of x:String|Number'
)

assert(
    type(Object)
        .of({x: type(Number).or(String)})
        .is({x: 'a'})
        === true
    , '{x: "a"} is object of x:String|Number'
)

assert(
    type(Array).of([String, Number]).is(['abc', 1]) === true
    , "[abc, 1] is Array of [S, Num]"
)

assert(
    type(Array).of([Number, String]).is(['avc', 1]) === false
    , "[1, abc] is not array of [Num, S]"
)

assert(type(Object).is(null) === false, 'Null is no object')
assert(type(String).is(undefined) === false, 'Undefined is no string')

//WITH PLUGINS
assert(typeof type.withPlugins === "function", 'type.withPlugins() exists')
assert.throws(type.withPlugins)
assert.throws(() => type.withPlugins(['a']))
assert.throws(() => type.withPlugins([() => null]))
assert.throws(() => type.withPlugins(() => null))

badPlugins.forEach(plugin => {
    try { assert.throws(() => type.withPlugins([plugin])(String).is('a')) }
    catch (e) { throw 'Expected plugin ' + plugin.name + ' to throw' }
})

let plugged = type.withPlugins([dummyPlugins[0]])

assert(plugged(String).is('DUMMY'), 'Core plugin reachable')
assert(plugged('DUMMY').is('DUMMY'), 'Dummy plugin works')

plugged = type.withPlugins(dummyPlugins)
assert(plugged('DUMMY').is('DUMMY'), 'Two plugins works')

plugged = type.withPlugins([dummyPlugins[1], dummyPlugins[0]])
assert(! plugged('DUMMY').is('DUMMY'), 'Plugin precedence works as expected')

console.log('All  tests passed!\n')