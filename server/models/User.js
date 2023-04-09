import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: [true, 'Please provide unique username'],
        unique: [true, 'Username exists']
    },
    password: {
        type: String,
        // required: [true, 'Please provide a password'],
        unique: false
    },
    email: {
        type: String,
        required: [true, 'Please provide a unique email'],
        unique: true
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: Number },
    address: { type: String },
    profile: { type: String },
    googleID: { type: String }
},
    { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
export default User