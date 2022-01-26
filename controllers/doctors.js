const Doctor = require('../models/doctor');
const User = require('../models/user');
const Appointment = require('../models/appointment');

module.exports.cancelledDoc = async (req, res) => {
    const { docid } = req.params;
    const doctor = await Doctor.findById(docid).populate('patientAppointments').populate('patients');
    res.render('appointments/cancelleddoc', { doctor });
    
}

module.exports.docindex = async (req, res) => {
    const { docid } = req.params;
    const doctor = await Doctor.findById(docid).populate('patientAppointments').populate('patients');
    res.render('appointments/docindex', { doctor });
    
}

module.exports.controlapp = async (req, res) => {
    const { docid } = req.params;
    const { userid } = req.params;
    const doctor = await Doctor.findById(docid).populate('patientAppointments').populate('patients');
    const user = await User.findById(userid).populate('appointments');
    res.render('appointments/controlapp', { doctor, user });
    
}

module.exports.changeAppCondDoc = async (req, res) => {
    const { appid } = req.params;
    const { docid } = req.params;
    const appo = await Appointment.findByIdAndUpdate({_id: appid}, { appointmentCondition : false});
    
    res.redirect(`/doctors/${docid}`);
}

module.exports.registerDoc = async (req, res, next) => {
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
}

module.exports.deleteAppo = async (req, res) => {
    const { docid } = req.params;
    const { appid } = req.params;
    const { userid } = req.params;

    await Doctor.findByIdAndUpdate(docid, {$pull: { patientAppointments: appid }});

    await User.findByIdAndUpdate(userid, {$pull: { appointments: appid }});

    const user = await User.findById(userid);

    if(user.appointments.length === 0){
        await Doctor.findByIdAndUpdate(docid, {$pull: { patients: userid }});
    }

    await Appointment.findByIdAndDelete(appid);

    res.redirect(`/doctors/${docid}/cancelled`);
    
}

module.exports.createControlAppPost = async (req, res) => {
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
                /*if(user.appointments.length === 0){
                    theDoctor.patients.push(user);
                }*/
                
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

