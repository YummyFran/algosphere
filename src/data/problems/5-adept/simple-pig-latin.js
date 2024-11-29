import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function pigIt(str){
  //Code here
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const pigIt = new Function(\`return \${e.data}\`)()

        assert.strictEqual(pigIt('Pig latin is cool'),'igPay atinlay siay oolcay')
        assert.strictEqual(pigIt('This is my string'),'hisTay siay ymay tringsay')

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const pigIt = {
    name: 'Simple Pig Latin',
    slug: 'simple-pig-latin',
    category: 'algorithms',
    rank: {
        ...getRankDetails(5),
        slug: '5',
    },
    problemStatement: 'Move the first letter of each word to the end of it, then add "ay" to the end of the word. Leave punctuation marks untouched.\n' +
    '\n' +
    '## Examples\n' +
    '\n' +
    '```javascript\n' +
    "pigIt('Pig latin is cool'); // igPay atinlay siay oolcay\n" +
    "pigIt('Hello world !');     // elloHay orldway !\n" +
    '```\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags:  [ 'Regular Expressions', 'Algorithms' ],
    languages: ['JavaScript']
}