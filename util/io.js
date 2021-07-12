// const fs = require('fs')
import fs from 'fs'

async function getStudentsArray() {
    let students;
    try {
        students = await fs.promises.readFile('./students.txt', { encoding:'utf8' })
    } catch(err) {
        console.error('Failed to read "students.txt"')
        process.exit(1)
    }
    
    if (students.length == 0) {
        console.error('Found no students')
        console.error('Please check the student.txt file')
        process.exit(1)
    }

    return Promise.resolve(students.split(/\r?\n/))
}

export { getStudentsArray }