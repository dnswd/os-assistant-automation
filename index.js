import Grader from './util/grader.js'
import { getStudentsArray } from './util/io.js';
import { allHasBacklink, allHasRepo, allHasTop10, allHasWeek } from './util/checker.js'
import { config as readEnv } from 'dotenv'
import { question } from 'readline-sync'

function logConfig() {
    console.log(`Repo     : ${process.env.repo}`)
    console.log(`Week     : W${process.env.week}`)
    console.log(`Pool     : ${process.env.pool} process(es)`)
    console.log(`Max Retry: ${process.env.retry}`)
}

async function entry() {
    
    // // const browser = await chromium.launch(); 
    // // const ctx = await browser.newContext();
    
    // // students = ['dnswd'];
    // const schema = grader.newSchema(students);
    
    // let aaa = students.map(async student => await automate(schema, student))
    // aaa = await Promise.allSettled(aaa).then(() => writeReport(schema))
    
    // // browser.close()

    // const students = ['dnswd']

    let response
    do {
        response = question('\n> ').split(' ')

        switch (response[0]) {
            case 'automate':
                console.log('Listing all students')
                const students = await getStudentsArray();
                Grader.buildSchema(students)
                console.log('Checking student repo availability')
                const hasRepo = await allHasRepo(students)
                console.log(`Checking W${process.env.week} availability`)
                const hasWeek = await allHasWeek(hasRepo)
                console.log('Checking week backlinks')
                await allHasBacklink(hasWeek)
                console.log('Checking Top 10 backlinks')
                await allHasTop10(hasWeek)
                await Grader.writeReport()
                await Grader.saveState()
                console.log('Finished, state and report are recoded.')
                break;
                
            case 'save':
                await Grader.saveState()
                break

            case 'load':
                let isLoaded = await Grader.loadState()
                if (isLoaded) 
                    console.log('State loaded')
                else 
                    console.log('[ERR] Can\'t load state')
                break

            case 'config':
                logConfig()
                break

            case 'poolsize':
                if (!!response[1]) process.env['pool'] = response[1]
                else console.log(process.env.pool)
                break

            case 'e':
            case 'exit':
                return Promise.resolve()

            default:
                break;
        }
    } while (true)

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