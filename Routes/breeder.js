const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

//authentication
const isAuth = require('#Middleware/isAuth');

const fileCtrl = require('#Controller/Utils/file')
const homeCtrl = require('#Controller/breeder/home');

router.get('/breeder', isAuth, homeCtrl.getBreederHome);
router.post('/Utils/uploadFile', fileCtrl.uploadFile(['.png', '.jpg', '.pdf'], [{ name: 'testDoc', maxCount: 1 }], "testDoc"))
exports.router=router;