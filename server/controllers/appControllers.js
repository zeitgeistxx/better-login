import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'


/* middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method === 'GET' ? req.query : req.body

        let exist = await User.findOne({ username })
        if (!exist) return res.status(404).json({ error: "Can't find user" })

        next()
    }
    catch (error) {
        return res.status(404).json({ error: 'Authentication Error' })
    }
}



export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body

        const existUsername = new Promise((resolve, reject) => {
            User.findOne({ username })
                .then((err, user) => {
                    if (err) reject(new Error(err))
                    if (user) reject({ error: "Please use unique username" })

                    resolve()
                })
        })

        const existEmail = new Promise((resolve, reject) => {
            User.findOne({ email })
                .then((err, email) => {
                    if (err) reject(new Error(err))
                    if (email) reject({ error: "Please use unique Email" })

                    resolve()
                })
        })



        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then((hashedPassword) => {
                            const user = new User({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            })

                            user.save()
                                .then((result) => {
                                    res.status(201).json({ result, msg: "User Registered Successfully" })
                                })
                                .catch((error) => {
                                    res.status(500).json(error)
                                })

                        })
                        .catch((error) => {
                            return res.status(500).json({
                                error: "Enable to hashed password"
                            })
                        })
                }
            })
            .catch((error) => {
                return res.status(500).json(error)
            })
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

export async function login(req, res) {
    const { username, password } = req.body

    try {
        User.findOne({ username })
            .then((user) => {
                bcrypt.compare(password, user.password)
                    .then((passwordCheck) => {
                        if (!passwordCheck) return res.status(400).json({ error: 'Password not match' })

                        // create JWT token
                        const token = jwt.sign(
                            {
                                userId: user._id,
                                username: user.username
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        )

                        return res.status(200).json({
                            msg: 'Login Successful',
                            username: user.username,
                            token
                        })

                    })
                    .catch((error) => {
                        return res.status(400).json({ error: "Don't have password" })
                    })
            })
            .catch((error) => {
                return res.status(404).json({ error: 'User not found' })
            })
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

export async function getUser(req, res) {
    const { username } = req.params

    try {
        if (!username) return res.status(501).send({ error: 'Invalid Username' })

        User.findOne({ username })
            .then((user) => {
                if (!user) return res.status(501).json({ error: "Couldn't Find User" })

                const { password, ...info } = user._doc
                return res.status(201).json(info)
            })
            .catch((error) => {
                return res.status(500).json(error)
            })
    }
    catch (error) {
        return res.status(404).json({ error: "can't find user data" })
    }
}

export async function updateUser(req, res) {
    try {
        // const id = req.query.id
        const { userId } = req.user

        if (userId) {
            const body = req.body

            User.updateOne({ _id: userId }, body)
                .then((data) => {
                    return res.status(201).json({ msg: 'Record Updated' })
                })
                .catch((err) => {
                    throw err
                })
        }
        else {
            return res.status(401).json({ error: 'User not found' })
        }
    }
    catch (error) {
        res.status(401).json(error)
    }
}

export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6,
        {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        }
    )

    res.status(201).json({ code: req.app.locals.OTP })
}

export async function verifyOTP(req, res) {
    const { code } = req.query
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null
        req.app.locals.resetSession = true

        return res.status(201).json({ msg: 'Verified Successfully' })
    }
    return res.status(400).json({ error: 'Invalid OTP' })
}


// successfully redirect user when OTP is valid
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).json({ flag: req.app.locals.resetSession })
    }
    return res.status(404).json({ error: 'Session Expired' })
}

export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) return res.status(404).json({ error: 'Session Expired' })

        const { username, password } = req.body

        try {
            User.findOne({ username })
                .then((user) => {
                    bcrypt.hash(password, 10)
                        .then((hashedPassword) => {
                            User.updateOne(
                                { username: user.username },
                                { password: hashedPassword }
                            )
                                .then((data) => {
                                    return res.status(201).json({ msg: 'Password Updated' })
                                })
                                .catch((err) => {
                                    throw err
                                })
                            req.app.locals.resetSession = false
                        })
                        .catch((err) => {
                            return res.status(500).json({ error: 'Enable to hashed password' })
                        })
                })
                .catch((err) => {
                    return res.status(404).json({ error: 'Username not found' })
                })
        }
        catch (error) {
            return res.status(500).json(error)
        }
    }
    catch (error) {
        return res.status(401).json(error)
    }
}