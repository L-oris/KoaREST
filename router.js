const Router = require('koa-router'),
      router = new Router()

const bookMethods = require('./dbMethods/book')

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


router.get('/book', bookMethods.getBooks)

router.post('/book', bookMethods.addBook)




module.exports = router
