import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function multiply(a, b){
  a * b
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const multiply = new Function(\`return \${e.data}\`)()

        assert.strictEqual(multiply(1,1), 1);
        assert.strictEqual(multiply(2,1), 2);
        assert.strictEqual(multiply(2,2), 4);
        assert.strictEqual(multiply(3,5), 15); 
        assert.strictEqual(multiply(5,0), 0);
        assert.strictEqual(multiply(0,5), 0);
        assert.strictEqual(multiply(0,0), 0); 

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const multiply = {
    name: 'Multiply',
    slug: 'multiply',
    category: 'bug_fixes',
    rank: {
        ...getRankDetails(8),
        slug: '8',
    },
    problemStatement: 'This code does not execute properly. Try to figure out why.',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Debugging', 'Fundamentals' ],
    languages: ['JavaScript']
}