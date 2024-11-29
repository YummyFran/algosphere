import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function positiveSum(arr) {
  
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const positiveSum = new Function(\`return \${e.data}\`)()

        assert.strictEqual(positiveSum([1,2,3,4,5]),15);
        assert.strictEqual(positiveSum([1,-2,3,4,5]),13);
        assert.strictEqual(positiveSum([]),0);
        assert.strictEqual(positiveSum([-1,-2,-3,-4,-5]),0);
        assert.strictEqual(positiveSum([-1,2,3,4,-5]),9);

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const positiveSum = {
    name: 'Sum of positive',
    slug: 'sum-of-positive',
    category: 'reference',
    rank: {
        ...getRankDetails(8),
        slug: '8',
    },
    problemStatement: 'You get an array of numbers, return the sum of all of the positives ones.\n' +
    '\n' +
    'Example `[1,-4,7,12]` => `1 + 7 + 12 = 20`\n' +
    '\n' +
    'Note: if there is nothing to sum, the sum is default to `0`.\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Arrays', 'Fundamentals' ],
    languages: ['JavaScript']
}