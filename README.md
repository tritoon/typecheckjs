First, install this module: `const type = require('typecheckjs')`

This will give you a type() function which you can use like this:

    /*
     * Simple type checking is as follows
     */
    
    type(String).is('abc') // => true
    type(String).is(1) // => false
    type(Number).is('abc') // => false
    
    //NaN
    type(Number).is(NaN) // => true
    type(NaN).is(NaN) // => true
    
    //You can also pass in: Boolean, Function
    type(Boolean).is(false) // => true
    type(Function).is(x => x+3) // => true
    
    //This also works for Arrays and Objects
    type(Array).is([]) // => true
    type(Object).is(new Date()) // => true
    
    //If given a constructor, it checks with 'instanceof'
    type(Date).is(new Date()) // => true
    
    /*
     * What if your function accepts either a String or a Number???
     */
    
    type(String).or(Number).is('abc') // => true
    type(String).or(Number).is(1) // => true
    
    /*
     * Want to check the contents of an Array or Object?
     */
    
    type(Object).of(String).is({a: 'a'}) // => true
    type(Array).of(Number).is([1,2,3]) // => true
    
    //Or make sure that specific values are of a certain type
    type(Object).of({a:String}).is({a:'a'}) // => true
    type(Array).of([String, Number]).is(['a', 1]) // => true
    
    //If you don't specify a specific field, it will be ignored
    type(Object).of({a:String}).is({a:'a', b:1}) // => true
    
    //For a more advanced check in type().of,
    //just pass in the result of a type().of or type().or call
    type(Object).of( type(String).or(Number) ).is({a:1, b:'b'}) // => true
    type(Array).of( type(Array).of(Number) ).is([[1,2],[3,4]]) // => true
    
    //This goes for type.or() as well
    type( type(Array).of(String) ).or( type(Object).of(String) ).is({a:'a'}) // => true
    type( type(Array).of(String) ).or( type(Object).of(String) ).is(['a']) // => true