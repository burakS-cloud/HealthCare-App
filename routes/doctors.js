const express = require('express');
const router = express.Router({ mergeParams:true });
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const doctors = require('../controllers/doctors');


router.get('/registerDoc', (req, res) => {
    res.render('doctors/registerDoc');
})

router.post('/registerDoc', catchAsync(doctors.registerDoc));

router.get('/loginDoc', (req, res) => {
    res.render('doctors/loginDoc');
})

router.post('/loginDoc', passport.authenticate('doctor', { successRedirect:'/', failureFlash: true, failureRedirect: '/doctors/loginDoc' }), (req, res) => {
    req.flash('success', 'welcome back!');
    res.redirect('/');
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})

//This put route handles the cancelling of a specific appointment(modifying the appointmentCondition attribute and set it's value to
//false)

router.put('/:docid/:appid', isLoggedIn, catchAsync(doctors.changeAppCondDoc));

//This get route displays all the appointments that are created on the name of this doctor.

router.get('/:docid', isLoggedIn, catchAsync(doctors.docindex));

//This get route displays all the cancelled appointments that are created on the name of this doctor and
//that are cancelled either by a user(patient) or this doctor.
router.get('/:docid/cancelled', isLoggedIn, catchAsync(doctors.cancelledDoc));

//This get route is triggered when the doctor clicks on the "Create new Appointment" button of an appointment that has been created
//on his name. It navigates the doctor to a different page with an appointment creation form, doctor name and doctor section field
//already populated with the value of this specific doctor.

router.get('/:docid/:userid/controlapp', isLoggedIn, catchAsync(doctors.controlapp));

// This delete route handles the deletion logic of an appointment from the patient's appointments object array as well as doctor's
//mypatientAppointments object array and last but not least, Appointment model.

router.delete('/:docid/:appid/:userid', isLoggedIn, catchAsync(doctors.deleteAppo));

// This post route was designed by me to handle to logic of control appointment creation by the doctor on behalf of the specific user who created
//that appointment which the doctor has clicked on it's "Create new Appointment" button.

router.post('/:id', isLoggedIn, catchAsync(doctors.createControlAppPost));


module.exports = router;