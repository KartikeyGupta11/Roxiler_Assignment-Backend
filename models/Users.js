import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 20,
        maxLength: 50
    },
    role:{
        type: String,
        enum:['SystemAdmin','NormalUser','StoreOwner'],
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        unique: true,
        validate:{
            validator: function(value) {
                return /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(value);
            },
            message: "Password must be 8-16 characters, include at least one uppercase letter and one special character."
        }
    },
    address:{
        type: String,
        required: true,
        maxLength: 400
    },
    timestamps:{
        type: Date,
        default: Date.now,
    }
});

export const User = mongoose.model("User", userSchema);