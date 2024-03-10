const { body, validationResult } = require('express-validator');

module.exports = [
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