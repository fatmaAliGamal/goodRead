const mongoose = require('mongoose');
const validator=require('validator');
const jwt = require('jsonwebtoken');
const _lodash = require('lodash'); 
const bcrypt=require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fname: String,
  lname: String,
  email: {
    type:String,
    required:true,
    trim:true,
    minlength:1, 
    unique:true, 
    validate:{   
      validator:validator.isEmail,
      message:'{VALUE} is not a valid email'
    } 
      
  } ,
  password:{
    type:String,
    require:true,
    minlength:10
  },
  tokens:[{
    access:{type:String,required:true},
    token:{type:String,required:true}
  }],
  image:String,  
  isAdmin: 
  {type:Boolean,default:false}

}); 

userSchema.methods.toJSON=function(){
  const user = this;
  var userObject= user.toObject();

  return _lodash.pick(userObject,["_id","email","fname","image"]);
}


userSchema.methods.generateAuthToken = function () {
  const user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByEmail = function (email, password) {
  var User = this;
  
   return User.findOne({email}).then((user) => {
     if (!user) {
       return Promise.reject();
     }else{
     if(user.isAdmin===false){
     return new Promise((resolve, reject) => {
       bcrypt.compare(password.toString(), user.password, (err, res) => {
         if (res) {
           resolve(user);
         } else {
           reject();
         }
       });
     })}
   else{
     return Promise.reject();
    }
   };
   });
 };



userSchema.statics.findByAdmin = function (email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if (!user) {
      console.log(email);
      
      console.log("not");
      return Promise.reject();
    }else{
      console.log(user.isAdmin)
    if(user.isAdmin===true){
      console.log("true");
    return new Promise((resolve, reject) => {
      bcrypt.compare(password.toString(), user.password, (err, res) => {
        if (res) {
          resolve(user);
          console.log("true");
        } else {
          reject();
        }
      });
    })}
  else{
    return Promise.reject();
   }
  };
  });
};
userSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
      var password=user.password;
      bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
          user.password=hash;
          next();
        }); 
      });

    }else{
      next();
    }
});
const User = mongoose.model('User', userSchema);
 
module.exports = User;