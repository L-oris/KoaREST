const Router = require('koa-router'),
      router = new Router()

const bookMethods = require('./dbMethods/book')


router.get('/', ctx=>{
  ctx.body = {message: 'Welcome to our Bookstore!'}
})

router.get('/books', bookMethods.getBooks)

router.post('/book', bookMethods.addBook)

router.get('/book/:id', bookMethods.getBookById)

router.delete('/book/:id', bookMethods.deleteBookById)

router.put('/book/:id', bookMethods.updateBookById)

//catch all falling requests
router.all('*', ctx => {
  const error = new Error(`Route ${ctx.request.method}'${ctx.request.url}' does not exist`)
  error.status = 404
  throw error
})


module.exports = router
