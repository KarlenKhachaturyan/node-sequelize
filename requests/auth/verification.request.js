const { body, validationResult } = require('express-validator');
const uuid =  require('uuid')

module.exports = [
  body('id').isString().notEmpty(),
  body('verificationToken').isString().notEmpty().isLength({min: 10}),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { verificationToken } = req.body
    console.log('---------------------')
    console.log(verificationToken)
    console.log('---------------------')
    if (!verificationToken || !uuid.validate(verificationToken)) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    next();
  }
];

