const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Appointment  = require('./appointment');
const User = require('./user');
//username ve password attribute'ları zaten passport
//tan geliyor, buraya eklemiyoruz.
const doctorSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    tc: {
        type:String,
        required:true,
        unique:true
    },
    phoneNumber: {
        type:String,
        required:true,
        unique:true
    },
    address: {
        type:String,
        required:true,
        unique:true
    },
    isAuthorized: {
        type: Boolean,
        default: true
    },
    /*mySecretary: {
        type: Schema.Types.ObjectId,
        ref: 'Secretary'
    }*/
    mySecretary: {
        type:String,
        index:true,
        unique:true,
        sparse:true
    },
    doctorSection: {
        type:String,
        required:true
    },
    patientAppointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
        //Doctor -> User -> Appointment şeklinde iç içe populate gerekicek
    }],
    patients: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]


    // User'a refere edicek birsey ac, ref:User olsun.
});

doctorSchema.plugin(passportLocalMongoose);

/*doctorSchema.post('findOneAndRemove', async function (appo,user,doc) {
    if (!appo.appointmentCondition) {
        await Appointment.deleteOne({
            _id: {
                $in: doc.patientAppointments, user.appointments
            }
        })
    }
})*/

module.exports = mongoose.model('Doctor', doctorSchema);