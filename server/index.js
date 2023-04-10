import express from "express"
import cors from 'cors'
import morgan from "morgan"
import dotenv from 'dotenv'
import connectDB from "./database/Connect.js"
import router from "./router/route.js"
import passport from "passport"
import session from "express-session"


const app = express()

dotenv.config()
app.use(express.json({ limit: '5mb' }))
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        methods: 'GET,POST,PUT,DELETE',
        credentials: true
    }
))
app.use(morgan('tiny'))
app.disable('x-powered-by')
app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))


app.use(passport.initialize())
app.use(passport.session())



app.use('/api', router)



const port = process.env.PORT || 5000
connectDB().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server port: ${port}`)
        })
    }
    catch (err) {
        console.log('Cannot connect to the server')
    }
}).catch((err) => {
    console.log('Invalid database connection')
})