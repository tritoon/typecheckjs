module.exports = [
    'not an object',
    
    {
        name: 'bad2',
        getTest: 'not a function'
    },
    
    {
        name: 'bad3',
        getTest: () => true
    },
    
    {
        name: 'bad4',
        getTest: () => ({ is: x => x })
    },
    
    {
        name: 'bad5',
        getTest () {
            return this.makeChecker()
        }
    },
    
    {
        name: 'bad6',
        getTest () {
            return this.makeChecker(1)
        }
    },
    
    {
        // no name
        getTest () {}
    }
    
]