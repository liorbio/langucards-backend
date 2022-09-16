const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { packetSchema } = require("./Packet");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 6,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    dateJoined: {
        type: Date,
        default: Date.now,
    },
    loggedIn: {
        type: Boolean,
        default: false,
    },
    packets: [packetSchema],
    seenTutorial: Boolean,
});

module.exports = mongoose.model("User", userSchema);
