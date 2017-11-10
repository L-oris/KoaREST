const Koa = require('koa'),
      bodyParser = require('koa-body'),
      morgan = require('koa-morgan'),
      mongoose = require('mongoose')


const app = new Koa(),
      router = require('./router')


//ERROR HANDLING
app.use(async (ctx,next)=>{
  try {
    await next()
  } catch(err){
    ctx.status = err.status || 500
    ctx.body = {
      status: err.status || 500,
      errorMessage: err.message || `Internal Server Error`
    }
    //disable error logs when testing
    if(process.env.NODE_ENV !== 'test'){
      console.log(`Server Error --> ${err}`);
    }
  }
})


//MONGO DB
//allow using mongoose with async-await
mongoose.Promise = global.Promise

const {DBHost} = require(`./config/${process.env.NODE_ENV}.json`)
mongoose.connect(DBHost, { useMongoClient: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))


//MIDDLEWARES
app.use(bodyParser())
//disable morgan when testing
if(process.env.NODE_ENV !== 'test'){
  app.use(morgan(':method :url :status'))
}


//SERVE STATIC FILES
app.use(require('koa-static-server')({
  rootDir: 'static',
  rootPath: '/static'
}))


//ROUTER
app.use(router.routes())


const PORT = 3000
const server = app.listen(PORT).on('error', err => console.error(err))
console.log(`Server listening on port ${PORT}`)


//for testing
module.exports = server
