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

  }) //end describe(`GET '/books'`)


  //POST '/book'
  describe(`POST '/book'`, ()=>{

    it('should NOT create a new book if http body is missing required book values', done =>{
      chai.request(server)
          .post('/book')
          .send({
            "title": "Twenty Thousand Leagues Under the Sea"
          })
          .end((err,res)=>{
            assert.equal(res.status, 500)
            assert.hasAllKeys(res.body, ['status','errorMessage'])
            assert.equal(res.body.errorMessage, 'Error adding new book to collection')
            done()
          })
    })

    it(`should create a new book when http body is passed 'title', 'author', 'year', 'pages'`, done =>{
      chai.request(server)
          .post('/book')
          .send({
            title: 'Twenty Thousand Leagues Under the Sea',
            author: 'Jules Verne',
            year: 1870,
            pages: 256
          })
          .end((err,res)=>{
            assert.equal(res.status, 200)
            assert.isObject(res.body)
            assert.hasAllKeys(res.body, ['message','book'])
            assert.hasAllKeys(res.body.book, ['__v','_id','title','author','year','pages','createdAt'])
            assert.equal(res.body.book.title, 'Twenty Thousand Leagues Under the Sea')
            assert.equal(res.body.book.author, 'Jules Verne')
            assert.equal(res.body.book.year, 1870)
            assert.equal(res.body.book.pages, 256)
            done()
          })
    })

  }) //end describe(`POST '/book'`)


  //GET '/books'
  describe(`GET '/book/:id'`, ()=>{

    it(`should get 404 'Not Found' error if given id does not exist`, done =>{
      chai.request(server)
          .get('/book/12345')
          .end((err,res)=>{
            assert.equal(res.status,404)
            assert.hasAllKeys(res.body, ['status','errorMessage'])
            assert.equal(res.body.errorMessage, 'Book not found')
            done()
          })
    })

    it(`should get a book by the given id`, done =>{
      //fill database with new book, then query for it and check response
      (async ()=>{
        const newBook = new Book({
          "title": "Twenty Thousand Leagues Under the Sea",
          "author": "Jules Verne",
          "year": 1870,
          "pages": 256
        })
        const {id:bookId} = await newBook.save()

        chai.request(server)
        .get(`/book/${bookId}`)
        .end((err,res)=>{
          assert.equal(res.status,200)
          assert.isObject(res.body)
          assert.hasAllKeys(res.body, ['__v','_id','title','author','year','pages','createdAt'])
          assert.equal(res.body.title, 'Twenty Thousand Leagues Under the Sea')
          assert.equal(res.body.author, 'Jules Verne')
          assert.equal(res.body.year, 1870)
          assert.equal(res.body.pages, 256)
          done()
        })
      })()
    })

  }) //end describe(`GET '/book/:id'`)


}) //end describe('Books'
