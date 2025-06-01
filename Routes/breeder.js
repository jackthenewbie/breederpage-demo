const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

//authentication
const isAuth = require('../Middlewear/isAuth');

const homeCtrl = require('../Controller/breeder/home');
router.get('/breeder', isAuth, homeCtrl.getBreederHome);

exports.router=router;