const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { languCardSchema } = require('./LanguCard');

const packetSchema = new Schema({
    language: {
        type: String,
        required: true
    },
    writingDir: "ltr" | "rtl",
    dateCreated: {
        type: Date,
        default: Date.now
    },
    cards: [languCardSchema]
});

module.exports = {
    Packet: mongoose.model('Packet', packetSchema),
    packetSchema: packetSchema
};