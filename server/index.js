import express from "express"
import cors from 'cors'
import morgan from "morgan"
import dotenv from 'dotenv'
import connectDB from "./database/Connect.js"
import router from "./router/route.js"

const app = express()

dotenv.config()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by')



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