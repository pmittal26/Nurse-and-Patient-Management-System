// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'RecordSchema'
const RecordSchema = new Schema({
    patientId: {
        type: String,
        required: true,
        trim: true
    },
    nurseId: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
        // default: Date.now
    },
    bodyTemperature: {
        type: Number,
        required: true,
        validate: [
            (bodyTemperature) => bodyTemperature && bodyTemperature > 0,
            "Body temperature should be greater than 0"
        ]
    },
    bloodPressure: {
        type: Number,

        required: true,
        validate: [
            (bloodPressure) => bloodPressure && bloodPressure > 0,
            "Blood pressure should be greater than 0"
        ]
    },
    heartRate: {
        type: Number,
        required: true,
        validate: [
            (heartRate) => heartRate && heartRate > 0,
            "Heart rate should be greater than 0"
        ]
    },
    respiratoryRate: {
        type: Number,           
        required: true,
        validate: [
            (respiratoryRate) => respiratoryRate && respiratoryRate > 0,
            "Respiratory rate should be greater than 0"
        ]
    },
});


// Create the 'Record' model out of the
// 'RecordSchema' to store the patients' vital signs
module.exports = mongoose.model('Record', RecordSchema);

