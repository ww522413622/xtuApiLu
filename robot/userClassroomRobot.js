const schedule = require('node-schedule')
const request = require('superagent')

const URL = 'https://xtuapi.magicallu.cn/v1/user/classroom'
// const URL = 'http://localhost:3000/v1/user/classroom'

const getDay = () => {
  schedule.scheduleJob('11 11 0 * * *', () => {
    for (let i = 0; i <= 1; i++) {
      request.post(URL)
        .send({
          byName: 1,
          day: 1,
          isRobot: 1
        })
        .end((err, data) => {
          console.log(`${Date.now()} 数据byName: ${i} 已更新`)
        })
    }
  })
}

getDay()
