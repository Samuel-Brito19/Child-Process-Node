const data = require('../resources/data.json')
const querystring = require('querystring')
const { v1 } = require('uuid')
const {join} = require('path')

const {Cluster} = require('puppeteer-cluster')

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

async function render({page, data:{finalURI,name} }) {
    const output = join(__dirname, `./../output/${name}-${v1()}.pdf`)
    
    await page.goto(finalURI, {waitUntil: 'networkidle2'})

    await page.pdf({
        path: output,
        format: 'A4',
        landscape: true,
        printBackground: true
    })

    console.log('ended', output)
}

async function main() { 
    
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT,
            maxConcurrency:10,
        })
        await cluster.task(render)

        for(const item of data) {
            const qs = createQueryString(item)
            const finalURI = `${BASE_URL}?${qs}`
            await cluster.queue({finalURI, name: item.name})
        }
        await cluster.idle()
        await cluster.close()
        
}

main()