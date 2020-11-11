const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const validator = require('validator');

// name, email, role, password
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            lowercase: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')
                }
            }
        },
        activated:{
            type:Boolean,
            default:true
        },
        hashed_password: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true,
            default: ""
        },
        salt: String,
        role: {
            type: Number,
            default: 0,
            max: 1
        },
    },
    { timestamps: true }
);

// virtual field
userSchema
    .virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function (plainText) {
        console.log("did it come?")
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema);
