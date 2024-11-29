import { getRankDetails, assert } from "../../../utils/helper";

const starterCode = `function moveZeros(arr) {
  return
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const moveZeros = new Function(\`return \${e.data}\`)()

        assert.strictEqual(moveZeros([1,2,0,1,0,1,0,3,0,1]), [1, 2, 1, 1, 3, 1, 0, 0, 0, 0]);

        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const moveZeros = {
    name: 'Moving Zeros To The End',
    slug: 'moving-zeros-to-the-end',
    category: 'algorithms',
    rank: {
        ...getRankDetails(5),
        slug: '5',
    },
    problemStatement: 'Write an algorithm that takes an array and moves all of the zeros to the end, preserving the order of the other elements.\n' +
    '\n' +
    '```\n' +
    'moveZeros([false,1,0,1,2,0,1,3,"a"]) // returns[false,1,1,2,1,3,"a",0,0]\n' +
    '```\n' ,
    handlerFunction: handler,
    starterCode: starterCode,
    tags:  [ 'Arrays', 'Sorting', 'Algorithms' ],
    languages: ['JavaScript']
}