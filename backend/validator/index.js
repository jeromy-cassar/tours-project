exports.userSignupValidator = (req, res, next) => {
    req.check("name", "Name is required").notEmpty();
    req.check("email", "invalid email form")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 32
        });
    req.check("email","at least 4 ~32").isLength({
        min: 4,
        max: 32
    }).withMessage("at least 4 ~32")
    req.check("email","invalid email form").matches(/.+\@.+\..+/).withMessage("unvalid email form")

    req.check("password", "Password is required").notEmpty();
    req.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

