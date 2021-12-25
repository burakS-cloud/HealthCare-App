const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
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
    }]
});

doctorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Doctor', doctorSchema);