import HomeVisit from "../models/HomeVisit.js";

export const createHomeVisitController = async (req, res) => {
    try {
        const {
            name,
            email,
            contact,
            address,
            city,
            preferredDate,
            preferredTime,
            notes,
            serviceType,
        } = req.body;

        if (!name || !email || !contact || !preferredDate || !preferredTime) {
            return res.status(400).send({
                success: false,
                message: "Basic details and preferred date/time are required",
            });
        }

        const newVisit = await new HomeVisit({
            user: req.user ? req.user._id : null,
            name,
            email,
            contact,
            address,
            city,
            preferredDate,
            preferredTime,
            serviceType: serviceType || "Home Concierge",
            notes: notes || "",
        }).save();

        res.status(201).send({
            success: true,
            message: "Home visit booked successfully",
            visit: newVisit,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error booking home visit",
            error,
        });
    }
};

export const getMyHomeVisitsController = async (req, res) => {
    try {
        const visits = await HomeVisit.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            visits,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching home visits",
            error,
        });
    }
};

export const getAllHomeVisitsController = async (req, res) => {
    try {
        const visits = await HomeVisit.find({})
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            visits,
        });
    } catch (error) {
        console.error("getAllHomeVisits error:", error);
        res.status(500).send({
            success: false,
            message: "Error fetching home visits",
            error: error.message || String(error),
        });
    }
};

export const updateHomeVisitStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const allowed = ["Pending", "Confirmed", "Completed", "Cancelled"];
        if (!allowed.includes(status)) {
            return res.status(400).send({
                success: false,
                message: "Invalid status",
            });
        }
        const visit = await HomeVisit.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).send({
            success: true,
            message: "Home visit updated",
            visit,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating home visit",
            error,
        });
    }
};
