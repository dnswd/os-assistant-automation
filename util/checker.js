import urlExist from 'url-exist'
import Grader from './grader.js'
import plimit from 'p-limit'
import { JSDOM } from 'jsdom'

/**
 * These code are so bad, Adopro lecturers would cringe
 * May god forgive me for writing this heresy
 */

async function hasRepo(student) {
    const link = `https://${student}.github.io/${process.env.repo}/`
    let retry = parseInt(process.env.retry)
    let isAlive

    do {
        isAlive = await urlExist(link)
    } while (!isAlive && retry--);

    if (!isAlive) {
        Grader.repoNotExist(student)
        return Promise.reject(student)
    }

    return Promise.resolve(student)
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
    }
    Grader.weekNotExist(student)
    return Promise.reject(student)
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
    const link = `https://${student}.github.io/${process.env.repo}/`
    let dom
    
    do {
        try {
            dom = await JSDOM.fromURL(link)
        } catch(err) { }
    } while (!dom)
    
    let anchors = dom.window.document.querySelectorAll('a[href]')
    anchors = Array.from(anchors).filter(a => {
        return a.href.includes(`/${process.env.repo}/W${process.env.week}`) || a.href.includes(`/${process.env.repo}/w${process.env.week}`)
    })
    
    if (anchors.length > 0) {
        Grader.isAccessible(student)
        return Promise.resolve(student)
    }
    Grader.notAccessible(student)
    return Promise.reject(student)
}

async function allHasBacklink(students) {
    const limit = plimit(parseInt(process.env.pool))
    const checkUp = students.map((student) => limit(hasBacklink, student))
    const result = await Promise.allSettled(checkUp)
    const fulfilled = result.filter(checked => checked.status != 'rejected')
                         .map(student => student.value)

    return Promise.resolve(fulfilled)
}

async function checkTop10(student) {
    const link = `https://${student}.github.io/${process.env.repo}/W${process.env.week}/`
    let dom
    
    do {
        try {
            dom = await JSDOM.fromURL(link)
        } catch(err) {
            try {
                dom = await JSDOM.fromURL(link.toLowerCase())
            } catch(err) { }
         }
    } while (!dom)
    
    let anchors = await dom.window.document.querySelectorAll('ol li a[href]:first-child')
    if (anchors.length === 0) 
        anchors = await dom.window.document.querySelectorAll('ul li a[href]:first-child')
    if (anchors.length === 0) 
        anchors = await dom.window.document.querySelectorAll('h2 a[href]:first-child')
    if (anchors.length === 0) 
        anchors = await dom.window.document.querySelectorAll('h3 a[href]:first-child')
    if (anchors.length === 0) 
        anchors = await dom.window.document.querySelectorAll('h4 a[href]:first-child')
    if (anchors.length === 0) 
        anchors = await dom.window.document.querySelectorAll('h5 a[href]:first-child')
    if (anchors.length === 0) 
        anchors = await dom.window.document.querySelectorAll('h6 a[href]:first-child')
    if (anchors.length === 0) 
        anchors = await dom.window.document.querySelectorAll('a[href]')
    
    // in case the bottom-most query is reached, filter links from the same site
    const links = Array.from(anchors)
                       .map(a => a.href)
                       .filter(a => !a.includes(`/${process.env.repo}/W${process.env.week}`) || 
                                    !a.includes(`/${process.env.repo}/w${process.env.week}`) || 
                                    !a.includes(student))

    const limit = plimit(10)
    const checkUp = links.map((link) => limit(urlExist, link))
    const result = await Promise.allSettled(checkUp)
    const active = result.filter(checked => checked.status != 'rejected')
                         .map(student => student.value)
    
    if (active.length > 9) {
        Grader.existLinks(student)
        return Promise.resolve(student)
    }
    const inactive = result.filter(checked => checked.status == 'rejected')
                           .map(student => student.reason)
    Grader.linksNotExist(student, inactive)
    return Promise.reject(student)
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