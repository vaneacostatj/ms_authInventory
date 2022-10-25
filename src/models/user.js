'use strict'
const { Schema, model } = require('mongoose');

const collectionName = "user"

const userSchema = Schema({
  _id : String,
  name : {type: String, required: true},
  email : {type: String, required: true, unique: true },
  password : {type: String, required: true},
  avatar : String,
  role: {type: Number, default:0},
  history : {type: Array, default:[]},
  updatedAt: {type: Date, default: Date.now},
  createdAt: {type: Date, default: Date.now}, 
  isRemove: {type: Boolean, default: false}, 
}, {
  strict: false,
  versionKey: false,
  collection: collectionName,
  _id: false
})


module.exports = model(collectionName, userSchema); 