import { Router } from "express"
const router = Router()
import jwt from "jsonwebtoken"

import * as controller from '../controllers/appControllers.js'
import Auth, { localVariables } from "../middleware/auth.js"
import { registerMail } from "../controllers/mail.js"
import passport from "../middleware/passport-setup.js"

router.route('/register').post(controller.register)
router.route('/login').post(controller.verifyUser, controller.login)
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end())
router.route('/registerMail').post(registerMail)


router.route('/user/:username').get(controller.getUser)
/* when user tries to reset password then redirect to generateOTP route and furthur */
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP)
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP)
router.route('/createresetsession').get(controller.createResetSession)

router.route('/updateuser').put(Auth, controller.updateUser)
router.route('/resetpassword').put(controller.verifyUser, controller.resetPassword)



router.route('/auth/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }))
router.route('/auth/google/redirect').get(passport.authenticate('google',
    {
        successRedirect: '/api/login/success',
        failureRedirect: '/api/login/failed'
    }
))
router.route('/login/success').get((req, res) => {
    if (req.user) {
        const token = jwt.sign(
            {
                userId: req.user?._id,
            },
            process.env.COOKIE_KEY,
            { expiresIn: '1d' }
        )
        res.cookie('session_cookie', token,
            {
                maxAge: 30 * 1000, // in ms
                // secure: true,
                httpOnly: true,
                // sameSite: 'lax'
            }
        )
        res.status(200).redirect(process.env.CLIENT_URL)
    }
    else {
        res.status(403).json({ error: true, msg: 'Not Authorized' })
    }
})
router.route('/login/failed').get((req, res) => {
    res.status(401).json({
        error: true,
        msg: 'Login Failed'
    })
})
router.route('/logout').get((req, res) => {
    req.logout(() => res.redirect(process.env.CLIENT_URL))
})



router.route('/setCookie').get((req, res) => {
    res.cookie('cookie', 'Hello I am Test Cookie', { httpOnly: true, secure: true })
    res.send('Cookie saved successfully')
})

router.route('/getCookie').get((req, res) => {
    res.send(req.cookies.cookie)
})

router.route('/deleteCookie').get((req, res) => {
    res.clearCookie('cookie')
    res.send('Cookie deleted')
})

export default router