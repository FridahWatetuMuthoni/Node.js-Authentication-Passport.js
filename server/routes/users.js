const { logoutController, registerController } = require('../controllers/usersControllers')
const express = require('express')
const router = express.Router()
const passport = require('passport')

router.route('/register')
.post(registerController)
/*
router.route('/login')
    .post(passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}))
*/

router.route("/logout")
    .post(logoutController)


module.exports=router


