import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function findOutlier(integers){
  //your code here
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const findOutlier = new Function(\`return \${e.data}\`)()

        assert.strictEqual(findOutlier([0, 1, 2]), 1)
        assert.strictEqual(findOutlier([1, 2, 3]), 2)
        assert.strictEqual(findOutlier([2,6,8,10,3]), 3)
        assert.strictEqual(findOutlier([0,0,3,0,0]), 3)
        assert.strictEqual(findOutlier([1,1,0,1,1]), 0)

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const findTheParityOutlier = {
    name: 'Find The Parity Outlier',
    slug: 'find-the-parity-outlier',
    category: 'algorithms',
    rank: {
        ...getRankDetails(6),
        slug: '6',
    },
    problemStatement: 'You are given an array (which will have a length of at least 3, but could be very large) containing integers. The array is either entirely comprised of odd integers or entirely comprised of even integers except for a single integer `N`. Write a method that takes the array as an argument and returns this "outlier" `N`.\n' +
    '\n' +
    '## Examples\n' +
    '\n' +
    '```\n' +
    '[2, 4, 0, 100, 4, 11, 2602, 36] -->  11 (the only odd number)\n' +
    '\n' +
    '[160, 3, 1719, 19, 11, 13, -21] --> 160 (the only even number)\n' +
    '```\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Algorithms' ],
    languages: ['JavaScript']
}