const mongoose = require("mongoose");

const SchemaVariable = mongoose.Schema;

const ItemModel = new SchemaVariable({
  item_title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  item_price: {
    type: Number,
    required: true,
  },
  item_desc: {
    type: String,
    required: true,
  },
  item_img: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Item", ItemModel);
