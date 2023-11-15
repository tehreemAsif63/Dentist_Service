const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dentist = require("./dentists.js");
const clinic = require("./clinics.js");
/**
 * time: The date and time of the registered slot
 * availability: The availability of the registered slot
 */
const slotSchema = new Schema({
    time: {
        type: Date,
        required: [true, "Date and time must be registered"]
    },
    availability: {
        type: Boolean,
        default: true
    },
    clinic: {
        type: Schema.Types.ObjectId,
        required: [true, "Clinic name must be registered"]
    },
    dentist: {
        type: Schema.Types.ObjectId,
        required: [true, "Clinic name must be registered"]
    }
});

module.exports = mongoose.model("Slots", slotSchema);