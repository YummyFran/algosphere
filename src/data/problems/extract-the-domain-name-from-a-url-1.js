import { getRankDetails, assert } from "../../utils/helper";

const starterCode = `function domainName(url){
  //your code here
}`

const handler = `
${assert}

self.onmessage = function(e) {
    try {
        const domainName = new Function(\`return \${e.data}\`)()

        assert.strictEqual(domainName("http://google.com"), "google")
        assert.strictEqual(domainName("http://google.co.jp"), "google")
        assert.strictEqual(domainName("www.xakep.ru"), "xakep")
        assert.strictEqual(domainName("https://youtube.com"), "youtube")
        
        self.postMessage(assert.results)
    } catch (error) {
        self.postMessage(error)
    }   
}
`

export const extractTheDomainNameFromAUrl1 = {
    name: 'Extract the domain name from a URL',
    slug: 'extract-the-domain-name-from-a-url-1',
    category: 'reference',
    rank: {
        ...getRankDetails(5),
        slug: '5',
    },
    problemStatement: 'Write a function that when given a URL as a string, parses out just the domain name and returns it as a string. For example:\n' +
    '```\n' +
    '* url = "http://github.com/carbonfive/raygun" -> domain name = "github"\n' +
    '* url = "http://www.zombie-bites.com"         -> domain name = "zombie-bites"\n' +
    '* url = "https://www.cnet.com"                -> domain name = cnet"\n' +
    '```',
    handlerFunction: handler,
    starterCode: starterCode,
    tags: [ 'Parsing', 'Regular Expressions' ],
    languages: ['JavaScript']
}