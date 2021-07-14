import Grader from './util/grader.js'
import { getStudentsArray } from './util/io.js';
import { allHasBacklink, allHasRepo, allHasTop10, allHasWeek } from './util/checker.js'
import { config as readEnv } from 'dotenv'
// const Grader = require('./util/grader');

async function entry() {
    
    // // const browser = await chromium.launch(); 
    // // const ctx = await browser.newContext();
    
    // // students = ['dnswd'];
    // const schema = grader.newSchema(students);
    
    // let aaa = students.map(async student => await automate(schema, student))
    // aaa = await Promise.allSettled(aaa).then(() => writeReport(schema))
    
    // // browser.close()

    // const students = ['dnswd']
    const students = await getStudentsArray();
    Grader.buildSchema(students)
    const hasRepo = await allHasRepo(students)
    const hasWeek = await allHasWeek(hasRepo)
    await allHasBacklink(hasWeek)
    await allHasTop10(hasWeek)
    await Grader.writeReport()
    await Grader.saveState()
    return Promise.resolve()
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

entry().then(() => { console.log('bye!'); process.exit(0) });