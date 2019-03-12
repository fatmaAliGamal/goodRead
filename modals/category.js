const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryName: {
    type:String,
    required:true,
    trim:true
  }

});

const categoryModel = mongoose.model('categoryModel', categorySchema);

module.exports = categoryModel;