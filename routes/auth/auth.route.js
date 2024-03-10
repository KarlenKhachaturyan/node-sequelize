// Controllers
const Auth = require('../../controllers/auth.controller')

// Middlewares
const authorizedMiddleware = require('../../middleware/auth-middleware')
const upload = require('../../middleware/photo-upload.middleware.js');

// Request Validations
const loginRequest = require('../../requests/auth/login.request.js')
const registrationRequest = require('../../requests/auth/registration.request.js')
const verificationRequest = require('../../requests/auth/verification.request.js')
const meRequest = require('../../requests/auth/me.request.js')

module.exports = (app) => {
  app.post('/api/login', loginRequest, Auth.login)

  app.post('/api/registration', registrationRequest, Auth.registration)

  app.get('/api/me', meRequest, authorizedMiddleware, Auth.me)

  app.post('/api/email-verification', verificationRequest, Auth.verifyEmail)

  app.post('/api/add-photo', upload.single('photo'), authorizedMiddleware, Auth.addPhoto)
}
