'use strict'
export const ISCHECKER = '_isTypecheckjsCheckerObject'

export default function (plugins) {
    
    // Add useful properties to plugins
    plugins = plugins.map(plugin => 
        defineLockedProperties({type, makeChecker}, plugin)
    )

    return type
    
    function type (...args) {
        let test
        
        // If requirement is a legit typecheckjs test, reuse the 'is' method
        // Useful for more complex constructs like .or(), .of(), ...
        if (args.length === 1 && isChecker(args[0])) {
            test = args[0]
        
        // If not, search for a plugin that recognizes the requirement
        } else {
            
            for (let plugin of plugins) {
                
                // Get a test. If none is found, should return `false`
                try {
                    test = plugin.getTest.apply(plugin, args) 
                
                // Plugin threw error
                } catch (originalError) { 
                    let err = new Error(`Plugin ${plugin.name} threw an error`)
                    err.original = originalError
                    throw err
                }
                
                // Found test, now ensure it is well-formatted and break
                if (test !== false) {
                    if (!isChecker(test)) {
                        if (typeof plugin === 'object') {
                            throw new Error(`Typecheckjs plugin ${plugin.name} has failed`)
                        } else {
                            throw new Error('Typecheckjs plugin has failed')
                        }
                    }
                    
                    else break
                }
            }
            
            if (test === false) throw new Error('No plugins recognized requirement')
            
        }
        
        return {
            ...test,
            or: makeOr(test)
        }
    }
    
    // Defined inside this function since it needs access to type and vice versa
    function makeOr (test1) {
        return req2 => {
            
            const test = x => test1.is(x) || type(req2).is(x)
            
            return makeChecker(test, {or: makeOr(test)})
            
        }
    }
    
}

function defineLockedProperties (props, plugin) {
    
    // Copy the plugin (to enable user to use multiple plugin combinations)
    //      ...which will never happen, I know
    let copy = {...plugin}
    
    // Set props
    for (let key in props) {
        Object.defineProperty(copy, key, {
            get: () => props[key],
            set: () => { throw new Error('Forbidden to modify this property') }
        })
    }
    
    return copy
}

function makeChecker (opts) {
    if (typeof opts === 'function') {
        return {
            is: opts,
            [ISCHECKER]: true
        }
    }
    
    else if (typeof opts !== 'object') {
        throw new Error('Argument should be an object')
    } else if (typeof opts.is !== 'function') {
        throw new Error("Argument has to contain an is function")
    }
    
    else return {
        ...opts,
        [ISCHECKER]: true
    }
}

function isChecker (obj) {
    return typeof obj === 'object' 
        && typeof obj.is === 'function'
        && obj[ISCHECKER] === true
}