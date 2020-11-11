// !!!Controller
const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");

const userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });
};

const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

const readAll = (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        res.json(users);
    })
}

const update = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to perform this action"
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    );
};



// !!! ROUTE
const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../routes/auth");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

router.get("/users", requireSignin, isAuth, isAdmin, readAll);
router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);

router.param("userId", userById);

exports.userRoutes = router;
exports.userById = userById;
