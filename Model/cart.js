const mongoose = require("mongoose");

const SchemaVariable = mongoose.Schema;

const CartSchema = new SchemaVariable({
    productID:{
        type: String,
        required: true
    },

    quantity:{
        type: Number,
        required: true
    },

    userID:{
        type: String,
        required: true
    },

    cart:[{
        type:Object,
        required: true
    }]
})


module.exports = mongoose.model("Cart", CartSchema);