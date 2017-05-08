const request = require('superagent')
const charset = require('superagent-charset')
charset(request)
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const { checkList } = require('../filters/userClassroom')
const header = require('../config/default').header
const user = require('../config/default').xtuUrl.user
const classroomDataDir = path.join(__dirname, '../store')

module.exports = (req, res, session) => {
  let day = req.body.day || 0
  ;(day < 0 || day > 1) && (day = 0)
  const classroomUrl = user.host + user.path.classroom

  request.post(classroomUrl)
    .send({
      xzlx: day
    })
    .set(header)
    .set('Cookie', session)
    .charset('utf-8')
    .end((err, sres) => {
      if (err) { throw new Error('获取空闲教室失败') }

      let $ = cheerio.load(sres.text)
      let table = []

      $('#dataList').find('tr').each((idx, tr) => {
        if (idx <= 1) return
        let $tr = $(tr),
            item = {},
            tdArr = $tr.find('td')

        item.classroomName = $(tdArr[0]).text().trim()
        item.classroomTime = []

        for (let i = 1; i < 6; i ++) {
          item.classroomTime.push($(tdArr[i]).text().trim())
        }
        table.push(item)
      })

      let data = table,
          Time = []

      data.map((el, idx) => {
        let name = el.classroomName,
            time = el.classroomTime

        time.map((t, i) => {
          if (t === '空') {
            Time[i] || (Time[i] = [])
            let curTime = Time[i]

            let { curIdx, nextName } = (function (name, curTime) {
              let curName = name,
                  nextName = name,
                  pos = name.search(/\w/g)
                  isClassroom = checkList('classroomList')(name),
                  isNorthOrSouth = checkList('northOrSouthList')(name)

              if (/\-/g.test(name)) {
                curName = name.split('-')[0]
                nextName = name.split('-')[1]
              } else if (pos !== -1){
                curName = name.slice(0, pos)
                nextName = name.slice(pos)
              } else {
                if (isNorthOrSouth) {
                  curName = name.substring(0, 2) + '阶梯'
                } else if (isClassroom) {
                  curName = isClassroom + '楼'
                }
                // console.log(name)
                // 如下皆为不含具体教室的数据
                // console.log(name, isNorthOrSouth)
              }

              for (let i = 0, len = curTime.length; i < len; i ++) {
                if (curTime[i].name.indexOf(curName) === 0) {
                  return {
                    nextName,
                    curIdx: i
                  }
                }
              }

              curTime.push({ name: curName, room: [] })
              return {
                nextName,
                curIdx: curTime.length - 1
              }
            })(name, curTime)

            curTime[curIdx].room = [...curTime[curIdx].room, nextName]
          }
        })
      })

      console.log(`=== 成功获取空闲教室 ===`)
      fs.writeFileSync(classroomDataDir + '/classroom_' + day + '.json', Time)
      res.status(200).send(Time)
    })
}
