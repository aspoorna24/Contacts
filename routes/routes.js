const express = require('express');
const router = express.Router();
const Info = require('../models/users');
const multer = require('multer');

//image upload
var storage = multer.diskStorage({
    destination:function(req,file,cb){
    cb(null, './uploads');
    },
    filename: function(req,file,cb){
       cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname); 
    }
})

var upload = multer({
    storage:storage,
}).single('image')

router.post('/add',upload,(req,res)=>{
   const user = new Info({
     name:req.body.name,
     email:req.body.email,
     phone:req.body.phone,
     image:req.file.filename
   });
   user.save().then(()=>{
    req.session.message ={
        type: 'success',
        message: 'user added succesfully!'
    };
    res.redirect('/');
}).catch((err)=>{
    res.json({message: err.message, type:'danger'});
});
})

router.get("/",(req,res)=>{
    Info.find()
    .then((users)=>{res.render('index',{title:'Home Page',users:users})})
    .catch((error)=>{console.log(error)})
});

router.get('/add',(req,res)=>{
    res.render('add_users',{title:"Add Users"});
});



module.exports = router;