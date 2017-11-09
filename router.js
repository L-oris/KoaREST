const Router = require('koa-router'),
      router = new Router()

const bookMethods = require('./dbMethods/book')


router.get('/', ctx=>{
  ctx.body = {message: 'Welcome to our Bookstore!'}
})

router.get('/books', bookMethods.getBooks)

router.post('/book', bookMethods.addBook)

router.get('/book/:id', bookMethods.getBookById)



module.exports = router
