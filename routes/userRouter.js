const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const User = require('../modals/users');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const authenticate = require('../middleware/auth');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage }).single('file');


router.get('/', (req, res) => {
    User.find({}, (err, books) => {
      if (!err) res.send(books);
      else{
          res.send("an error occured");
      }
  });
});


//Login
router.post('/login',async (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
   try {
    await  User.findByEmail(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
          res.send({ token: token, user: user });
          console.log(user);
        });
      }).catch((e) => {
        res.send(e);
      });
   } catch (error) {
    res.send(error);
   }

});

//signUP 
router.post('/create',async (req, res) => {
  console.log("creatte");
  console.log(res.file);
  try {
      await upload(req, res,async function (err) {
        /*   if (err instanceof multer.MulterError) {
             return res.status(500).json(err)
           } else if (err) {
             return res.status(500).json(err)
           }*/
           //    return res.status(200).send(req.file)
           console.log(req.file);
           var body = _.pick(req.body, ['fname', 'lname', 'email', 'password']);
           var user = new User(body);
         //  user.image = req.file.filename;
           // user.save().then(() => { 
           //   return user.generateAuthToken();
           // }).then((token) => {
           //   res.header('x-auth', token).send(user);
           // }).catch((e) => {
           //   res.status(400).send(e);
           // })
           try {
               await user.save()
               res.status(201).send(user)
           } catch (error) {
            res.status(500).send(error) 
           }
           
         })
  } catch (error) {
    res.send("an error occured");
  }



});
//logout
router.delete('/logout', authenticate,async (req, res) => {
    try {
        await req.user.removeToken(req.token)
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)  
    }
});

router.get('/me', authenticate,async (req, res) => {
  
  try {
    await res.send(req.user);
    res.status(201).send(user)
} catch (error) {
    res.status(400).send(error)  
}
});





module.exports = router;