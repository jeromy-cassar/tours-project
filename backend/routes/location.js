// !!!controller
const { Location } = require("../models/location");
const Tour = require("../models/tour");
const { errorHandler } = require("../helpers/dbErrorHandler");

const locationById = (req, res, next, locationId) => {

    Location.findById(locationId)
        .exec((err, location) => {
            if (err || !location) {
                res.status(400).json({
                    error: "Location is not found or location id is wrong"
                });
            }
            req.location = location;
            next();
        });
    // try {
    //     Location.findById(locationId)
    //         .exec((err, location) => {
    //             req.location = location;
    //             next();
    //         });
    //     next();
    // } catch (err) {
    //     res.status(400).json({
    //         error: "Location is not found or location id is wrong"
    //     });
    // }
};

const getLocations = (req, res) => {
    // let order = req.query.order ? req.query.order : "asc";
    // let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    console.log("req.auth : ", req.auth)
    Location.find()
        .limit(limit)
        .sort("-created")
        .exec((err, locations) => {
            if (err) {
                return res.status(400).json({
                    error: "Locations not found"
                });
            }
            res.send(locations)
        })
};

const createLocation = (req, res) => {
    var fields = {}
    for (var key in req.body) {
        fields[key] = req.body[key]
    }
    console.log("req.body received in createLocation : ", fields)

    let location = new Location(fields);

    location.save((err, result) => {
        if (err) {
            console.log("err : ", err.message)

            return res.status(400).json({
                error: err.message
                // error: "All field is required"
            });
        }
        console.log("result : ", result)
        res.json(result);
    });
};

const copyLocation = async (req, res) => {

    var locationId = req.body.locationId
    console.log("locationId received in copyLocation : ", req.body)
    console.log("locationId received in copyLocation : ", locationId)

    location = await Location.findById(locationId).exec()
    console.log("what is location : ", location)

    var obj = {
        name: `${location.name} - copy`,
        city: location.city,
        country: location.country,
        description: location.description,
        x_axis: location.x_axis,
        y_axis: location.y_axis,
        area_code: location.area_code,
        min: location.min,
    }
    delete obj._id
    delete obj.createdAt
    delete obj.updatedAt
    delete obj.__V
    console.log("obj:", obj)
    var newLocation = new Location(obj)
    console.log("newLocation:", newLocation)

    newLocation.save((err, result) => {
        if (err) {
            console.log("err : ", err.message)

            return res.status(400).json({
                error: err.message
                // error: "All field is required"
            });
        }
        console.log("result : ", result)
        res.json(result);
    })
    // let location = new Location(fields);
    // location.name=`${location.name} - copy`

    // location.save((err, result) => {
    //     if (err) {
    //         console.log("err : ", err.message)

    //         return res.status(400).json({
    //             error: err.message
    //             // error: "All field is required"
    //         });
    //     }
    //     console.log("result : ", result)
    //     res.json(result);
    // });
}

const removeLocation = async (req, res) => {
    let location = req.location;
    await removeLocationFromTour(location._id)


    console.log("before removing")
    location.remove((err, deletedLocation) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Product deleted successfully"
        });
    });
};

const updateLocation = async (req, res) => {
    var location = req.location

    for (var key in req.body) {
        location[key] = req.body[key]
    }
    console.log("come here?")

    // WAY 1: way slower
    // await Tour.updateMany(
    //     { 'locations._id': req.location._id },
    //     { $set: { 'locations.$.name': location.name } },
    //     (err, result) => {
    //         if (err) {
    //             res.status(500)
    //                 .json({ error: 'Unable to update competitor.', });
    //         } else {

    //         }
    //     }
    // )

    await updateLocationFromTour(location)

    location.save((err, data) => {
        if (err) {
            res.status(404).send({ error: err })
        } else {
            res.send(data)
        }
    })
}

const updateLocationFromTour = async (newLocation) => {
    // WAY2 : way faster
    var tours = await Tour.find({ 'locations._id': newLocation._id });
    tours.map(async (t) => {
        min_duration = 0
        t.locations = t.locations.map((l) => {
            console.log(l._id, " ", newLocation._id)

            if (l === null) {

            } else if (JSON.stringify(l._id) === JSON.stringify(newLocation._id)) {
                console.log("ever come hre?")
                min_duration = min_duration + newLocation.min
                return newLocation
            } else {
                min_duration = min_duration + l.min
                return l
            }
        })
        t.min_duration = min_duration
        await t.save()
    })
}

