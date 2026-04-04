import Order from "../models/Order.js";

export const createOrderController = async (req, res) => {
    try {
        const { suitDesign, lapelType, fabricType, measurements } = req.body;
        
        if (!suitDesign || !lapelType || !fabricType || !measurements) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const newOrder = await new Order({
            user: req.user._id,
            suitDesign,
            lapelType,
            fabricType,
            measurements
        }).save();

        res.status(201).send({
            success: true,
            message: "Order placed successfully",
            newOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error creating order",
            error
        });
    }
};

export const getOrdersController = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: "-1" });
        res.status(200).send({
            success: true,
            message: "Orders fetched successfully",
            orders
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching orders",
            error
        });
    }
};
