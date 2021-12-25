const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Doctor = require('../models/doctor');

router.get('/registerDoc', (req, res) => {
    res.render('doctors/registerDoc');
})

router.post('/registerDoc', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password, tc, phoneNumber, address, mySecretary, doctorSection } = req.body;
        const doctor = new Doctor({ email, username, tc, phoneNumber, address, mySecretary, doctorSection});
        const registeredDoctor = await Doctor.register(doctor, password);
        console.log(registeredDoctor);
        req.login(registeredDoctor, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to HealthCare Doc!');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/registerDoc');
    }
}));

router.get('/loginDoc', (req, res) => {
    res.render('doctors/loginDoc');
})

router.post('/loginDoc', passport.authenticate('doctor', { successRedirect:'/', failureFlash: true, failureRedirect: '/loginDoc' }), (req, res) => {
    req.flash('success', 'welcome back!');
    //const redirectUrl = req.session.returnTo || '/';
    //delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})

module.exports = router;