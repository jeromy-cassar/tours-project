
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        city: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        country: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        area_code: {
            type: Number,
            trim: true,
            required: true
        },
        x_axis: {
            type: SchemaTypes.Double,
            trim: true,
            required: true
        },
        y_axis: {
            type: SchemaTypes.Double,
            trim: true,
            required: true
        },
        min: {
            type: Number,
            trim: true,
            required: true
        }
    },
    { timestamps: true }
);

module.exports.Location = mongoose.model("Location", locationSchema);
module.exports.locationSchema = locationSchema;