import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 60
    },
    role: {
        type: String,
        enum: ['SystemAdmin', 'NormalUser', 'StoreOwner'],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // email must be unique
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password: {
        type: String,
        // validate: {
        //     validator: function (value) {
        //         return /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(value);
        //     },
        //     message: "Password must be 8-16 characters, include at least one uppercase letter and one special character."
        // }
    },
    contactNumber: {
        type: String,
        match: [/^\d{10}$/, "Contact number must be 10 digits long"]
    },
    address: {
        type: String,
        required: true,
        maxLength: 400
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// export const User = mongoose.model("User", userSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);

