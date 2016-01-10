'use strict'

const assert = require('assert')
const type = require('./index')

assert(type(String).is('a') === true, 'String is string')
assert(type(String).is(new String('abc')) === true, 'Object string is string')

assert(type(Number).is(1) === true, 'Number is number')
assert(type(Number).is(new Number(1)) === true, 'Object number is number')
assert(type(Number).is(Infinity) === true, 'Infinity is number')

assert(type(Boolean).is(true) === true, 'True is boolean')
assert(type(Boolean).is(false) === true, 'False is boolean')
assert(type(Boolean).is(new Boolean(true)) === true, 'Object bool is bool')

assert(type(Function).is(x => x) === true, 'Fn is fn')
assert(type(Function).is(new Function()) === true, 'Object fn is fn')

assert(type(Number).is(NaN) === true, 'NaN is number')
assert(type(NaN).is(NaN) === true, 'NaN is NaN')

assert(type(Function).is(x => x) === true, 'Function is function')
assert(type(Function).is(new Function()) === true, 'Object function is fn')

assert(type(Array).is([1,2]) === true, 'Array is array')
assert(type(Array).of(Number).is({reduce() {return true}}) === false, 'Mock array is not array of num')

assert(type(Object).is({}) === true, 'Object is Object')
assert(type(Object).is(new Date()) === true, 'Date is Object')
assert(type(Date).is(new Date()) === true, 'Date is Date')

assert(type(Number).or(String).is('abc') === true, 'String is num or string')
assert(type(Number).or(String).is(123) === true, 'Num is num or string')
assert(type(Number).or(String).is(Object) === false, 'Obj is not num or string')

assert.throws(type(Number).of, 'Number of throws')
assert(type(Number).of !==  undefined, 'Number of exists')

assert(typeof type(Array).of === 'function', '"Array of" function exists')
assert(type(Array).of(String).is([]) === true, '[] is array of string')
assert(type(Array).of(String).is(['a', 'b']) === true, 'Array of string is aos')
assert(type(Array).of(Number).is([3,4]) === true, 'Array of number is aon')

assert(type(Array).of(type(String).or(Number)).is(['a', 1]), 'Array of or')

assert(type(Object).of(String).is({}) === true, '{} is obj of string')
assert(type(Object).of(String).is({a: 'a'}) === true, 'Object of string is oos')
assert(type(Object).of(Number).is({a: 'a'}) === false, 'Object of string is not oon')
assert(type(Object).of(Number).is({a: 1}) === true, 'Object of number is oon')

assert(type(Object).of(type(String).or(Number)).is({a:0,b:'a'}) === true, 'Object of or')
assert(type(Object).of({x: String}).is({x: 'a'}) === true, 'Object of x:String')

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

assertREADME()

console.log('All  tests passed!\n')

function assertREADME () {
    const file = require('fs').readFileSync('./README.md').toString()
    const codeLines = file.split('\n')
        .filter( line => line.substr(0,4) === '    ' && line.indexOf('=>') !== -1)
        .map( line => {
            let [val1, val2] = line.substr(4).split(' // => ')
            return `assert(${val1} === ${val2})`
        })
        
    eval(codeLines.join('\n'))
}