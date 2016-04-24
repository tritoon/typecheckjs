module.exports = [
    {
        name: 'dummy1',
        
        getTest: function (req) {
            if (req !== 'DUMMY') return false
            return this.makeChecker(x => x === 'DUMMY')
        }
    },
    
    {
        name: 'dummy2', 
        
        getTest: function (req) {
            if (req !== 'DUMMY') return false
            return this.makeChecker(x => x !== 'DUMMY')
        }
    }
]