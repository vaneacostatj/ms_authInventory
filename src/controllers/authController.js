const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken') //genera token
const bcrypt = require('bcryptjs') // encrypta la contraseña
const { generateId} = require('@codecraftkit/utils')

//check validación 
const {validationResult, check}= require('express-validator')
const gravatar = require('gravatar')
const auth = require('../middleware/auth')
const user = require('../models/user')
const modelUser = user

//publicas 
router.post('/register',[
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characteres').isLength({
    min: 6
  })
  ], 
  async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){

      return res.status(400).json({
        errors: errors.array()
      })
    }

    const {name, email, password} = req.body

    try {

      //valida si existe el usuario
      let User = await modelUser.findOne({ email })

      if(User){
        return res.status(400).json({
          errors: [
            {
              msg: 'User already exists'
            }
          ]
        })
      }

      const avatar = gravatar.url(email, {
        s:'200',
        r:'pg',
        d:'mm'
      })

      User = new modelUser({
        _id:generateId(),
        name,
        email,
        avatar,
        password
      })
      
      //encryptar contraseña
      const salt = await bcrypt.genSalt(10) 
      User.password = await bcrypt.hash(password,salt)
      await User.save()
      //generar token 
      const payload = {
        User: {
          id: User._id
        }
      }

      jwt.sign(
        payload,
        process.env.JWT_SECRET, {
          expiresIn: 360000
        },
        (err, token)=>{
          if (err) throw err;
          res.json({token})
        }
      )
    } catch (error) {
      console.log(err.message);
      res.status(500).send('Server error')
    }
  }
)

router.post('/login', [
  //validador de contraseña
  check('email', 'please include a valid email').isEmail(),
  check('password', 'password is a required').exists()
],
async(req, res)=>{

  const errors = validationResult(req)
  if(!errors.isEmpty()){

    return res.status(400).json({
      errors: errors.array()
    })
  }

  const {email, password} = req.body;
  console.log(email, "cosa");
  try {
    //verificar usuario 
    let user = await modelUser.findOne({ email })

    if(!user){
      return res.status(400).json({
        errors: [{
          msg: 'Invalid credentials'
        }]
      })
    }

    //comparación de contraseñas
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return res.status(400).json({
        errors: [{
          msg: 'Invalid credentials'
        }]
      })
    }

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET, {
        expiresIn: 360000
      },(err, token) => {
        if (err) throw err 
        res.json({
          token
        })
      }
    )


  } catch (error) {
    console.log(err.message);
    res.status(500).send('Server error')
  } 
})

//privadas
router.get('/', auth, async(req, res)=>{
  try {
    //ver info de usuario por id 
    const user = await modelUser.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
})

module.exports = router