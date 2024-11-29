import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function solution(str){
  
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const solution = new Function(\`return \${e.data}\`)()

        assert.strictEqual(solution('world'), 'dlrow');
        assert.strictEqual(solution('hello'), 'olleh');
        assert.strictEqual(solution(''), '');
        assert.strictEqual(solution('h'), 'h');

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const reversedString = {
    name: 'Reversed Strings',
    slug: 'reversed-strings',
    category: 'reference',
    rank: {
        ...getRankDetails(8),
        slug: '8',
    },
    problemStatement:  'Complete the solution so that it reverses the string passed into it. \n' +
    '\n' +
    '```\n' +
    "'world'  =>  'dlrow'\n" +
    "'word'   =>  'drow'\n" +
    '```',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Strings', 'Fundamentals' ],
    languages: ['JavaScript']
}