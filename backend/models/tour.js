
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
const {locationSchema, Location}= require("./location");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        type: {
            type: String,
            required: true,
            maxlength: 2000
        },
        min_duration: {
            type: Number,
            default: 0,
        },
        locations: [locationSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tour", tourSchema);
