import { Router } from "express"
const router = Router()

import * as controller from '../controllers/appControllers.js'
import Auth, { localVariables } from "../middleware/auth.js"
import { registerMail } from "../controllers/mail.js"


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


export default router