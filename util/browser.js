import Grader from './grader.js'
import IT from './iterator.js'
import { chromium } from 'playwright' // change this according to your playwright-flavor
import { getTop10Links } from './checker.js'
import readline from 'readline';
import { stderr } from 'process';
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

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
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        
        for (const student of students) {
            const week = `https://${student}.github.io/${process.env.repo}/W${process.env.week}`
            const main = await ctx.newPage()
            const [links, _] = await Promise.allSettled([getTop10Links(student), main.goto(week)])
            const it = IT(links.value)
            const check = await ctx.newPage()
            
            let { value, tip } = it.next()
            await check.goto(value, { timeout: 0, waitUntil: "load" })

            await new Promise(resolve => {
                process.stdin.on('keypress', async (str, key) => {
                    if (key.name === 'escape') {
                        await main.close()
                        await check.close()
                        await Grader.saveState()
                        resolve()
                    }

                    else if (key.sequence === '[' ) {
                        let { value, tip } = it.back()
                        if (tip) console.log('We\'re already on the tip')
                        else {
                            console.log(`back - ${value}`)
                            try {
                                await check.goto(value, { timeout: 0, waitUntil: "load" })
                            } catch (error) { }
                        }
                    }

                    else if (key.sequence === ']' ) {
                        let { value, tip } = it.next()
                        if (tip) console.log('We\'re already on the tip')
                        else {
                            console.log(`next - ${value}`)
                            try {
                                await check.goto(value, { timeout: 0, waitUntil: "load" })
                            } catch (error) { }
                        }
                    }

                    else if (key.sequence === '`' ) {
                        console.log('Resetting manual grading schema')
                        Grader.resetManual(student)
                    }

                    else if (key.sequence === '1' ) {
                        console.log(`Point given to ${student} for relevancy`)
                        Grader.linkIsRelevant(student)
                    }

                    else if (key.sequence === '2' ) {
                        console.log(`Point given to ${student} for valid description`)
                        Grader.linkHasValidDescription(student)
                    }

                    else if (key.sequence === '3' ) {
                        console.log(`Point given to ${student} for good links`)
                        Grader.linkIsAmazing(student)
                    }

                });
            })
        }
        process.stdin.removeAllListeners('keypress')
        process.stdin.setRawMode(false);
    }
    
    async function close() {
        await browser.close()
        browser = undefined
        ctx = undefined
        return Promise.resolve(true)
    }


export default { ready, run, close }