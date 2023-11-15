const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Dentist = require("./dentists.js");

/**
 * clinicName: The name of the dental clinic
 * address: The location of the dental clinic
 * workingDentists: The dentists who are working in the clinic
 */
const clinicSchema = new Schema({
    clinicName: {
        type: String,
        required: [true, "Clinic name must be registered"]
    },
    address: {
        type: String,
        required: [true, "Address must be registered"],
        uniq:true
    },
    Dentist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Dentists",
        },
    ],
});

module.exports = mongoose.model("Clinics", clinicSchema);