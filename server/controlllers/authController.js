import { User } from "../models/User.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

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
                role: user.role,
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
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }
        // check
        const user = await User.findOne({ email });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const resetUrl = `${process.env.CLIENT_URL}/reset_password/${token}`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #d4af37; padding: 20px; border-radius: 10px; background-color: #1a1a1a; color: #ffffff;">
                <h2 style="color: #d4af37; text-align: center;">Custom Stitch - Password Reset</h2>
                <p>Hello ${user.name},</p>
                <p>You requested to reset your password. Please click the button below to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #d4af37; color: #000000; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">Reset Password</a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #d4af37;">${resetUrl}</p>
                <p style="font-size: 0.8em; color: #888;">This link will expire in 15 minutes.</p>
                <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
                <p style="text-align: center; font-size: 0.9em;">Custom Stitch - Premium Tailoring</p>
            </div>
        `;

        try {
            console.log(`Attempting to send reset email to: ${user.email}`);
            
            if (process.env.SMTP_MAIL === "your_email@gmail.com" || process.env.SMTP_PASSWORD === "your_app_password") {
                console.error("CRITICAL ERROR: Email credentials are still placeholders in .env file!");
                return res.status(500).send({
                    success: false,
                    message: "Email service is not configured. Please check server .env file."
                });
            }

            await sendEmail({
                email: user.email,
                subject: "Password Reset Request - Custom Stitch",
                html: html,
                message: `Reset your password here: ${resetUrl}`, // Plain text fallback
            });
            res.status(200).send({
                success: true,
                message: `Reset link sent to your email ${user.email} successfully`,
            });
        } catch (error) {
            console.log("Email Error:", error);
            return res.status(500).send({
                success: false,
                message: "Email could not be sent",
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
                role: updatedUser.role,
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

