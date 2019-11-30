const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Cannot contain the word 'password'");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age cannot be negative");
            }
        }
    }
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "thisismynewsecret");
    return token;
};
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({
        email
    });
    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Password or Email is incorrect");
    }
    return user;
};

userSchema.pre("save", async function(next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;