/*var express = require('express');
var router = express.Router();

const adminModel = require('../modals/users')
const jwt = require('jsonwebtoken')
const auth=require('../middleware/auth')
var session;
/* GET home page. 
router.get('/login', function(req, res, next) {
  res.render('layouts/loginAdmin');
});

router.post('/login',auth, async(req,res)=>{
  try {
      const admin = await adminModel.findByCredentials(req.body.name,req.body.password)
      const token = await admin.generateAuthToken()
    res.status(201).send({user,token})
  } catch (error) {
      res.status(400).send()
  }
})
*/
const express = require('express');
const router = express.Router();
const lodashPick = require('lodash');
const Admin = require('../modals/users');
const categoryModel = require('../modals/category')
const authorModel = require('../modals/author')

const auth=require('../middleware/auth');
var path = require('path');

const multer = require("multer");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage }).single('file');
router.get('/', auth,(req, res) => {
  Category.find({}, (err, cats) => {
        if (!err) res.send(cats);
        else{
            res.send("an error occured");
        }
    });
});
router.get('/login', (req,res)=>{
    res.sendFile('adminLogin.html',{root: path.join(__dirname,'../public')})
})
router.get('/test',(req,res)=>{
  console.log("ddd")
  res.send("fatma")
})
router.post('/login',async (req, res) => {

    var body = lodashPick.pick(req.body,['email','password']);
    console.log(req.body.email);
    
  await  Admin.findByAdmin(body.email,body.password).then((user)=>{
        console.log("sucess");
        console.log(user);
    return user.generateAuthToken().then((token)=>{
        res.send(token);
    });
    }).catch((e)=>{
        res.send("error");
    });
});

/*
router.post('/createAdmin', function(req, res, next) {
  
  new Admin(req.body).save((err, docs) => {
    if (err) {
      res.send(`Error: ${err}`);
    } else {
      res.send(`saved: ${docs}`);
    }
  });
});

*/
router.get('/admBoard',auth, function(req, res) {
  Category.find({}, (err, docs) => {
    if (err) {
      res.send(`Error: ${err}`);
    } else {
      res.sendfile('CategoryAdmin.html',{root: path.join(__dirname,'../public')})
     // res.json({ 
      //  hamada : req.session.users.email
    //  });
    //  res.send()
    }
  });
});
router.get('/category',auth, (req, res) => {
try {
    Category.find({},(err,categs)=>{
      if (!err) {
       var catObj={id:'',nameLabel:''};
       var catArr=[];
       for (let index = 0; index < categs.length; index++) {
         catObj.id=categs[i]._id;
         catObj.nameLabel=categs[i].name;
         catArr.push(catObj)
       }
       res.send(catArr);
      } else {
        res.send("error happened")
      }
    })
   } catch (error) {
     res.send("error happened")
   }
  
  
});
//router.post('/category',auth,async(req,res)=>{
router.post('/category',async(req,res)=>{
  const categoryName = req.body.categoryName;
  const category = new categoryModel({
    categoryName:categoryName
  })
  try {
    await category.save();
    res.send('catgory was saved');
  } catch (error) {
    res.send("error happened")
  }
})
//by nada
router.post('/addAuthor',async (req, res) => {
  const author = new authorModel({
    authorName: {
        first: req.body.firstName,
        last: req.body.lastName
    },
   // dateOfBirth: req.body.dateOfBirth,
})
    try {
      await author.save();
      //  res.redirect('/admin/mainPage');
      res.send('author was saved');
    } catch (error) {
      res.send("error happened")
    }
})
/** */

module.exports = router;