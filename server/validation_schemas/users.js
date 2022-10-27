//user data validation: installation npm install @hapi/joi
const Joi = require("joi")

//Registration Validation
const registrationSchema = (data)=>{
    const schema   =Joi.object({
        username:Joi.string().min(6).max(255).trim(true).required(),
        email:Joi.string().email().min(6).required().trim(true),
        telephone:Joi.string().trim(true),
        password:Joi.string().min(6).required()
    }
    )
    return schema.validate(data)
}

//Login validation
const loginSchema = (data)=>{
    const schema   =Joi.object({
        username:Joi.string().min(6).max(255).trim(true).required(),
        password:Joi.string().min(6).required()
    }
    )
    return schema.validate(data)
}


module.exports={registrationSchema,loginSchema}
