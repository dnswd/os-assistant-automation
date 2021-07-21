import Grader from './util/grader.js'
import PW from './util/browser.js'
import { getStudentsArray } from './util/io.js';
import { allHasBacklink, allHasRepo, allHasTop10, allHasWeek } from './util/checker.js'
import { config as readEnv } from 'dotenv'
import { question } from 'readline-sync'

function logConfig() {
    console.log(`Repo      : ${process.env.repo}`)
    console.log(`Week      : W${process.env.week}`)
    console.log(`Pool      : ${process.env.pool} process(es)`)
    console.log(`Max Retry : ${process.env.retry}`)
}

async function entry() {
    
    // let check;
    // const students = await getStudentsArray()
    // check = await PW.ready(students)
    // console.log(check)
    // const step = await PW.run()
    // console.log(step)

    const students = ['dnswd']
    Grader.buildSchema(students)
    await PW.ready(students)
    await PW.run()
    await PW.close()
}
readEnv()

let args = process.argv.slice(2);
if (args.length == 2) {
    process.env['repo'] = args[0];
    process.env['week'] = args[1].padStart(2, '0');
} else if (args.length == 1) {
    process.env['repo'] = 'os211';
    process.env['week'] = args[0].padStart(2, '0');
} else {
    process.env['repo'] = 'os211';
    process.env['week'] = '01';
}

console.log('Initialization complete')
console.log('=======================')
logConfig()
console.log('=======================')

entry().then(() => { console.log('bye!'); process.exit(0) });