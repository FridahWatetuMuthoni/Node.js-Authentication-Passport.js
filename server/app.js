const express = require("express")
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const connectDB = require('./database/connect')
const userRouter = require('./routes/users')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const authenticateUser = require('./passport/passport')


//Database Connection
connectDB()

//middlewares
//express json middleware (because we will be sending json to the frontend)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//express-sessions for persistent login
//generate a secret : > require('crypto').randomBytes(64).toString('hex')
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized:false
}))
//custom middleware

//passport
authenticateUser(passport)

// init passport on every route call.
app.use(passport.initialize())

// allow passport to use "express-session".
app.use(passport.session())

//Routes
//home route also the success route
app.get('/', (req, res) => {
   res.json({user:req.user})
})
app.get('/failure', (req, res) => {
    res.send("Failure page")
})
app.get('/done', (req, res) => {
    res.send("logout successfull")
})

app.use('/api/users', userRouter)

//login route
app.post('/api/users/login',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/failure'
}))


//only listen to requests when the database is connected
mongoose.connection.once('open', () => {
    console.log('Connected to mongoDB')
    app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})
})
