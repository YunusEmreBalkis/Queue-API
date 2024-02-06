const Joi = require("joi")
module.exports = {
registerValidation: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
,
loginValidation: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
,
updatePassword:Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    newPassword: Joi.string().required(),
    oldPassword: Joi.string().required(),
})
}

