const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.body = 'user'
})

module.exports = router
