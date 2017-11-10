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



  describe(`POST '/book'`, ()=>{

    it('should NOT create a new book when missing values in POST body', done =>{
      chai.request(server)
          .post('/book')
          .send({
            "title": "Around the Moon"
          })
          .end((err,res)=>{
            assert.equal(res.status, 500)
            assert.hasAllKeys(res.body, ['status','errorMessage'])
            assert.equal(res.body.errorMessage, 'Error adding new book to collection')
            done()
          })
    })

    it(`should create a new book when POST body is passed 'title', 'author', 'year', 'pages'`, done =>{
      chai.request(server)
          .post('/book')
          .send({
            title: 'Around the Moon',
            author: 'Jules Verne',
            year: 1870,
            pages: 256
          })
          .end((err,res)=>{
            assert.equal(res.status, 200)
            assert.isObject(res.body)
            assert.hasAllKeys(res.body, ['message','book'])
            assert.hasAllKeys(res.body.book, ['__v','_id','title','author','year','pages','createdAt'])
            assert.equal(res.body.book.title, 'Around the Moon')
            assert.equal(res.body.book.author, 'Jules Verne')
            assert.equal(res.body.book.year, 1870)
            assert.equal(res.body.book.pages, 256)
            done()
          })
    })

  }) //end describe(`POST '/book'`)



  describe(`GET '/book/:id'`, ()=>{

    it(`should send 404 'Not Found' error when trying to get unexisting book`, done =>{
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
          "title": "Around the Moon",
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
              assert.equal(res.body.title, 'Around the Moon')
              assert.equal(res.body.author, 'Jules Verne')
              assert.equal(res.body.year, 1870)
              assert.equal(res.body.pages, 256)
              done()
            })
      })()
    })

  }) //end describe(`GET '/book/:id'`)



  describe(`DELETE '/book/:id'`, ()=>{

    it(`should send 404 'Not Found' error when trying to delete unexisting book`, done =>{
      chai.request(server)
          .delete('/book/12345')
          .end((err,res)=>{
            assert.equal(res.status,404)
            assert.hasAllKeys(res.body, ['status','errorMessage'])
            assert.equal(res.body.errorMessage, 'Error deleting book from collection')
            done()
          })
    })

    it(`should delete a book by given id`, done =>{
      //fill database with new book, then try removing it
      (async ()=>{
        const newBook = new Book({
          "title": "Around the Moon",
          "author": "Jules Verne",
          "year": 1870,
          "pages": 256
        })
        const {id:bookId} = await newBook.save()

        chai.request(server)
            .delete(`/book/${bookId}`)
            .send()
            .end((err,res)=>{
              assert.equal(res.status,200)
              assert.isObject(res.body)
              assert.hasAllKeys(res.body, ['message'])
              assert.equal(res.body.message, 'Book successfully removed')
              done()
            })
      })()
    })

  }) //end describe(`DELETE '/book/:id'`)



  describe(`PUT '/book/:id'`, ()=>{

    it(`should send 404 'Not Found' error when trying to update unexisting book`, done =>{
      chai.request(server)
          .put('/book/12345')
          .end((err,res)=>{
            assert.equal(res.status,404)
            assert.hasAllKeys(res.body, ['status','errorMessage'])
            assert.equal(res.body.errorMessage, 'Error updating book: does not exist')
            done()
          })
    })

    it(`should update a book by given id`, done =>{
      //fill database with new book, then try removing it
      (async ()=>{
        const newBook = new Book({
          "title": "Around the Moon",
          "author": "Jules Verne",
          "year": 1870,
          "pages": 256
        })
        const {id:bookId} = await newBook.save()

        chai.request(server)
            .put(`/book/${bookId}`)
            .send({
              author: 'Ernest Hemingway'
            })
            .end((err,res)=>{
              assert.equal(res.status,200)
              assert.isObject(res.body)
              assert.hasAllKeys(res.body, ['message', 'book'])
              assert.hasAllKeys(res.body.book, ['__v','_id','title','author','year','pages','createdAt'])
              assert.equal(res.body.book.title, 'Around the Moon')
              assert.equal(res.body.book.author, 'Ernest Hemingway')
              assert.equal(res.body.book.year, 1870)
              assert.equal(res.body.book.pages, 256)
              done()
            })
      })()
    })

  }) //end describe(`PUT '/book/:id'`)


}) //end describe('Books'
