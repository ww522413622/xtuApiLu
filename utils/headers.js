const { headers, userAgent } = require('../config')

const updateHeaders = () => {
  headers['User-Agent'] = userAgent[~~(userAgent.length * Math.random())]

  return headers
}

module.exports = {
  updateHeaders
}
