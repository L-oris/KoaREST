const mongoose = require('mongoose'),
      Book = require('../models/book')


//RETRIEVE ALL BOOKS
module.exports.getBooks = async ctx => {
  try {

    const books = await Book.find()
    ctx.body = books

  } catch(err){
    throw new Error(`Error getting books list from collection`)
  }
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

  } catch(err){
    throw new Error(`Error adding new book to collection`)
  }
}


//GET BOOK BY ID
module.exports.getBookById = async ctx => {
  try {

    const {id:bookId} = ctx.params
    const searchedBook = await Book.findById(bookId)

    ctx.body = searchedBook

  } catch(err){
    const error = new Error(`Book not found`)
    error.status = 404
    throw error
  }
}


//DELETE BOOK BY ID
module.exports.deleteBookById = async ctx => {
  try {

    const {id:bookId} = ctx.params
    const deletedBook = await Book.remove({_id: bookId})

    ctx.body = {
      message: "Book successfully removed",
    }

  } catch(err){
    throw new Error(`Error deleting book from collection`)
  }
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

  } catch(err){
    throw new Error(`Error updating book`)
  }
}
