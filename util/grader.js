import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';

const Grader = (() => {
    let instance;
    
    function newSchema(usernames) {
        const scheme = { }
        for (const username of usernames) {
            scheme[username] = { data: [0, 0, 0, 0, 0, 0], failed: {} }
        }
        return scheme
    }
    
    function repoNotExist(username, links) {
        instance[username]['failed']['repo'] = 1;
    }

    // browser.js/checkWeek
    function existWeek(username) {
        instance[username]['data'][0] = 1;
    }
    
    function weekNotExist(username) {
        instance[username]['failed']['week'] = `W${process.env.week}`;
    }
    
    // browser.js/checkAccessible
    function isAccessible(username) {
        instance[username]['data'][1] = 1;
    }
    // browser.js/checkAccessible
    function notAccessible(username) {
        instance[username]['failed']['backlink'] = `/${process.env.repo}/W${process.env.week}`;
    }
    
    // browser.js/countAlive
    function existLinks(username) {
        instance[username]['data'][2] = 1;
    }
    
    // browser.js/countAlive
    function linksNotExist(username, links) {
        instance[username]['failed']['top10'] = links;
    }

    // record top10 links
    function saveLinks(username, links) {
        instance[username]['links'] = links
    }

    // TODO: Write to file here
    async function writeReport() {
        const [repo, week] = [process.env.repo, process.env.week]
        const week_report = path.join(process.cwd(), repo, `W${week}`)

        try {
            await mkdirp(week_report)
        } catch(err) {
            console.error('Can\'t create directory: ' + week_report)
            process.exit(1)
        }
    
        const writer = fs.createWriteStream(path.join(week_report, `report-${Math.round(Date.now())}.txt`))
        for (const [student, entry] of Object.entries(instance)) {
            const line = [student].concat(entry.data)
            writer.write(line.join(' ') + '\r\n')
        }

        writer.end()
        return Promise.resolve()
    }

    return {
        buildSchema: (usernames) => {
            if (!instance) {
                instance = newSchema(usernames)
            }
            return instance
        },
        getSchema: () => {
            return (!!instance) ? instance : null
        },
        repoNotExist,
        existWeek,
        weekNotExist,
        isAccessible,
        notAccessible,
        existLinks,
        linksNotExist,
        saveLinks,
        writeReport
    }
})()

export default Grader
