const express = require('express')
const app = express()
const config = require('./config');
const {connectDB} = require('./dataBase')
const cors = require('cors')
const api = require('./routes/routes')
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(api);



const start = (config,(err,res) => {
  if(err){
    return err
  }
  
  app.listen(config.port, ()=> {
    connectDB()
    console.log(`server on port ${config.port}`) 
  })
})

start()