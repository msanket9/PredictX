const mongoose = require('mongoose');

var DosageBoxSchema = new mongoose.Schema({
    userId: String,
    meds: [Object]
})

const Dosage = mongoose.model("Dosage", DosageBoxSchema);

module.exports = Dosage;