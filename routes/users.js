const express = require('express');
const router = express.Router({ mergeParams:true });
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(users.registerUser));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('user', { successRedirect: '/', failureFlash: true, failureRedirect: '/users/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    res.redirect('/');
})

//Create an appointment and save it to the user who created it.
router.post('/:id', isLoggedIn, catchAsync(users.createAppo));

// This post route is for the conditional rendering that i'm doing on home.ejs file's appointment form.
//If there is no user authenticated in the system, i can't send post request to '/:id', it returns
// Page Not Found error. So this route is sending post request to '/' instead, which is '/appointments'
//instead of the post route above, which sends request to '/appointments/:id'. This post route is actually
//not successfully sending a post request because i am using isLoggedIn middleware, and since there is
//no user authenticated in the system, this post request fails and it falls into that catch block to redirect me to login page

router.post('/', isLoggedIn, catchAsync(users.createFakeAppo));

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})

// Get all the appointments for a specific user.
router.get('/:id', isLoggedIn, catchAsync(users.userIndex));

// Change the appointment condition from true to false ( cancelling an appointment )
router.put('/:id/:appid', isLoggedIn, catchAsync(users.changeAppCondUsr));

//Show route for user to see his/her cancelled/past appointments
router.get('/:id/cancelledusr', isLoggedIn, catchAsync(users.cancelledUsr));


module.exports = router;