
const user = require('../models/user')
const modelUser = user 

module.exports = async function(req, res, next){
  try {
    const user = await modelUser.findOne({
      _id: req.user.id
    })

    if(user.role === 0){
      return res.status(403).json({
        error: 'Admin resources access denied'
      })
    }
    next()
  } catch (error) {
    console.log(err);
    res.status(500).send('Server error')
  }
}