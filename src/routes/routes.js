'use strict'
const express = require('express');
const api = express.Router();
//const multer  = require('multer')()


api.use('/api/user', require('../controllers/authController'))
api.use('/api/inventory', require('../controllers/InventoryController'))

module.exports = api 
