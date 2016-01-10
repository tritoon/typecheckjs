'use strict'
const UnrecognizedError = require('./errors.js')

const ISCHECKER = Symbol("ISCHECKER")

const type = module.exports = function (requirement) {
    if (requirement[ISCHECKER]) return prepareFn(requirement.is)
    
    //Recognized: any constructor or NaN 
    if (!isRecognized(requirement)) throwUnrecognized(requirement)
    
    let testFn, ofFn
    switch (requirement) {
        case String: 
            testFn = x => typeof x === 'string'   || x instanceof String
            break
        
        case Number:
            testFn = x => typeof x === 'number'   || x instanceof Number
            break
        
        case Boolean:
            testFn = x => typeof x === 'boolean'  || x instanceof Boolean
            break
        
        case Function: 
            testFn = x => typeof x === 'function' || x instanceof Function
            break
        
        default:
            if (isNaN(requirement)) {
                testFn = isNaN
                
            } else if (requirement === Array) {
                testFn = Array.isArray
                ofFn = constructOf(Array)
                
            } else {
                testFn = x => x instanceof requirement 
                ofFn = constructOf(Object)
            }
    }
    
    return prepareFn(testFn, ofFn)
}

function prepareFn (testFn, ofFn) {
    return {
        [ISCHECKER]: true,
        is: testFn,
        of: ofFn || throwUnrecognizedOf,
        
        or (newReq) {
            return prepareFn(x => testFn(x) || normalizeTestFn(newReq)(x))
        }
    }
}

function constructOf(arrOrObj) {
    return requirement => {
        const testFn = normalizeTestFn(requirement)
    
        return {
            [ISCHECKER]: true,
            is: x => {
                if (!type(arrOrObj).is(x)) return false
                
                return Object.keys(x)
                    .reduce((acc, key) => acc && testFn(x[key], key), true)
            }
        }
    }
}

function normalizeTestFn (requirement) {
    if (requirement[ISCHECKER] || isRecognized(requirement)) {
        return requirement[ISCHECKER] ? requirement.is : type(requirement).is
    
    } else {
        if (!type(Object).is(requirement)) throwUnrecognized(requirement)
        
        return (value, keyOfTest) => {
            if (!requirement.hasOwnProperty(keyOfTest)) return true
            const test = normalizeTestFn(requirement[keyOfTest])
            return test(value)
        }
    }
}

function isNaN (x) {
    return (typeof x === 'number' || x instanceof Number) && x !== x
}

function isRecognized (requirement) {
    return typeof requirement === 'function' || isNaN(requirement)
}

function throwUnrecognized () {
    throw new UnrecognizedError(`Unrecognized requirement`)
}

function throwUnrecognizedOf () {
    throw new UnrecognizedError(`This type does not support 'of' queries`)
}