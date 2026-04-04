import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    contact: {
        type: String,
        required: true
    },

    role: {
        type: Number,
        default: 0
    },
    measurements: {
        type: Object,
        default: {}
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export { User };

