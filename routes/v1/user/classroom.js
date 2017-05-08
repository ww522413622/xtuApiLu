const userClassroomCrawler = require('../../../crawlers/userClassroomCrawler')
const { judgeDay } = require('../../../filters/userClassroom')

module.exports = async (req, res, isUser = true) => {
  if (isUser) {
    let day = +req.body.day || 0,
        byName = +req.body.byName || 0

    ;(day < 0 || day > 1) && (day = 0)
    ;(byName < 0 || byName > 1) && (byName = 0)

    res.status(200).json(require('../../../store/classroom_' + (byName ? 'name' : 'time') + '_' + judgeDay(day) + '.json'))
  } else {
    let session = await require('./login-Alpha')(req, res, false)
    await userClassroomCrawler(req, res, session)
  }
}
