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

    function repoUnreachable(username) {
        instance[username]['failed']['repounreachable'] = 1;
    }

    function existWeek(username) {
        instance[username]['data'][0] = 1;
    }
    
    function weekNotExist(username) {
        instance[username]['failed']['week'] = `W${process.env.week}`;
    }
    
    function weekUnreachable(username) {
        instance[username]['failed']['weekunreachable'] = `W${process.env.week}`;
    }
    
    function isAccessible(username) {
        instance[username]['data'][1] = 1;
    }

    function notAccessible(username) {
        instance[username]['failed']['backlink'] = `/${process.env.repo}/W${process.env.week}`;
    }
    
    function existLinks(username) {
        instance[username]['data'][2] = 1;
    }
    
    function linksNotExist(username, links) {
        instance[username]['failed']['top10'] = links;
    }

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

    async function saveState() {
        const [repo, week] = [process.env.repo, process.env.week]
        const week_report = path.join(process.cwd(), repo, `W${week}`)

        try {
            await mkdirp(week_report)
        } catch(err) {
            console.error('Can\'t create directory: ' + week_report)
            process.exit(1)
        }
    
        await fs.promises.writeFile(path.join(week_report, 'state.json'), 
                                    JSON.stringify(instance, null, 2), 'utf8')
       
        return Promise.resolve()
    }

    async function loadState() {
        const [repo, week] = [process.env.repo, process.env.week]
        const week_report = path.join(process.cwd(), repo, `W${week}`)
    
        try {
            const read = await fs.promises.readFile(path.join(week_report, 'state.json'), 'utf8')
            instance = JSON.parse(read)
            return Promise.resolve(true)
        } catch (err) {
            return Promise.resolve(false)
        }

       
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
        repoUnreachable,
        existWeek,
        weekNotExist,
        isAccessible,
        notAccessible,
        existLinks,
        linksNotExist,
        weekUnreachable,
        writeReport,
        saveState,
        loadState
    }
})()

export default Grader
