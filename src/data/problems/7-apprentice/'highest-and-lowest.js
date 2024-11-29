import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function highAndLow(numbers){
  // ...
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const highAndLow = new Function(\`return \${e.data}\`)()

        assert.strictEqual(highAndLow("8 3 -5 42 -1 0 0 -9 4 7 4 -4"), "42 -9");
        assert.strictEqual(highAndLow("1 2 3"), "3 1");

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const highAndLow = {
    name: 'Highest and Lowest',
    slug: 'highest-and-lowest',
    category: 'reference',
    rank: {
        ...getRankDetails(7),
        slug: '7',
    },
    problemStatement: 'In this little assignment you are given a string of space separated numbers, and have to return the highest and lowest number.\n' +
    '\n' +
    '### Examples\n' +
    '\n' +
    '```\n' +
    'highAndLow("1 2 3 4 5"); // return "5 1"\n' +
    'highAndLow("1 2 -3 4 5"); // return "5 -3"\n' +
    'highAndLow("1 9 3 4 -5"); // return "9 -5"\n' +
    '```\n' +
    '### Notes\n' +
    '\n' +
    '- All numbers are valid `Int32`, no *need* to validate them.\n' +
    '- There will always be at least one number in the input string.\n' +
    '- Output string must be two numbers separated by a single space, and highest number is first.\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Fundamentals', 'Strings' ],
    languages: ['JavaScript']
}