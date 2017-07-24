const request = require('superagent'),
      cheerio = require('cheerio')

const config = require('../config/default'),
      YEAR = config.defaultYear,
      HLAF = config.defaultHalf,
      header = config.header,
      user = config.xtuURL.user,
      URL = user.host + user.path.exam,
      defaultTime = YEAR + '-' + HLAF

module.exports = (req, res) => {
  request
    .post(URL)
    .send('xqlbmc=&xnxqid=' + defaultTime + '&xqlb=')
    .set(header)
    .set('Cookie', req.session.xtuUser)
    .charset('utf-8')
    .end((err, sres) => {
      if (err) { throw new Error('获取信息失败') }
      let $ = cheerio.load(sres.text)
      let $tr = $('#dataList tr')
      let ret = []
      $tr.each((i, tr) => {
        if (i === 0) return
        let $td = $(tr).find('td'),
            temp = {}
        temp.name = $td.eq(2).text()
        temp.date = $td.eq(3).text().split(' ')[0]
        temp.time = $td.eq(3).text().split(' ')[1]
        temp.place = $td.eq(4).text()
        ret.push(temp)
      })

      res.status(200).json(ret)
    })
}