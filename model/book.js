const mongoose = require('mongoose'),
      Schema = mongoose.Schema


const BookSchema = new Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  year: {type: Number, required: true},
  pages: {type: Number, required: true, min: 1},
  createdAt: {type: Date, default: Date.now}
})


const BookModel = mongoose.model('Book',BookSchema)


module.exports = BookModel
