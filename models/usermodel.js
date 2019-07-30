var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({

    firstName:String,
    lastName:String,
    email:String,
    password:String

});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Userdata",UserSchema);