import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true,
    },
    suitDesign: {
        type: String,
        required: true,
    },
    lapelType: {
        type: String,
        required: true,
    },
    fabricType: {
        type: String,
        required: true,
    },
    measurements: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "In Progress", "Fitting", "Completed", "Cancelled"]
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
