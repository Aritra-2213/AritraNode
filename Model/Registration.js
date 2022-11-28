const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Registration = new Schema({
    reg_firstName:{
        type: String,
        required:true,
    },

    reg_lastName:{
        type:String,
        required:true,
    },

    reg_emailID:{
        type: String,
        required: true,
    },

    reg_password:{
        type: String,
        required:true,
    },

    reg_contact:{
       type:Number,
       required:true,
    },

    isVerified:{
       type:Boolean,
       default: false
    }
})


module.exports = mongoose.model("Reg",Registration);