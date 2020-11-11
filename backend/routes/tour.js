// !!!controller
const Tour = require("../models/tour");
const { Location } = require("../models/location");
const { errorHandler } = require("../helpers/dbErrorHandler");

console.log("whatis Tour: ", Tour)
const tourById = (req, res, next, tourId) => {

    Tour.findById(tourId)
        .exec((err, tour) => {
            if (err || !tour) {
                return res.status(400).json({
                    error: "Tour is not found or tour id is wrong"
                });
            }
            req.tour = tour;
            next();
        });
};

const getTours = (req, res) => {
    // let order = req.query.order ? req.query.order : "asc";
    // let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Tour.find()
        .limit(limit)
        .sort("-created")
        .exec((err, tours) => {
            if (err) {
                return res.status(400).json({
                    error: "Tours not found"
                });
            }
            res.send(tours)
        })
};

const getTour = (req, res) => {
    res.send(req.tour)
};

const create = async (req, res) => {
    var fields = {}
    for (var key in req.body) {
        fields[key] = req.body[key]
    }
    console.log("req.body received in create tour : ", fields)

    let tour = new Tour(fields);
    tour.save((err, result) => {
        if (err) {
            console.log("err : ", err)

            return res.status(400).json({
                error: err
            });
        }
        console.log("result : ", result)
        res.json(result);
    });
};

const remove = (req, res) => {
    let tour = req.tour;
    tour.remove((err, deletedTour) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Tour deleted successfully"
        });
    });
};

const update = (req, res) => {
    var tour = req.tour
    for (var key in req.body) {
        tour[key] = req.body[key]
    }

    tour.save((err, data) => {
        if (err) {
            res.status(404).send({ error: err })
        } else {
            // console.log("data after saving : ", data)
            res.send(data)
        }
    })
}

// ADD LOCATION
const addLocation = async (req, res) => {
    var tour, location
    try {
        tour = await Tour.findById(req.body.tourId)
        location = await Location.findById(req.body.locationId)
    } catch (err) {
        return res.status(404).send({ error: "tours or location does not exist" })
    }

    var alreadyExist = false
    tour.locations.forEach((loc) => {
        if (JSON.stringify(loc._id) === JSON.stringify(location._id)) {
            alreadyExist = true
        }
    })

    if (alreadyExist) return res.status(404).send({ error: "location already exist" })
    tour.locations.push(location)

    tour.min_duration+=location.min

    tour.save((err, data) => {
        if (err) {
            return res.status(404).send({ error: err })
        } else {
            // console.log("data after saving : ", data)
            return res.send(data)
        }
    })



}

const removeLocation = async (req, res) => {
    var location = undefined
    var tour = undefined

    // await Tour.findById(req.body.tourId).exec(async (err, t) => {
    //     if (err || !t) {
    //         res.status(404).send({ error: "tour is not found" })
    //     }
    //     console.log("what is t : ", t)
    //     tour = t
    // })
    try {
        tour = await Tour.findById(req.body.tourId).exec()
    } catch (err) {
        res.status(404).send({ error: "tour is not found" })
    }

    // await Location.findById(req.body.locationId).exec((err, loc) => {
    //     if (err || !loc) {
    //         res.status(404).send({ error: "location is not found" })
    //     }
    //     location = loc
    // })
    console.log("what is tour before: ", tour)

    tour.locations.map((t, index) => {
        if (!t) {

        } else if (JSON.stringify(t._id) === JSON.stringify(req.body.locationId)) {
            console.log("ever come here?")
            console.log("waht is index :", index)
            tour.locations.pop(index)
            tour.min_duration-=t.min
            console.log("tour.locations :", tour.locations)

        }
    })

    console.log("tour after :", tour)

    tour.save((err, data) => {
        if (err) {
            res.status(404).send({ error: err })
        } else {
            // console.log("data after saving : ", data)
            res.send(data)
        }
    })
}

const formValidate = async (req, res, next) => {
    console.log("what is req.body : ", req.body)
    var fields = { name: req.body.name, type:req.body.type }
    // find if there is dupliacate
    
    if (fields.name==="" || fields.type==="" || req.body.name===undefined || fields.type===undefined ){
        return res.status(404).send({ error: "Please fill the form" })
    }

    try {
        var alreadyExist = await Tour.find({ name: fields.name }).exec()
        if (alreadyExist.length > 0) {
            return res.status(404).send({ error: "Tour name already exists" })
        }
        next()
    } catch (err) {
        console.log("err : ", err)
        return res.status(404).send({ error: "Tour does not exist" })
    }
}


const formValidateUpdate = async (req, res, next) => {
    console.log("what is req.body : ", req.body)
    var fields = { name: req.body.name, type:req.body.type }
    // find if there is dupliacate
    
    if (fields.name==="" || fields.type==="" || req.body.name===undefined || fields.type===undefined ){
        return res.status(404).send({ error: "Please fill the form" })
    }

    try {
        var alreadyExist = await Tour.find({ name: fields.name }).exec()
        // if (alreadyExist.length > 0) {
        //     return res.status(404).send({ error: "Tour name already exists" })
            
            
        // }

        if (alreadyExist.length > 0) {
            console.log(alreadyExist[0]._id !== req.body._id)
            console.log(" ", alreadyExist[0]._id, " ", req.body._id)
    
            if (JSON.stringify(alreadyExist[0]._id) !== JSON.stringify(req.body._id)) return res.status(404).send({ error: "Tour name already exists" })
        }
        next()
    } catch (err) {
        console.log("err : ", err)
        return res.status(404).send({ error: "Tour does not exist" })
    }
}

// !!! router
const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../routes/auth");
const { userById } = require("../routes/user");


router.get("/tours", requireSignin, isAuth, getTours);
router.get("/tour/:tourId", requireSignin, isAuth, getTour);
router.post("/tour/create", requireSignin, isAuth, isAdmin, formValidate, create);
router.put("/tour/update/:tourId", requireSignin, isAuth, isAdmin, formValidateUpdate, update);
router.delete("/tour/remove/:tourId", requireSignin, isAuth, isAdmin, remove);

router.post("/tour/location/add", requireSignin, isAuth, isAdmin, addLocation);
router.delete("/tour/location/remove", requireSignin, isAuth, isAdmin, removeLocation);


router.param("userId", userById);
router.param("tourId", tourById);
exports.tourRoutes = router;
