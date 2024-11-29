import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function evenOrOdd(number) {
  // Write your code here
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const evenOrOdd = new Function(\`return \${e.data}\`)()

        assert.strictEqual(evenOrOdd(2), "Even", "2 is even")
        assert.strictEqual(evenOrOdd(7), "Odd", "7 is odd") 
        assert.strictEqual(evenOrOdd(-42), "Even", "-42 is even")
        assert.strictEqual(evenOrOdd(-7), "Odd", "-7 is odd")
        assert.strictEqual(evenOrOdd(0), "Even", "0 is even")
        
        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const evenOrOdd = {
    name: 'Even or Odd',
    slug: 'even-or-odd',
    category: 'reference',
    rank: {
        ...getRankDetails(8),
        slug: '8',
    },
    problemStatement: 'Create a function that takes an integer as an argument and returns `"Even"` for even numbers or `"Odd"` for odd numbers.\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Mathematics', 'Fundamentals' ],
    languages: ['JavaScript']
}

