const reset = '\x1b[0m'

const info = (...args) => {
    if (process.env.NODE_ENV !== 'test') {
        const green = '\x1b[32m'
        console.log(green, ...args, reset);
    }
}

const error = (...args) => {
  if (process.env.NODE_ENV !== 'test') {
    const red = '\x1b[31m'
    console.error(red, ...args, reset);
  }
}

module.exports = { info, error }