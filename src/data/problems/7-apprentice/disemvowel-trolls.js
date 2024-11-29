import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function disemvowel(str) {
  return str;
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const disemvowel = new Function(\`return \${e.data}\`)()

        assert.strictEqual(disemvowel("This website is for losers LOL!"), "Ths wbst s fr lsrs LL!")
        assert.strictEqual(disemvowel("No offense but,\nYour writing is among the worst I've ever read"), "N ffns bt,\nYr wrtng s mng th wrst 'v vr rd")
        assert.strictEqual(disemvowel("What are you, a communist?"), "Wht r y,  cmmnst?")

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const disemvowelTrolls = {
    name: 'Disemvowel Trolls',
    slug: 'disemvowel-trolls',
    category: 'reference',
    rank: {
        ...getRankDetails(7),
        slug: '7',
    },
    problemStatement: 'Trolls are attacking your comment section!\n' +
    '\n' +
    "A common way to deal with this situation is to remove all of the vowels from the trolls' comments, neutralizing the threat.\n" +
    '\n' +
    'Your task is to write a function that takes a string and return a new string with all vowels removed.\n' +
    '\n' +
    'For example, the string "This website is for losers LOL!" would become "Ths wbst s fr lsrs LL!".\n' +
    '\n' +
    "Note: for this kata `y` isn't considered a vowel.\n",
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Strings', 'Regular Expressions', 'Fundamentals' ],
    languages: ['JavaScript']
}