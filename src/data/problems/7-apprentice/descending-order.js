import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function descendingOrder(n){
  //...
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const descendingOrder = new Function(\`return \${e.data}\`)()

        assert.strictEqual(descendingOrder(0), 0)
        assert.strictEqual(descendingOrder(1), 1)
        assert.strictEqual(descendingOrder(111), 111)
        assert.strictEqual(descendingOrder(15), 51)
        assert.strictEqual(descendingOrder(1021), 2110)
        assert.strictEqual(descendingOrder(123456789), 987654321)

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const descendingOrder = {
    name: 'Descending Order',
    slug: 'descending-order',
    category: 'reference',
    rank: {
        ...getRankDetails(7),
        slug: '7',
    },
    problemStatement: 'Your task is to make a function that can take any non-negative integer as an argument and return it with its digits in descending order. Essentially, rearrange the digits to create the highest possible number.\n' +
    '\n' +
    '\n' +
    '### Examples:\n' +
    '\n' +
    'Input: `42145`\n' +
    'Output: `54421`\n' +
    '\n' +
    'Input: `145263`\n' +
    'Output: `654321`\n' +
    '\n' +
    'Input: `123456789`\n' +
    'Output: `987654321`\n' +
    '\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Fundamentals' ],
    languages: ['JavaScript']
}