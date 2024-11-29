import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function digitalRoot(n) {
  // ...
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const digitalRoot = new Function(\`return \${e.data}\`)()

        assert.strictEqual( digitalRoot(16), 7 )
        assert.strictEqual( digitalRoot(456), 6 )
        assert.strictEqual( digitalRoot(132189), 6 )

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const digitalRoot = {
    name: 'Sum of Digits / Digital Root',
    slug: 'sum-of-digits-slash-digital-root',
    category: 'algorithms',
    rank: {
        ...getRankDetails(6),
        slug: '6',
    },
    problemStatement: 'Digital root is the _recursive sum of all the digits in a number._\n' +
    '\n' +
    'Given `n`, take the sum of the digits of `n`. If that value has more than one digit, continue reducing in this way until a single-digit number is produced. The input will be a non-negative integer.\n' +
    '\n' +
    '### Examples\n' +
    '```\n' +
    '⠀   16  -->  1 + 6 = 7\n' +
    '   942  -->  9 + 4 + 2 = 15  -->  1 + 5 = 6\n' +
    '132189  -->  1 + 3 + 2 + 1 + 8 + 9 = 24  -->  2 + 4 = 6\n' +
    '493193  -->  4 + 9 + 3 + 1 + 9 + 3 = 29  -->  2 + 9 = 11  -->  1 + 1 = 2\n' +
    '```\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Mathematics', 'Algorithms' ],
    languages: ['JavaScript']
}