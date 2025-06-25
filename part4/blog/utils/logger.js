const reset = '\x1b[0m'

const info = (...args) => {
    const green = '\x1b[32m'
    console.log(green, ...args, reset);
}

const error = (...args) => {
    const red = '\x1b[31m'
    console.error(red, ...args, reset);
}

module.exports = { info, error }