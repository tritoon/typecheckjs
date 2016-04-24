'use strict'
import corePlugin from './core'
import typeFactory from './typefactory'


let type = typeFactory([corePlugin])

// Helper to extend the core plugin
type.withPlugins = plugins => {
    if (!type(Array).is(plugins)) throw Error('Expected an array')
    
    // Throws if one of the plugins doesn't conform to the spec
    plugins.forEach(validatePlugin)
    
    return typeFactory( plugins.concat(corePlugin) )
}


export default type


function validatePlugin (plugin) {
    if (!type(Object).is(plugin)) {
        throw new Error('A plugin should export an object')
    }
    
    if (!type(Object).of({name: String}).is(plugin)) {
        throw new Error("A plugin hasn't exposed a `name` property of type string")
    }
    
    if (!type(Object).of({getTest: Function}).is(plugin)) {
        throw new Error(`Plugin '${plugin.name}' does not expose a 'getTest' function`)
    }
}