import Grader from './grader.js'
import IT from './iterator.js'
import { chromium } from 'playwright' // change this according to your playwright-flavor
import { getTop10Links } from './checker.js'

let browser;
let ctx;
let students;

    async function ready(studentArr) {
        if (!browser) {
            browser = await chromium.launch({ headless: false })
            ctx = await browser.newContext({ colorScheme: 'light' }) // change to dark if u want
            students = studentArr
        }
        return Promise.resolve(true)
    }
    
    async function run(){
        for (const student of students) {
            const week = `https://${student}.github.io/${process.env.repo}/W${process.env.week}`
            const main = await ctx.newPage()
            const [links, _] = await Promise.allSettled([getTop10Links(student), main.goto(week)])
            console.log(links)
            const it = IT(links.value)
            const check = await ctx.newPage()

            while (true) {
                let { value, tip } = it.next()
                if (tip) break
                try {
                    await check.goto(value, { timeout: 0, waitUntil: "load" })
                } catch (error) { }
                await new Promise(r => setTimeout(r, 3000));
            } 
            console.log('done')
            while (true) {
                let { value, tip } = it.back()
                if (tip) break
                try {
                    await check.goto(value, { timeout: 0, waitUntil: "load" })
                } catch (error) { }
                await new Promise(r => setTimeout(r, 3000));
            } 
            console.log('done 2')
        }
    }
    
    async function close() {
        await browser.close()
        browser = undefined
        ctx = undefined
        return Promise.resolve(true)
    }


export default { ready, run, close }