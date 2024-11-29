import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function squareDigits(num){
  return 0;
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const squareDigits = new Function(\`return \${e.data}\`)()

        assert.strictEqual(squareDigits(3212), 9414, "squareDigits(3212) should equal 9414")
        assert.strictEqual(squareDigits(2112), 4114, "squareDigits(2112) should equal 4114")
        assert.strictEqual(squareDigits(0), 0, "squareDigits(0) should equal 0");

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const squareDigits = {
    name: 'Square Every Digit',
    slug: 'square-every-digit',
    category: 'reference',
    rank: {
        ...getRankDetails(7),
        slug: '7',
    },
    problemStatement: 'In this little assignment, you are given a number, and you have to square every digit and concatenate the results.\n' +
'\n' +
'### Examples\n' +
'\n' +
'```\n' +
'squareDigits(9119); // return 811181\n' +
'squareDigits(765);  // return 493625\n' +
'squareDigits(123);  // return 149\n' +
'```\n' +
'\n' +
'### Notes\n' +
'\n' +
'- The function accepts an integer and returns an integer.\n' +
'- The input will always be a non-negative integer.\n' +
'- Each digit is squared individually, and the results are concatenated in the same order.\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Mathematics', 'Fundamentals' ],
    languages: ['JavaScript']
}