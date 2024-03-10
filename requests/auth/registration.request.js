const { body, validationResult } = require('express-validator');

module.exports = [
    body('firstName').isString().isLength({min: 3}).notEmpty(),
    body('lastName').isString().isLength({min: 3}).notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
];