const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        default:"candidate"
    },

    phone:{
        type:String,
        default:""
    },

    bio:{
        type:String,
        default:""
    },

    skills:{
        type:[String],
        default:[]
    },

    education:{
        type:String,
        default:""
    },

    experience:{
        type:String,
        default:""
    },

    github:{
        type:String,
        default:""
    },

    linkedin:{
        type:String,
        default:""
    },

    profileImage:{
        type:String,
        default:""
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("User",userSchema);