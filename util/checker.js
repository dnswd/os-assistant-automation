import urlExist from 'url-exist'
import Grader from './grader.js'
import plimit from 'p-limit'
import { JSDOM } from 'jsdom'

/**
 * These code are so bad, Adopro lecturers would cringe
 */

async function hasRepo(student) {
    const link = `https://${student}.github.io/${process.env.repo}/`
    let retry = parseInt(process.env.retry)
    let isAlive

    do {
        isAlive = await urlExist(link)
    } while (!isAlive && retry--);

    if (!isAlive) Grader.repoNotExist(student)

    return (!isAlive) ? Promise.reject(student) : Promise.resolve(student)
}

async function allHasRepo(students) {
    const limit = plimit(parseInt(process.env.pool))
    const checkUp = students.map((student) => limit(hasRepo, student))
    const result = await Promise.allSettled(checkUp)
    const failed = result.filter(checked => checked.status != 'rejected')
                         .map(student => student.value)

    return Promise.resolve(failed)
}

async function hasWeek(student) {
    const link = `https://${student}.github.io/${process.env.repo}/W${process.env.week}`
    let retry = parseInt(process.env.retry)
    let isAlive

    do {
        isAlive = await urlExist(link)
        if (!isAlive)
            isAlive = await urlExist(link.toLowerCase())
    } while (!isAlive && retry--);

    if (isAlive) {
        Grader.existWeek(student)
        return Promise.resolve(student)
    } else {
        Grader.weekNotExist(student)
        return Promise.reject(student)
    }
}

async function allHasWeek(students) {
    const limit = plimit(parseInt(process.env.pool))
    const checkUp = students.map((student) => limit(hasWeek, student))
    const result = await Promise.allSettled(checkUp)
    const failed = result.filter(checked => checked.status != 'rejected')
                         .map(student => student.value)

    return Promise.resolve(failed)
}

async function hasBacklink(student) {
    const link = `https://${username}.github.io/${repo}/`
    const dom = await JSDOM.fromURL(link)

    // let retry = parseInt(process.env.retry)
    // let dom;
    // do {
    //     dom = await JSDOM.fromURL(link)
    // } while (!dom && retry--)
    
    const anchors = dom.window.document.querySelectorAll('a[href]')
    anchors = Array.from(anchors)
                   .filter(a => a.href.includes(`/${repo}/W${week}`) || a.href.includes(`/${repo}/w${week}`))

    
    if (anchors.length > 0) {
        Grader.isAccessible(student)
        return Promise.resolve(student)
    } else {
        Grader.notAccessible(student)
        return Promise.reject(student)
    }
}

async function allHasBacklink(students) {
    const limit = plimit(parseInt(process.env.pool))
    const checkUp = students.map((student) => limit(hasBacklink, student))
    const result = await Promise.allSettled(checkUp)
    const failed = result.filter(checked => checked.status != 'rejected')
    .map(student => student.value)
    
    return Promise.resolve(failed)
}

async function checkTop10(student) {
    const link = `https://${username}.github.io/${repo}/W${week}/`
    const dom = await JSDOM.fromURL(link)
    
    // let retry = parseInt(process.env.retry)
    // let dom;
    // do {
    //     dom = await JSDOM.fromURL(link)
    // } while (!response && retry--)
    
    let links = await dom.window.document.querySelectorAll('ol li a[href]:first-child')
    if (links.length === 0) 
        links = await dom.window.document.querySelectorAll('ul li a[href]:first-child')
    if (links.length === 0) 
    links = await dom.window.document.querySelectorAll('h2 a[href]:first-child')
    if (links.length === 0) 
        links = await dom.window.document.querySelectorAll('h3 a[href]:first-child')
    if (links.length === 0) 
    links = await dom.window.document.querySelectorAll('h4 a[href]:first-child')
    if (links.length === 0) 
    links = await dom.window.document.querySelectorAll('h5 a[href]:first-child')
    if (links.length === 0) 
    links = await dom.window.document.querySelectorAll('h6 a[href]:first-child')
    if (links.length === 0) 
    links = await dom.window.document.querySelectorAll('a[href]')
    
    // in case the bottom-most query is reached, filter links from the same site
    links = Array.from(anchors)
                 .filter(a => !a.href.includes(`/${repo}/W${week}`) || !a.href.includes(student))

    const limit = plimit(10)
    const checkUp = students.map((student) => limit(urlExist, student))
    const result = await Promise.allSettled(checkUp)
    const active = result.filter(checked => checked.status != 'rejected')
                         .map(student => student.value)
    
    if (active.length > 9) {
        Grader.existLinks(student)
        return Promise.resolve(student)
    } else {
        const inactive = result.filter(checked => checked.status == 'rejected')
                             .map(student => student.reason)
        Grader.linksNotExist(student, inactive)
        return Promise.reject(student)
    }
}

async function allHasTop10(students) {
    const limit = plimit(5) // check 5 students at the same time | 10*5 = 50 available pool
    const checkUp = students.map((student) => limit(checkTop10, student))
    const result = await Promise.allSettled(checkUp)
    const failed = result.filter(checked => checked.status != 'rejected')
                         .map(student => student.value)
    
    return Promise.resolve(failed)
}

export { allHasRepo, allHasWeek, allHasBacklink, allHasTop10 }