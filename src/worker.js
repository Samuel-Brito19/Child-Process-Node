const {v1} = require('uuid')
const querystring = require('querystring')
const {join} = require('path')

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

async function render({finalURI,name }) {
    const output = join(__dirname, `./../output/${name}-${v1()}.pdf`)
    const browser = await puppeteer.launch({
        // headless: false
    })
    const page = await browser.newPage()
    await page.goto(finalURI, {waitUntil: 'networkidle2'})

    await page.pdf({
        path: output,
        format: 'A4',
        landscape: true,
        printBackground: true
    })

    await browser.close()
}

async function main(data) { 
    const pid = process.pid
    console.log(`${pid} got a message ${data.name}`)
    const qs = createQueryString(data)
    const finalURI = `${BASE_URL}?${qs}`

    try {
        await render({finalURI, name: data.name})
        process.send(`${pid} has finished!`)
    } catch (error) {
        process.send(`${pid} has broken! ${error.stack}`)
    }
}

process.once("message", main)