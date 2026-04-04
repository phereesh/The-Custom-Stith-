import { User } from "../models/User.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import { sendSMS } from "../utils/smppHelper.js";

const registerController = async (req, res) => {
    try {
        const { name, email, password, city, contact } = req.body;

        if (!name) {
            return res.json({ message: "Name is Required" })
        }

        if (!email) {
            return res.json({ message: "Email is Required" })
        }

        if (!password) {
            return res.json({ message: "Password is Required" })
        }

        if (!city) {
            return res.json({ message: "City is Required" })
        }

        if (!contact) {
            return res.json({ message: "Contact is Required" })
        }

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(200).json({
                message: "Already a registered user! please login",
                success: true
            });
        }

        // create a new user or register new user
        const hashedPassword = await hashPassword(password);

        const user = await new User({ name: name, email: email, city: city, contact: contact, password: hashedPassword }).save();
        res.status(200).json({
            success: true,
            message: "user registered successfully",
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "error in registration",
            error: error.message || error.toString()
        });
    }

}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "invalid email or password",
            });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "email is not registered",
            })
        }

        const matchPassword = await comparePassword(password, user.password);

        if (!matchPassword) {
            return res.status(200).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // token jwt for successfull login

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "Login successfully",
            user: {
                name: user.name,
                email: user.email,
                city: user.city,
                contact: user.contact,
                measurements: user.measurements || {},
                _id: user._id,
            },
            token,
        });

    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error in login",
            err
        })
    }

}

const forgotPasswordController = async (req, res) => {
    try {
        const { contact } = req.body;
        if (!contact) {
            return res.status(400).send({ message: "Phone number (contact) is required" });
        }
        // check
        const user = await User.findOne({ contact });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Phone number is not registered",
            });
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const resetUrl = `${process.env.CLIENT_URL}/reset_password/${token}`;
        const message = `Custom Stitch: Reset your password here - ${resetUrl} (Expires in 15m)`;

        try {
            await sendSMS({
                phone: user.contact,
                message,
            });
            res.status(200).send({
                success: true,
                message: `Reset link sent to your phone number ${user.contact} successfully`,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "SMS could not be sent via SMPP",
                error: error.message
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong during forgot password",
            error
        })
    }
}

const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).send({ message: "New Password is required" });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid Token or User not found",
            });
        }

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        await user.save();

        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong or token expired",
            error
        })
    }
}

const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, city, contact, measurements } = req.body;
        const user = await User.findById(req.user._id);

        // password check
        if (password && password.length < 6) {
            return res.json({ error: "Password is required and must be at least 6 characters long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                city: city || user.city,
                contact: contact || user.contact,
                measurements: measurements || user.measurements,
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                city: updatedUser.city,
                contact: updatedUser.contact,
                measurements: updatedUser.measurements,
                _id: updatedUser._id,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while updating profile",
            error,
        });
    }
};

export { registerController, loginController, forgotPasswordController, resetPasswordController, updateProfileController };

