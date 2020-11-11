//!!! controllers
const User = require("../models/user");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
// const { errorHandler } = require("../helpers/dbErrorHandler");
const { userSignupValidator } = require("../validator");
const { errorHandler } = require("../helpers/dbErrorHandler");


// const userById = (req, res, next, id) => {
//     User.findById(id).exec((err, user) => {
//         if (err || !user) {
//             return res.status(400).json({
//                 error: "User not found"
//             });
//         }
//         req.profile = user;
//         next();
//     });
// };

const signup = (req, res) => {

    if(req.body.role!=='1' && req.body.role!=='0'){
        return res.status(400).json({
            error: "Invalid value on role field: 1 is for admin, 0 is for assistant"
        });
    }

    const user = new User(req.body);
    user.activated = true;
    console.log("whati s body : ", req.body)



    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err.message
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
}

const signin = (req, res) => {
    const { password, email } = req.body

    User.findOne({ email }).exec((err, user) => {
        if (!user) {
            res.json({ error: "please check email and password" })
        }
        if (user) {
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: "Email and password dont match"
                });
            }
            if (user.activated === false) {
                return res.status(401).json({
                    error: "This account has been deactivated"
                });
            }

            // generate a signed token with user id and secret
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            // persist the token as 't' in cookie with expiry date
            res.cookie("t", token, { expire: 900000 + Date.now() });
            // return response with user and token to frontend client
            const { _id, name, email, role } = user;
            return res.json({ token, user: { _id, email, name, role } });
        }
    })
}

const signout = (req, res) => {
    // clear coockie
    res.clearCookie("t");
    res.json({ message: "Signout success" });
}

const deactivateUser = (req, res) => {
    var user = req.profile;
    user.activated = false;
    user.save(() => {
        return res.send({ message: "user is deactivated" })
    })
}

const reactivateUser = (req, res) => {
    var user = req.profile;
    user.activated = true;
    user.save(() => {
        return res.send({ message: "user is reactivated" })
    })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = async (req, res, next) => {
    // let isMatching = req.profile && req.auth && req.profile._id == req.auth._id;
    var user = await User.findById(req.auth._id)

    if (!user) {
        return res.status(403).json({
            error: "User not found or invalid JWT"
        });
    }

    if (!user.activated) {
        return res.status(403).json({
            error: "This account is disactivated"
        });
    }
    next();
};

exports.isAdmin = async (req, res, next) => {
    var user = await User.findById(req.auth._id)
    if (user.role === 0) {
        return res.status(403).json({
            error: "Admin resourse! Access denied"
        });
    }
    next();
};


//!!! routers
const express = require("express");
const router = express.Router();
const { userById } = require("./user");

router.param("userId", userById);
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/deactivate/:userId", this.requireSignin, this.isAuth, this.isAdmin, deactivateUser);
router.post("/reactivate/:userId", this.requireSignin, this.isAuth, this.isAdmin, reactivateUser);

exports.authRoutes = router;
