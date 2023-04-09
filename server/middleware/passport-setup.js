import dotenv from 'dotenv'
dotenv.config()

import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import passport from 'passport'
import User from '../models/User.js'


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
})


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/redirect'
        },
        async (accessToken, refreshToken, profile, done) => {
            const { sub, email, picture, given_name, family_name } = profile?._json

            try {
                const user = await User.findOne({ email })

                if (user) {
                    console.log('User already exists')
                    done(null, user)
                }
                else {
                    const newUser = await User.create({
                        email: email,
                        firstName: given_name,
                        lastName: family_name,
                        googleID: sub,
                        profile: picture
                    })
                    done(null, newUser)
                }
            } catch (err) {
                return console.error(err)
            }
        }
    )
)

export default passport