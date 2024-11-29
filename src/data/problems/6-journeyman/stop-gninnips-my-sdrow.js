import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function spinWords(string){
  //TODO Have fun :)
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const spinWords = new Function(\`return \${e.data}\`)()

        assert.strictEqual(spinWords("Welcome"), "emocleW");
        assert.strictEqual(spinWords("Hey fellow warriors"), "Hey wollef sroirraw");
        assert.strictEqual(spinWords("This is a test"), "This is a test");
        assert.strictEqual(spinWords("This is another test"), "This is rehtona test");
        assert.strictEqual(spinWords("You are almost to the last test"), "You are tsomla to the last test");
        assert.strictEqual(spinWords("Just kidding there is still one more"), "Just gniddik ereht is llits one more");
        assert.strictEqual(spinWords("Seriously this is the last one"), "ylsuoireS this is the last one");

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const stopSpinning = {
    name: 'Stop gninnipS My sdroW!',
    slug: 'stop-gninnips-my-sdrow',
    category: 'algorithms',
    rank: {
        ...getRankDetails(6),
        slug: '6',
    },
    problemStatement: 'Write a function that takes in a string of one or more words, and returns the same string, but with all words that have five or more letters reversed (Just like the name of this Kata). Strings passed in will consist of only letters and spaces. Spaces will be included only when more than one word is present.\n' +
    '\n' +
    'Examples:\n' +
    '```\n' +
    '"Hey fellow warriors"  --> "Hey wollef sroirraw" \n' +
    '"This is a test        --> "This is a test" \n' +
    '"This is another test" --> "This is rehtona test"\n' +
    '```',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Strings', 'Algorithms' ],
    languages: ['JavaScript']
}