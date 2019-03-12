mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/read',{
    useNewUrlParser:true,
    useCreateIndex:true
  },function (err, res) {
    if (err) {
    } else {
        console.log ('Succeeded connected to: data base');
    }
});