import { getRankDetails, assert } from "../../utils/helper";

const starterCode = `function makeNegative(num) {
  // Code?
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const makeNegative = new Function(\`return \${e.data}\`)()

        assert.strictEqual(makeNegative(1), -1);
        assert.strictEqual(makeNegative(-5), -5);
        assert.strictEqual(makeNegative(0), 0);
        assert.strictEqual(makeNegative(0.12), -0.12);

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const returnNegative = {
    name: 'Return Negative',
    slug: 'return-negative',
    category: 'reference',
    rank: {
        ...getRankDetails(8),
        slug: '8',
    },
    problemStatement: 'In this simple assignment you are given a number and have to make it negative. But maybe the number is already negative?\n' +
    '\n' +
    '### Examples\n' +
    '\n' +
    '``` \n' +
    'makeNegative(1);    // return -1\n' +
    'makeNegative(-5);   // return -5\n' +
    'makeNegative(0);    // return 0\n' +
    'makeNegative(0.12); // return -0.12\n' +
    '```\n' +
    '\n' +
    '### Notes\n' +
    '\n' +
    '- The number can be negative already, in which case no change is required.\n' +
    '- Zero (0) is not checked for any specific sign. Negative zeros make no mathematical sense.\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Fundamentals' ],
    languages: ['JavaScript']
}