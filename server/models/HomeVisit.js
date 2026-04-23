import mongoose from "mongoose";

const homeVisitSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "User",
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    preferredDate: {
        type: String,
        required: true,
    },
    preferredTime: {
        type: String,
        required: true,
    },
    serviceType: {
        type: String,
        default: "Home Concierge",
    },
    notes: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    },
}, { timestamps: true });

export default mongoose.model("HomeVisit", homeVisitSchema);
