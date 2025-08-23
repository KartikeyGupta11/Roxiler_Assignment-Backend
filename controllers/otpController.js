import transporter from '../config/mail.js';
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

const otpStore = {};

export const sendOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore[email] = { otp, expiresAt, verified: false };

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP for Password Reset",
      html: `<p>Hello,</p><p>Your OTP for resetting your password is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) {
    return res.status(404).json({ message: "OTP not found or expired" });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp.toString()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  otpStore[email].verified = true;

  res.status(200).json({ message: "OTP verified" });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const record = otpStore[email];

  if (!record || !record.verified) {
    return res.status(403).json({ message: "OTP not verified or expired" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    delete otpStore[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
