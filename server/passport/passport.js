const local_strategy = require('passport-local').Strategy
const User = require('../models/Users')
const bcrypt = require('bcrypt')
//https://www.golinuxcloud.com/nodejs-passportjs-authenticate/

const passport_callback = async (username, password, done) => {
    try {
        const user = await User.findOne({ username })
        if (!user) return done(null, false, { message: "User does not exists" })
        //check the password
        const hashed_password = await bcrypt.hash(password,10)
        const valid = await bcrypt.compare(hashed_password, user.password)
        if (valid) { 
            return done(null,user)
        }
        else {
            return done(null,false)
        }
    }
    catch (err) {
        return done(err)
    }
}

const authenticateUser = (passport) => {
    passport.use(new local_strategy(customFields, passport_callback))
    
    passport.serializeUser((user, done) => {
        console.log(user)
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try { 
            const user = User.findById(id)
            return done(null,user)
        }
        catch (err) {
            return done(err)
        }
})
}


module.exports = authenticateUser



/*
The “done()” function is then used to pass the “{authenticated_user}” to the serializeUser() function.
WHAT DOES SERIALIZE USER MEAN?
1. "express-session" creates a "req.session" object, when it is invoked via app.use(session({..}))
2. "passport" then adds an additional object "req.session.passport" to this "req.session".
3. All the serializeUser() function does is,
receives the "authenticated user" object from the "Strategy" framework, and attach the authenticated user to "req.session.passport.user.{..}"
WHAT DOES DE SERIALIZE USER MEAN?
1. Passport JS conveniently populates the "userObj" value in the deserializeUser() with the object attached at the end of "req.session.passport.user.{..}"
2. When the done (null, user) function is called in the deserializeUser(), Passport JS takes this last object attached to "req.session.passport.user.{..}", and attaches it to "req.user" i.e "req.user.{..}"
In our case, since after calling the done() in "serializeUser" we had req.session.passport.user.{id: 123, name: "Kyle"}, 
calling the done() in the "deserializeUser" will take that last object that was attached to req.session.passport.user.{..} and attach to req.user.{..} 
i.e. req.user.{id: 123, name: "Kyle"}
3. So "req.user" will contain the authenticated user object for that session, and you can use it in any of the routes in the Node JS app. 
eg. 
app.get("/dashboard", (req, res) => {
res.render("dashboard.ejs", {name: req.user.name})
})
 */