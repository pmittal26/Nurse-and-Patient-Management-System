const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var PatientSchema = new Schema({
   userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    emegencyAlerts: [
        {
          situation: {
            type: String,
            required: "Situation/Description is required",
          },
          contactNumber: {
            type: String,
            required: "Contact number is required",
          },
          entryDate: {
            type: String,
          },
        },
      ],
});
module.exports = mongoose.model("Patient", PatientSchema);
