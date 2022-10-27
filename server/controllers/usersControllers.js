const User = require('../models/Users')
const { registrationSchema, loginSchema } = require("../validation_schemas/users")
const bcrypt = require('bcrypt')
const passport = require('passport')


const registerController = async (req, res) => {
    //Data validation
    console.log(req.body)
    const {error} = registrationSchema(req?.body)
    const error_message = error?.details[0].message
    if (error) return res.status(400).json({ "message": error_message })

    //getting the values from req.body
    const { username, email, telephone, password } = req.body

    //check for duplicate :Checking if the user is already registered
    const duplicate = await User.findOne({ username: username }).exec()
    if (duplicate) {
        return res.status(409).json({ "message": "User already exists please try another one" }) //conflict
    }
    else {
        try {
            //encrypt password
            const hashed_password = await bcrypt.hash(password, 10)
            //create new user
            const user = await User.create({ username, email, telephone, password:hashed_password } )
            res.status(201).json(user)
            res.redirect('/api/users/login')
        }
        catch (err) {
            res.status(400).json({ err: err })
            res.redirect('/api/users/register')
        }
    }

}



const loginController = (req, res) => {
    //Data validation
    const { error } = loginSchema(req.body)
    const error_message = error?.details[0].message
    if (error) return res.status(400).json({ "message": error_message })
    //use passport to authenticate
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect:'/api/users/login'
    })
    
} 

const logoutController = (req, res) => {
    res.send('Logout Controller')
}

module.exports = {loginController,logoutController,registerController}
