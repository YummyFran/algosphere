import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function getCount(str) {
  return 0;
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const getCount = new Function(\`return \${e.data}\`)()

        assert.strictEqual(getCount("abracadabra"), 5);

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const vowelCount = {
    name: 'Vowel Count',
    slug: 'vowel-count',
    category: 'reference',
    rank: {
        ...getRankDetails(7),
        slug: '7',
    },
    problemStatement: 'Return the number (count) of vowels in the given string. \n' +
    '\n' +
    'We will consider `a`, `e`, `i`, `o`, `u` as vowels for this Kata (but not `y`).\n' +
    '\n' +
    'The input string will only consist of lower case letters and/or spaces.\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Strings', 'Fundamentals' ],
    languages: ['JavaScript']
}