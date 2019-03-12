//this is  created with nada ITI

const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    authorName: {
        first: String,
        last: String
      },
   // dateOfBirth: Date,
})
const authorModel = mongoose.model('authorModel', authorSchema);

module.exports = authorModel;
