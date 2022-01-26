const Doctor = require('../models/doctor');
const User = require('../models/user');
const Appointment = require('../models/appointment');

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password, tc, phoneNumber, address } = req.body;
        const user = new User({ name:username, email, username:email, tc, phoneNumber, address });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome HealthCare!');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.createAppo = async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        const { id } = req.params;
        const user = await User.findById(id);
        const { appointmentSection, appointmentDoctor, appointmentDate, appointmentTime } = req.body;
        
        const appointment = new Appointment({ appointmentSection, appointmentDoctor, appointmentDate, appointmentTime, appointmentOwner: user.name });
        
        for(let i = 0; i < doctors.length; i++) {
            if(doctors[i].username == appointmentDoctor){
                const theDoctor = await Doctor.findById(doctors[i]._id).populate('patientAppointments').populate('patients');  
                theDoctor.patientAppointments.push(appointment);
                theDoctor.patients.push(user);
                theDoctor.save();
                break;
            }
        }   
        user.appointments.push(appointment);
        await appointment.save();
        await user.save();
        req.flash('success', 'Created new appointment!');
        res.redirect(`/users/${id}`);
    }
    catch(e) {
        req.flash('error', e.message);
        res.redirect('/users/login');
    }
    
}

module.exports.createFakeAppo = async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        const { id } = req.params;
        const user = await User.findById(id);
        const { appointmentSection, appointmentDoctor, appointmentDate, appointmentTime } = req.body;
        const appointment = new Appointment({ appointmentSection, appointmentDoctor, appointmentDate, appointmentTime });
        //appointment.appointmentOwner = req.user._id;
        
        user.appointments.push(appointment);
        await appointment.save();
        await user.save();
        req.flash('success', 'Created new appointment!');
        //Redirecting to home page instead of 'my appointments' page for now.
        res.redirect(`/users/${id}`);
    }
    catch(e) {
        req.flash('error', e.message);
        res.redirect('/users/login');
    }
    
}

module.exports.userIndex = async (req, res) => {
    const user = await User.findById(req.params.id).populate('appointments');
    res.render('appointments/index', { user });
    
}

module.exports.changeAppCondUsr = async (req, res) => {
    const { appid } = req.params;
    const { id } = req.params;
    const appo = await Appointment.findByIdAndUpdate({_id: appid}, { appointmentCondition : false});
    console.log(appo);
    
    
    res.redirect(`/users/${id}`);
}

module.exports.cancelledUsr = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate('appointments');
    res.render('appointments/cancelleduser', { user });
    
}