const removeLocationFromTour = async (locationId) => {
    console.log("what is locationId received : ", locationId)
    var tours = await Tour.find({ 'locations._id': locationId });
    tours.map(async (t) => {
        t.locations.forEach((l, index) => {
            if (l === null) {
            } else if (JSON.stringify(l._id) === JSON.stringify(locationId)) {
                t.locations.pop(index)
            }
        })
        await t.save()
    })
}

function isFloat(n) {
    n = Number(n)
    if (Number.isInteger(n)) return false

    console.log("n before parese:", n)
    parsedN = parseFloat(n)
    console.log("parsedN:", parsedN)
    console.log("parsedN===n : ", parsedN === n)
    if (parsedN !== n) return false
    return Number(n) === n && n % 1 !== 0;
}

const isInteger = (n) => {
    parsedN = parseInt(n)

    console.log("n and parsedN ", n, parsedN)
    console.log("parsedN % 1 === 0 ", parsedN % 1 === 0)
    if (parsedN != n) return false
    return parsedN % 1 === 0;
}

const formValidate = async (req, res, next) => {
    var fields = { name: req.body.name }
    var fieldRequired = ['name', 'city', 'country', 'description', 'x_axis', 'y_axis', 'area_code', 'min']

    for (var i = 0; i < fieldRequired.length; i++) {
        if (req.body[fieldRequired[i]] === undefined || req.body[fieldRequired[i]] === "") return res.status(404).send({ error: `${fieldRequired[i]} is required` })

        if (fieldRequired[i] === "area_code" || fieldRequired[i] === 'min') {
            if (!isInteger(req.body[fieldRequired[i]])) return res.status(404).send({ error: `${fieldRequired[i]} is invalid form` })
        }

        if (fieldRequired[i] === 'x_axis' || fieldRequired[i] === 'y_axis') {
            if (!isFloat(req.body[fieldRequired[i]])) return res.status(404).send({ error: `${fieldRequired[i]} is invalid form` })
        }
    }

    var alreadyExist = await Location.find({ name: fields.name }).exec()
    if (alreadyExist.length > 0) {
        return res.status(404).send({ error: "Location name already exists" })
    }
    next()
}

const formValidateUpdate = async (req, res, next) => {
    console.log("l")
    var fields = { name: req.body.name }

    var fieldRequired = ['name', 'city', 'country', 'description', 'x_axis', 'y_axis', 'area_code', 'min']

    for (var i = 0; i < fieldRequired.length; i++) {
        if (req.body[fieldRequired[i]] === undefined || req.body[fieldRequired[i]] === "") return res.status(404).send({ error: `${fieldRequired[i]} is required` })

        if (fieldRequired[i] === "area_code" || fieldRequired[i] === 'min') {
            if (!isInteger(req.body[fieldRequired[i]])) return res.status(404).send({ error: `${fieldRequired[i]} is invalid form` })
        }

        if (fieldRequired[i] === 'x_axis' || fieldRequired[i] === 'y_axis') {
            if (!isFloat(req.body[fieldRequired[i]])) return res.status(404).send({ error: `${fieldRequired[i]} is invalid form` })
        }
    }

    var alreadyExist = await Location.find({ name: fields.name }).exec()



    if (alreadyExist.length > 0) {
        console.log(alreadyExist[0]._id !== req.body._id)
        console.log(" ", alreadyExist[0]._id, " ", req.body._id)

        if (JSON.stringify(alreadyExist[0]._id) !== JSON.stringify(req.body._id)) return res.status(404).send({ error: "Location name already exists" })
    }
    next()
}


// !!! router
const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../routes/auth");
const { userById } = require("../routes/user");


router.get("/locations", requireSignin, isAuth, getLocations);
router.post("/location/create", requireSignin, isAuth, isAdmin, formValidate, createLocation);
router.post("/location/copy", requireSignin, isAuth, isAdmin, copyLocation);
router.put("/location/update/:locationId", requireSignin, isAuth, isAdmin, formValidateUpdate, updateLocation);
router.delete("/location/remove/:locationId", requireSignin, isAuth, isAdmin, removeLocation);

router.param("userId", userById);
router.param("locationId", locationById);
exports.locationRoutes = router;
