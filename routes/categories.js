const express = require('express');
const router = express.Router();

const Category = require('../modals/category');
const Book = require('../modals/book');
const authenticate=require('../middleware/auth');


//export PATH=$PATH:$HOME/Downloads/node-v10.15.2-linux-x64/bin




//router.get('/', authenticate, (req, res) => {
router.get('/', (req, res) => {
    Category.find({}, (err, categoriess) => {
        if (!err) res.send(categoriess);
        else{
            res.send("an error occured");
        }
    });
});

//router.get('/:id', authenticate, (req, res) => {

router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    console.log(id);
    Book.find({categoryId: id})
    .populate('categoryId')
    .populate('authorId')
    .exec(function (err, books) {
        if(!err) {
            console.log(books[0]);
            
            const allBooks = [];
            books.forEach(function (element) {
                const book = {
                   bookId: element._id,
                   authorId: element.authorId._id,
                  //  bookImg:element.image,
                    bookName: element.bookName,
                    authName: element.authorId.authorName.first + element.authorId.authorName.last,
                   categoryId: element.categoryId.categoryName
                }
            
                allBooks.push(book);
            })
            const obj = {
                catName : books[0].categoryId.categoryName,
                myBooks : allBooks
            }
            console.log(obj);
            res.send(obj);
        }
        else {
            if (!res.headersSent) {
                res.send(err);    
            }
            
        }
    }); 
});


router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    Book.deleteMany({catId: req.params.id}, (err) => {
        if(!err) {
            Category.deleteOne({_id: req.params.id}, (err) => {
                if(!err) res.send('Deleted');
                else res.send('unable to delete');
            })
        }
    })
})

module.exports = router;