The easiest and most powerful type checking node.js package yet!
Did I mention it has powerful [plugin support](#plugins)?

### Installation

    npm i --save typecheckjs

### Usage

The core plugin will recognize `NaN`, `String`, `Number`, `Boolean`, 
`Function`, `Array`, `Object`, and every constructor function (like `Date`).
Use it like this:

    const type = require('typecheckjs')
    
    type(Number).is(1) // true
    type(String).is(1) // true
    
    type(Date).is(new Date()) // true
    
    type(Number).is(NaN) // true
    type(NaN).is(NaN)    // true
    type(NaN).is(1)      // false
    
If you want to accept multiple types, you can do so:
    
    type(Number).or(String).is(1)    // true
    type(Number).or(String).is('a')  // true
    type(Number).or(String).is(true) // false
    
It is also possible to check the contents of an array or object:

    type(Array).of(Number).is([1,2,3]) // true
    type(Array).of(Number).is([1,'a']) // false
    
    type(Object).of(Number).is({a:1}) // true
    
    type(Object).of({a: Number, b: String}).is({a: 1, b: 'b'}) //true
    type(Array).of([Number, String]).is([1, 'a']) // true
    
Check the tests in the repo for more info: [link](./test/test.js)


### Plugins

`typecheckjs` contains a well-crafted plugin system 
that enables developers with specific needs to
easily code for type safety.

To use it in your code, first import the library and the plugins 
you would like to use. Then configure `typecheckjs` to make use of them:

    const Immutable = require('immutable')
    const Type = require('typecheckjs')
    const immutableplugin = require('typecheckjsimmutable') // In development
    
    const type = Type.withPlugins([immutableplugin])

Now you can use whatever tests this plugin provides, for example:

    let map = Immutable.Map({a: 10})
    type(Immutable.Map).of(Number).is(map) // true
    
To develop a plugin, refer to [pluginsguide.md]()