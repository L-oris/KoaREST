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
      message: "New book successfully added",
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


//DELETE BOOK BY ID
module.exports.deleteBookById = async ctx => {
  try {

    const {id:bookId} = ctx.params
    const deletedBook = await Book.remove({_id: bookId})

    ctx.body = {
      message: "Book successfully removed",
    }

  } catch(err){throw `Error deleting book ${bookId} from collection`}
}



//UPDATE BOOK BY ID
module.exports.updateBookById = async ctx => {
  try {

    const {id:bookId} = ctx.params
    const searchedBook = await Book.findById(bookId)

    const updatedBook = await new Book(Object.assign(searchedBook,ctx.request.body)).save()

    ctx.body = {
      message: "Book successfully updated",
      book: updatedBook
    }

  } catch(err){throw `Error updating book ${bookId}`}
}
