const { connect } = require('mongoose');
const { db } = require ('./config')

const connectDB = ()=>{
  try {
    connect(db)
    console.log('conect db true');
  } catch (error) {
    return error
  }
};

module.exports = { connectDB }