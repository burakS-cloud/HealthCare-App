const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Doctor = require('./doctor');

const appointmentSchema = new Schema({
    appointmentTime: {
        type:String,
        required:true
    },
    appointmentDate: {
        type:String,
        required:true
    },
    /*appointmentSection: {
        type: Schema.Types.ObjectId,
        ref:'Doctor'
        //doctorSection'a bakacak
    },*/
    appointmentSection: {
        type:String,
        required:true
    },

    /*appointmentOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },*/

    appointmentOwner: {
        type:String,
        required:true
    },
    
    /*appointmentOwner: {
        type: Schema.Types.ObjectId,
        ref: 'currentUser'
    }*/

    appointmentDoctor: {
        type: String,
        required: true
    },
    appointmentCondition: {
        type: Boolean,
        default: true
    }
});

/*appointmentSchema.post('findOneAndRemove', async function (appo,user,doc) {
    if (!appo.appointmentCondition) {
       const res = await Appointment.deleteOne({ _id: appo._id}, { _id : {$in: doc.patientAppointments}},  { _id : {$in: user.appointments}});
       console.log(res);
    }
})*/

module.exports = mongoose.model("Appointment", appointmentSchema);

