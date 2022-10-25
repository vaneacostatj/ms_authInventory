const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const user = require('../models/user')
const modelUser = user
//const {validationResult, check}= require('express-validator')

/*router.post('/', [
  check('name', 'Name is required').trim().not().isEmpty()
], auth,adminAuth,async(req, res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    console.log("paila");
    return res.status(400).json({
      errors: errors.array()
    })
  }

  const { name } = req.body
  try {
    
  } catch (error) {
    
  }
  res.send('ok')
}
)*/

router.post('/', auth, adminAuth, async(req, res)=>{
  try {
    //ver info de usuario por id 
    const user = await modelUser.findById(req.user.id).select('-password')
    res.json(user)
    //res.send('ok')
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
  }
})

module.exports = router