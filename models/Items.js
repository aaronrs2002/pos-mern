const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//create schema
const ItemSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  modifyOption: {
    type: Boolean,
    required: true
  },
  canModify: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Item = mongoose.model("item", ItemSchema);
