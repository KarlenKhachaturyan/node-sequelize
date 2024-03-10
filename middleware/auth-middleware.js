const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            if(!jwt.verify(token, process.env.TOKEN_SECRET)) {
                res.status(422).send('request unauthorized');
            } else {
              next()
            }
        }
    } else {
      res.status(401).send('Unauthorized action')
    }
}