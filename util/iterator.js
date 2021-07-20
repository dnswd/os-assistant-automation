function iterate(arr) {
    let data = arr
    let current = -1
    let maximum = arr.length-1

    return {
        next: function next() {
            return (++current > maximum) ? { value: data[--current], tip: true }
                                         : { value: data[current], tip: false }
        },
        back: function back() {
            return (--current < 0) ? { value: data[++current], tip: true } 
                                   : { value: data[current], tip: false }
        }
    }
}

export default iterate