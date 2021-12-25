const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
//username ve password attribute'ları zaten passport
//tan geliyor, buraya eklemiyoruz.
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
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
        type:Boolean,
        default: false
    },
    appointments: [{
        type: Schema.Types.ObjectId,
        ref:'Appointment'
    }]
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Appointment.deleteMany({
            _id: {
                $in: doc.appointments
            }
        })
    }
})

module.exports = mongoose.model('User', UserSchema);