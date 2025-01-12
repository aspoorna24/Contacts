require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");

const app = express();
const PORT = process.env.PORT ||8000

mongoose.connect(process.env.DB_URL)
const db = mongoose.connection;
db.on('error', (err)=>console.log(err));
db.once('open',()=>console.log("connection established to database!"))

//middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use(session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false
}))

app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('uploads'))
app.set("view engine","ejs");

app.use("", require("./routes/routes"))

app.listen(PORT, ()=>{
    console.log(`App is listening to ${PORT}`);
})