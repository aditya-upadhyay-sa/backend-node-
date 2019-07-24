const express = require("express")
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
const passport = require('passport')
const Userdata = require('./models/usermodel')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')

const cors = require('cors')
app.use(bodyParser.json())
var loginsuccess = false;

mongoose.connect("mongodb://localhost/myproject");

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))

//passport Configuration
app.use(require("express-session")({
    secret: "Rusty is the best dog",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Userdata.authenticate()));
passport.serializeUser(Userdata.serializeUser());
passport.deserializeUser(Userdata.deserializeUser());

app.route('/api/getusers').get((req, res) => {




  
    Userdata.find({},function(err,data){

        if(err){
            console.log("error is there!")
        }else{
            
            res.send(data);
        }
    })


})

app.post('/api/addusers/', (req, res) => {



    var hash = bcrypt.hashSync(req.body.password);


    var newuser = new Userdata({ firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.email, password: hash });





    Userdata.findOne({ username: newuser.username }, function (err, data) {
        if (err) {
            console.log(err)
        }
        if (data) {

            res.json("User is already Registered!");



        } else {
            Userdata.create(newuser,
                function (err, usersdata) {
                    if (err) {
                        console.log("There is an error!");
                    }

                }
            )

        }


    })

    // res.send(req.body);
    // console.log("response")
    // res.send("inside node code")

})

app.post("/api/afterlogin/", (req, res) => {



    var email1 = req.body.email;
    var password1 = req.body.password;
    var value = false;



    Userdata.findOne({ username: email1 }).exec(function (err, data) {
        if (err) {
            console.log(err);
        } if (!data) {
            console.log("Sorry! email not found!")
        }
        else {
            // checking for password correction
            value = bcrypt.compareSync(password1, data.password);
            if (value) {

                console.log(value);
                console.log("Login Successfull!")
                res.json(data);
            } else {
                res.json("Sorry! password is wrong");
                console.log("Sorry! password is wrong")
            }




        }
    });
});









// function isLoggedin(req,res,next){

//     if(req.isAuthenticated()){
//         return next();
//     }
//     console.log("inside login function ")
// }

app.listen(8000, function () {

    console.log("server Started");
})