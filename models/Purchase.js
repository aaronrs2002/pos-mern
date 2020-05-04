const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const extras = new Schema([
  {
    date: {
      type: String
    },

    category: {
      type: String
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: Number
    },
    quantity: {
      type: Number
    },
    modifyOption: {
      type: Boolean
    },
    canModify: {
      type: Boolean
    }
  }
]);

const removed = new Schema([
  {
    date: {
      type: String
    },

    category: {
      type: String
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: Number
    },
    quantity: {
      type: Number
    },
    modifyOption: {
      type: Boolean
    },
    canModify: {
      type: Boolean
    }
  }
]);

//purchase schema
const PurchaseSchema = new Schema([
  {
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    itemCost: {
      type: Number,
      required: true
    },
    extras: [extras],
    removed: [removed],
    details: {
      type: String,
      required: false
    },
    table: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: String,
      required: true
    }
  }
]);

module.exports = Purchase = mongoose.model("purchase", PurchaseSchema);
