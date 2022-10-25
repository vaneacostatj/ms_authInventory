const jwt = require('jsonwebtoken') //genera token

module.exports = function(req, res, next){
  //verificar el token del header
  const token = req.header('x-auth-token')

  //si no existe token
  if(!token){
    return res.status(401).json({
      msg: 'No token, auth denied'
    })
  } 

  //si existe token 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //establecer ID de usuario en req.user
    req.user = decoded.user
    next()
  } catch (error) {
    req.status(401).json({
      msg:'Token is not valid'
    })
  }
}