const express = require('express')
const app = express()
const env = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')

env.config()

app.set('port', +process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

require('./routes/auth/auth.route')(app)

app.listen(app.get('port'), function () {
  console.log(`Example app listening on port ${app.get('port')}`);
});