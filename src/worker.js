const {v1} = require('uuid')
const querystring = require('querystring')

const puppeteer = require('puppeteer')

const BASE_URL = "https://erickwendel.github.io/business-card-template/index.html"

function createQueryString(data) {

    const separator = null
    const keyDeliniter = null
    const options = {
        encodeURLComponent: querystring.unescape
    }
    const qs = querystring.stringify(
        data,
        separator,
        keyDeliniter,
        options
    )
    return qs
}
async function main(message) {
    const pid = process.pid
    console.log(`${pid} got a message`, message.name)
    const qs = createQueryString(message)
    const finalURI = `${BASE_URL}?${qs}`
    console.log(finalURI)
}

process.once("message", main)