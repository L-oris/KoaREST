const Router = require('koa-router')

const router = new Router()

router.get('/test', async ctx=>{
  ctx.body = {
    message: 'Welcome to our Bookstore!'
  }
})

router.post('/test', async ctx=>{
  const httpBody = ctx.request.body
  ctx.body = Object.assign({},httpBody,{
    request: 'POST REQUEST'
  })
})

module.exports = router
