const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

    /*appointmentOwner: {
        type:String,
        required:true
    },*/
    
    /*appointmentOwner: {
        type: Schema.Types.ObjectId,
        ref: 'currentUser'
    }*/

    appointmentDoctor: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Appointment", appointmentSchema);

