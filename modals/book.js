//this is  created with nada ITI
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName:  {type:'string',required:true},
    authorId:  {type:mongoose.Schema.Types.ObjectId,ref:'author'},
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:'category'},
    totalRating:Number,
})

const bookModel = mongoose.model('book', bookSchema);