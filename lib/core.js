'use strict'

export default {
    name: 'corePlugin',
    
    getTest (req) {
        let result = {}
        
        // This plugin only recognizes constructors (which are functions) and NaN
        if (typeof req !== 'function' && !this.isNaN(req)) return false
        
        switch (req) {
            case String:
                result.is = x => typeof x === 'string' || x instanceof String
                break
            
            case Number:
                result.is = x => !this.isNaN(x) && (typeof x === 'number' || x instanceof Number)
                break
            
            case Boolean:
                result.is = x => typeof x === 'boolean' || x instanceof Boolean
                break
            
            case Function:
                result.is = x => typeof x === 'function' || x instanceof Function
                break
            
            case Array:
                result.is = Array.isArray
                result.of = this.constructOf(Array)
                break
            
            case Object:
                result.is = x => x instanceof Object && x !== null
                result.of = this.constructOf(Object)
                break
            
            default:
                if (this.isNaN(req)) result.is = this.isNaN
                else result.is = x => x instanceof req
        }
        
        return this.makeChecker(result)
    },
    
    // Check the contents of an array or object
    // Used for eg in `type(Array).of(String).is(['a', 'b'])`
    // In this example, arrOrObj would be Array
    constructOf (arrOrObj) {
        
        // In the example above, requirement would be String
        return requirement => {
            
            // Get a test for this requirement
            const testFn = this.normalizeTestFn(requirement)
            
            return this.makeChecker(x => {
                
                // It isn't even an array/object
                if (!this.type(arrOrObj).is(x)) return false
                
                // Now test it
                else return testFn(x)
                
            })
            
        }
    },
    
    /*  
     *  Returns a test FUNCTION from a requirement, specialized for .of() checking
     *  3 possibilities for requirement: a typecheckjs test, something that `type`
     *  recognizes and an plain object or array with things that this.type recognizes
     */
    
    normalizeTestFn (requirement) {
        
        // Make it into a valid test (works for real typecheckjs tests too)
        // If this.type throws, we make a test ourselves
        try { 
            const test = this.type(requirement)
            
            // Loop over all properties and assert they fit requirement
            return x => {
                for (let key in x) {
                    if (!test.is(x[key])) return false
                }
                
                return true
            }
        
        // Default this.type() didn't recognize it, so it threw an error
        } catch (e) {
            
            // We have only one extra case. If it's not applicable, throw error
            if (!this.type(Object).or(Array).is(requirement)) {
                throw new Error('Requirement not recognized')
            }
            
            // Loop over every property and test it against its specific test
            return x => {
                
                for (let key in requirement) {
                    
                    // If property doesn't exist in the tested obj, it fails
                    if (!(key in x)) return false
                    
                    // Test this property
                    else if ( !this.type( requirement[key] ).is( x[key]) ) return false
                    
                    // Proceed to check the other specified properties
                    else continue
                }
                
                return true
            }
        }
    },
    
    // Built-in isNaN is not sufficient: isNaN('string') evaluates to true
    isNaN (x) {
        return (typeof x === 'number' || x instanceof Number) && x !== x
    }
}
