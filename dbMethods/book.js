const mongoose = require('mongoose'),
      Book = require('../models/book')


//RETRIEVE ALL BOOKS
module.exports.getBooks = async ctx => {
  try {

    const books = await Book.find()
    ctx.body = books

  } catch(err){throw `Error getting books from collection`}
}


//ADD A BOOK TO THE STORE
module.exports.addBook = async ctx => {
  try {

    const newBook = new Book(ctx.request.body)
    const savedBook = await newBook.save()

    ctx.body = {
      message: "Book successfully added!",
      book: savedBook
    }

  } catch(err){throw `Error adding new book to collection`}
}


//GET BOOK BY ID
module.exports.getBookById = async ctx => {
  try {

    const {id:bookId} = ctx.params
    const searchedBook = await Book.findById(bookId)

    ctx.body = searchedBook

  } catch(err){throw `Error getting book ${bookId} from collection`}
}
