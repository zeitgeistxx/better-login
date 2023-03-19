import mongoose from "mongoose"
mongoose.set('strictQuery', true)

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedtopology: true
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch (err) {
        console.log(`Error: ${err.message}`)
        process.exit()
    }
}

export default connectDB