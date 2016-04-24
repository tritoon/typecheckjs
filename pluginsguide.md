How to develop plugins for typecheckjs
===============================================

Every plugin should have a root file looking like this:

    module.exports = {
    
        name: 'plugin_name',
        
        getTest (requirement) {
            if (unknown(requirement)) return false
            else return this.makeChecker(x => ...)
        }
        
    }
    
These are the most important properties of a plugin: first its `name` to
identify itself. Second, the `getTest` function, which returns either `false` if
your plugin doesn't recognize the requirement (in which case `typecheckjs` will 
fall back upon the core plugin) or a specialized object if you do recognize it. 

If you can handle the requirement, be sure to pass whatever you return through
`this.makeChecker()`, it is used to make your plugin work better with the rest 
of `typecheckjs`.

By default, `typecheckjs` will initialize your plugin by adding these two
properties to the object: 

 - `this.type()`: the function which is returned to the end user as well.
    With this, you can use the core plugin for basic type checking like
    `this.type(String).is('foo')`

    You can ONLY depend on the core plugin here.
    If you do need another plugin's functionality, you have to explicitly import
    the `typecheckjs` package yourself!
    
 -  `this.makeChecker(object)`: a function which adds a specific tag to your
    object in order to support more complex test cases like <br>
    `type(Object).of( type(Array).of(String) ).is( {a: ['a', 'b']} )`

    Be sure to include a `is` method in the object you pass in, because that is 
    what the user will expect. Besides, not doing so will throw an error :)
    If you only want an object with that single method, you can also use the 
    shorthand and just pass in the test function, that's fine too.

    This tagging with `this.makeChecker()` is needed to enable very versatile 
    type checking. The core plugin uses it - again, for example in 
    `type(Array).of(...)` - to  check if the argument passed to `of()` is a 
    test itself. If so, for example a test your plugin might provide that the 
    core module knows nothing of, it will still happily check if all elements in 
    an array have the characteristics your module has specified (by using 
    the `.is()` method you implemented).

Should you need any help, just read the core plugins' [code][1] as an example
Happy coding!

[1]: ./lib/core.js