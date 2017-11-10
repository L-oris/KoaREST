//During the test the env variable is set to 'test'
process.env.NODE_ENV = 'test'

const server = require('../server'),
      //MongoDB
      mongoose = require('mongoose'),
      Book = require('../models/book'),
      //tests
      chai = require('chai'),
      {assert} = require('chai'),
      chaiHttp = require('chai-http')


//HTTP integration testing with Chai assertions
chai.use(chaiHttp)



describe('Books', ()=>{

  //empty collection before each test, then fill it with one book
  beforeEach(done =>{
    (async ()=>{
      await Book.remove({})
      const newBook = new Book({
        "title": "Harry Potter",
        "author": "J.K.Rowling",
        "year": 2011,
        "pages": 482
      })
      await newBook.save()
      done()
    })()
  })

  //empty collection after all tests
  after(done =>{
    (async ()=>{
      await Book.remove({})
      done()
    })()
  })


  //GET '/books'
  describe(`GET '/books'`, ()=>{

    it('should get all the books', done =>{
      chai.request(server)
          .get('/books')
          .end((err,res)=>{
            assert.equal(res.status,200)
            assert.isArray(res.body)
            assert.lengthOf(res.body, 1)
            done()
          })
    })

  })


})
