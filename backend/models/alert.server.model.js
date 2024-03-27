const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlertSchema = new mongoose.Schema({
  patient: {
    type: Schema.ObjectId,
    ref: "User",
  },
  situation: {
    type: String,
    required: "Situation/Description is required",
    trim: true,
  },
  contactNumber: {
    type: String,
    required: "Contact number is required",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  isAttended :{
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Alert", AlertSchema);