const router = require('koa-router')()

const { url: { path: routes } } = require('../config').book
const { getToken, verifyToken } = require('../utils').token

// const loginController = require('../controllers').login.user
// const userController = require('../controllers').user

router.get('/', async (ctx, next) => {
  ctx.body = {
    topic: Object.keys(routes),
    api: '/:topic'
  }
})

router.use('/', async (ctx, next) => {
  if (ctx.url !== '/user/login') {
    const token = getToken(ctx)
    const { message, isSuccess, decoded } = await verifyToken('book')(token)

    ctx.assert(isSuccess, 401, message)
    ctx.state.decoded = decoded
  }

  await next()
})

// router.post('/login', async (ctx, next) => {
//   let { isSuccess, token, message } = await loginController(ctx.request.body)

//   ctx.assert(isSuccess, 401, message)
//   ctx.body = { token }
// })

// router.get('/:topic', async (ctx, next) => {
//   const {
//     params: { topic },
//     state: { user }
//   } = ctx

//   ctx.assert(
//     getRules.includes(topic), 404, notFoundMsg
//   )
//   ctx.body = await userController(ctx, { topic, user })
// })

// router.post('/:topic', async (ctx, next) => {
//   const {
//     params: { topic },
//     state: { user }
//   } = ctx

//   ctx.assert(
//     postRules.includes(topic), 404, notFoundMsg
//   )
//   ctx.body = await userController(ctx, { topic, user })
// })

module.exports = router
