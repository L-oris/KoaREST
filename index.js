const Koa = require('koa'),
      bodyParser = require('koa-body'),
      morgan = require('koa-morgan')

const app = new Koa(),
      router = require('./router')


//error handling
app.use(async (ctx,next)=>{
  try {
    await next()
  } catch(err){
    console.log(`Koa Error --> ${err}`);
    ctx.status = err.status || 500
    ctx.body = {
      error: 'Error happened'
    }
  }
})

//MIDDLEWARES
app.use(morgan(':method :url :status'))
app.use(bodyParser())

//SERVE STATIC FILES
app.use(require('koa-static-server')({
  rootDir: 'static',
  rootPath: '/static'
}))

//ROUTER
app.use(router.routes())
   .use(router.allowedMethods())


app.listen(3000)
