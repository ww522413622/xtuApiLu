const fs = require('fs')
const path = require('path')
const request = require('superagent')
const charset = require('superagent-charset')
charset(request)
const cheerio = require('cheerio')
const eventproxy = require('eventproxy')
const config = require('../config/default')
// const mongo = require('../store/mongo')

module.exports = (req, res, target, html) => {
  console.log(`正在获取 ${target} 下的数据`)
  let $ = cheerio.load(html),
      list = [],
      $cur = $('.list a'),
      charset = 'utf8'

  if (target === 'news' || target === 'media') {
    charset = 'gbk'
  }

  // 处理在“媒体湘大”列表类名不统一的问题
  target === 'media' && ($cur = $('.newsgridlist a'))

  // 获取 list 下的数据
  for (let i = 0, len = $cur.length; i < len; i++) {
    let temp = {},
        $a = $($cur[i])

    temp.href = $a.attr('href').indexOf('http') > -1
      ? $a.attr('href')
      : config.xtuUrl.trend.host + $a.attr('href')
    temp.title = $a.attr('title')
    temp.time = $a.find('span').text()

    // 处理在“媒体湘大”列表域名、时间不统一的问题
    if (target === 'media') {
      temp.href = temp.href.replace(/w{3}/g, 'news')
      $('li').eq(i).text().trim().replace(/\[(\d{4})\/(\d{2})\/(\d{2})\]/g, function (match, g1, g2, g3) {
        temp.time = [g1, g2, g3].join('-')
      })
    }
    list.push(temp)
  }

  let ep = new eventproxy(),
      count = req.params.count || list.length
  count > list.length && (count = list.length)

  // 并发获取所有详情页的信息
  ep.after('getDetail', count, function (details) {
    details = details.map(detail => {
      $ = cheerio.load(detail.html)
      let temp = {}
      temp.title = detail.el.title
      temp.time = detail.el.time
      temp.href = detail.el.href

      let $content
      if (target === 'news' || target === 'media') {
        $content = $('div.content')
      } else if (target === 'notice' || target === 'cathedra') {
        $content = $('.con-tent-box')
      }

      temp.content = require('./trendFormatConent')($content.text().split(/[\r\n\t]/))
      // 若是新闻，则需在内容中添加来源
      target === 'news' && (temp.content.push($($content[0].nextSibling.next).text()))
      // 若是媒体，则需除去最后一行的链接
      target === 'media' && temp.content.length !== 1 && temp.content.pop()
      // 若是讲座、公告，则需除去第一行的标题
      ;(target === 'cathedra' || target === 'notice') && temp.content.shift()

      // let model = new mongo[mongo.getFullkey(target)]({
      //   title: temp.title,
      //   time: temp.time,
      //   href: temp.href,
      //   content: temp.content
      // })
      // model.save()
      // console.log(mongo.getFullkey(target))
      return temp
    })
    // 排序并获取咨询的来源
    details = require('./trendSort')(details)
    details = require('../filters/index').trendSource(target, details)
    console.log('=== 成功获取动态 ===')
    res.status(200).send(details)
  })

  for (let i in list) {
    let el = list[i]
    if (parseInt(i) === count) { break }
    request
      .get(el.href)
      .charset(charset)
      .end((err, sres) => {
        if (err) { throw new Error(`获取 ${target} 详情失败`)}
        console.log(`正在爬取 ${el.href}`)
        ep.emit('getDetail', { html: sres.text, el })
      })
  }

}