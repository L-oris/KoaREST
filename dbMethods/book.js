const mongoose = require('mongoose'),
      Book = require('../models/book')


//RETRIEVE ALL BOOKS
module.exports.getBooks = async ctx => {
  const books = await Book.find()
  ctx.body = books
}


//ADD A BOOK TO THE STORE
module.exports.addBook = async ctx => {
  const newBook = new Book(ctx.request.body)
  const savedBook = await newBook.save()

  ctx.body = {
    message: "Book successfully added!",
    book: savedBook
  }
}
