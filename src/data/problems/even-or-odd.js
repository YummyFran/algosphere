import assert from "assert"
import { getRankDetails } from "../../utils/helper";

const starterCode = `function evenOrOdd(number) {
  // Write your code here
}`

const handler = (evenOrOdd) => {
    try {
        assert.strictEqual(evenOrOdd(2), "Even")
        assert.strictEqual(evenOrOdd(7), "Odd");
        assert.strictEqual(evenOrOdd(-42), "Even");
        assert.strictEqual(evenOrOdd(-7), "Odd");
        assert.strictEqual(evenOrOdd(0), "Even");
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const evenOrOdd = {
    name: 'Even or Odd',
    slug: 'even-or-odd',
    category: 'reference',
    rank: {
        ...getRankDetails(8),
        slug: '8',
    },
    problemStatement: 'Create a function that takes an integer as an argument and returns `"Even"` for even numbers or `"Odd"` for odd numbers.\n',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Mathematics', 'Fundamentals' ],
    languages: ['JavaScript']
}

