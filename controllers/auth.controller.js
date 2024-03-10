const bcrypt = require('bcrypt')
const { User, Photos } = require('../models')
const sgMail = require('@sendgrid/mail')
const {v4: uuidv4} = require('uuid')
const {parseJwt} = require('../helpers')
const path = require('path');
const fs = require('fs')

exports.login = async (req, res) => {
  const {email, password} = req.body;

  try {

    const user = await User.findOne({ where: {email}});
    if (user) {
      if(user.status !== 'verified') {
        return res.status(400).send('Please Verify your account');
      }
      
      let loggedUser = await User.authenticate(email, password);
      return res.status(200).json(loggedUser);
    }
    

  } catch (err) {
      console.log(err)
      return res.status(400).send('Invalid Email or Password');
  }
}

exports.registration = async (req, res) => {
  const { firstName, lastName, email, password, } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } })

    if(existingUser) {
      return res.status(422).send('Email is already Registered')
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    const verificationToken = generateVerificationToken()

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      passwordHash: hashedPassword,
      role: 'user',
      status: 'registered',
      verificationToken: verificationToken
    });

    if(newUser) {

      sendEmail(newUser.email, verificationToken, 'Welcome On Board', newUser.id);

      return res.status(200).json('User Created SuccessFully');
    } else {
      throw new Error('Something went wrong')
    }
    
  } catch (err) {
      console.log(err)
      return res.status(400).send('Invalid Credentials');
  }
}

exports.me = async (req, res) => {
  const {email} = req.body

  if (!email) res.status(400).send('Something Went Wrong')

  const currentUser = await User.findOne({ where: {email: email}})
  const photo = await currentUser.getPhoto()
  
  return res.status(200).json({currentUser, photo})
}

exports.verifyEmail = async (req, res) => {
  const {id, verificationToken} = req.body;

  if(!id && !verificationToken) {
    return res.status(422).send('Invalid Credentials')
  }

  try{  
    const registeredUser = await User.findOne({where: {id, verificationToken}})
  
    if(registeredUser){
      registeredUser.verificationToken = null
      registeredUser.status = 'verified'
      await registeredUser.save()

      return res.status(200).send("Account Successfully verified")
    }else {
      throw new Error('cant veriy')
    }
  }catch (err) {
    console.log(err)
    return res.status(500).send('Something went wrong');
  }
}

exports.addPhoto = async (req, res) => {

  try {
    const userData = parseJwt(req.headers['authorization'])
    const uploadedFile = req.file; // Assuming the field name is 'photo'
    const uploadPath = path.join(__dirname, '..', 'images', uploadedFile.originalname);

    const newPhoto = await Photos.create({
      ownerId: userData.id,
      imagePath: uploadPath,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await fs.writeFile(uploadPath, uploadedFile.buffer, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
      }
    })

    return res.status(200).send(newPhoto)
  } catch (err) {
    console.log(err)
    return res.status(500).send('Something went wrong');
  }
}

function generateVerificationToken() {
  return uuidv4();
}

async function sendEmail (email, verificationCode, subject, id) {
  sgMail.setApiKey(process.env.SEND_GRID_KEY);
    const msg = {
      to: email,
      from: process.env.SEND_GRID_EMAIL,
      subject,
      text: `Your verificatoin code: ${verificationCode} and ID: ${id} `,
    };

    try {
      const [response] = await sgMail.send(msg);
      if (response.statusCode === 202) {
        console.log(`Email was sent to ${email}`);
        return true;
      } else {
        console.error(`Failed to send email to ${email}`);
        return false;
      }
    } catch (e) {
      console.error(`Error sending mail: ${e.message}`);
      return false;
    }
}