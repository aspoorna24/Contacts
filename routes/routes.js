const express = require('express');
const router = express.Router();
const Info = require('../models/users');
const multer = require('multer');
const fs = require('fs')
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

router.get('/edit/:id', (req,res)=>{
    let id = req.params.id;
    Info.findById(id)
    .then((user)=>{res.render('edit_user',{title:"Edit User", user:user})})
    .catch((err)=>{console.log(err)});
    
})

router.post('/update/:id', upload,(req,res)=>{
   let id = req.params.id;
   let new_image = '';

   if(req.file){
    new_image = req.file.filename;
    try{
        fs.unlinkSync('./uploads'+req.body.old_image);
    }
    catch (err){
        console.log(err)
    }
   }
   else{
    new_image = req.body.old_image;
   }

   Info.findByIdAndUpdate(id, {
    name:req.body.name,
    email : req.body.email,
    phone : req.body.phone,
    image : new_image
   })
   .then(()=>{
    req.session.message ={
        type: 'success',
        message: 'Use Updated succesfully!'
    };
    res.redirect('/');
   })
   .catch((err)=>{
    res.json({message: err.message, type:'danger'});
});
})

router.get('/delete/:id',(req,res)=>{
    Info.findByIdAndDelete(req.params.id)
    .then(()=>{
        req.session.message = {
            type: 'danger',
            message: 'User Deleted '
        };
        res.redirect('/');
    })
    .catch((err)=>{
        res.json({message: err.message, type:'danger'});
    });
})

module.exports = router;