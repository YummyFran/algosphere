import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function likes(names) {
  // TODO
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const likes = new Function(\`return \${e.data}\`)()

        assert.strictEqual(likes([]), 'no one likes this');
        assert.strictEqual(likes(['Peter']), 'Peter likes this');
        assert.strictEqual(likes(['Jacob', 'Alex']), 'Jacob and Alex like this');
        assert.strictEqual(likes(['Max', 'John', 'Mark']), 'Max, John and Mark like this');
        assert.strictEqual(likes(['Alex', 'Jacob', 'Mark', 'Max']), 'Alex, Jacob and 2 others like this')

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const whoLikesIt = {
    name: 'Who likes it?',
    slug: 'who-likes-it',
    category: 'reference',
    rank: {
        ...getRankDetails(6),
        slug: '6',
    },
    problemStatement:  'You probably know the "like" system from Facebook and other pages. People can "like" blog posts, pictures or other items. We want to create the text that should be displayed next to such an item.\n' +
    '\n' +
    'Implement the function which takes an array containing the names of people that like an item. It must return the display text as shown in the examples:\n' +
    '\n' +
    '```\n' +
    '[]                                -->  "no one likes this"\n' +
    '["Peter"]                         -->  "Peter likes this"\n' +
    '["Jacob", "Alex"]                 -->  "Jacob and Alex like this"\n' +
    '["Max", "John", "Mark"]           -->  "Max, John and Mark like this"\n' +
    '["Alex", "Jacob", "Mark", "Max"]  -->  "Alex, Jacob and 2 others like this"\n' +
    '```\n' +
    '\n' +
    'Note: For 4 or more names, the number in `"and 2 others"` simply increases.\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Fundamentals', 'Strings' ],
    languages: ['JavaScript']
}