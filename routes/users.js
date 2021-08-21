const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');



//Controllers
const controller = require('../controllers/users');

router.route('/register')
    .get(controller.renderRegisterForm)
    .post(wrapAsync(controller.registerUser))


router.route('/login')
    .get(controller.renderLogin)
    .post(passport.authenticate('local', {
        failureFlash: true, 
        failureRedirect: '/login'}), 
        wrapAsync(controller.loginUser))

router.get('/logout', controller.logoutUser);

module.exports = router;