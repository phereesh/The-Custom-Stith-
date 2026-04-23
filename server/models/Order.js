import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true,
    },
    orderType: {
        type: String,
        default: "Full Suit",
        enum: ["Full Suit", "Jacket Only", "Pants Only", "Exclusive"],
    },
    suitDesign: {
        type: String,
        default: "N/A",
    },
    lapelType: {
        type: String,
        default: "N/A",
    },
    fabricType: {
        type: String,
        default: "N/A",
    },
    measurements: {
        type: Object,
        default: {},
    },
    isExclusive: {
        type: Boolean,
        default: false,
    },
    productId: {
        type: Number,
    },
    productTitle: {
        type: String,
    },
    productImage: {
        type: String,
    },
    productCategory: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0,
    },
    paymentMethod: {
        type: String,
        default: "N/A",
    },
    paymentStatus: {
        type: String,
        default: "N/A",
        enum: ["N/A", "Pending", "Completed", "Failed", "Refunded"],
    },
    refundedAt: {
        type: Date,
    },
    cancelReason: {
        type: String,
    },
    cancelledBy: {
        type: String,
        enum: ["User", "Admin"],
    },
    cancelledAt: {
        type: Date,
    },
    transactionUuid: {
        type: String,
    },
    transactionId: {
        type: String,
    },
    pidx: {
        type: String,
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "In Progress", "Fitting", "Completed", "Cancelled"]
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
