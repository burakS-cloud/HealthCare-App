const Joi = require('joi');

module.exports.UserSchema = Joi.object({
    user: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        tc: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        address: Joi.string().required()
    }).required()
});

module.exports.doctorSchema = Joi.object({
    doctor: Joi.object({
        email: Joi.string().required(),
        tc: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        address: Joi.string().required(),
        doctorSection: Joi.string().required()
    }).required()
});

module.exports.secretarySchema = Joi.object({
    secretary: Joi.object({
        email: Joi.string().required(),
        tc: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        address: Joi.string().required()
    }).required()
});

module.exports.appointmentSchema = Joi.object({
    appointment: Joi.object({
        appointmentTime: Joi.string().required()
    }).required()
});

