const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const languCardSchema = new Schema({
    term: {
        type: String,
        required: true,
    },
    definition: String,
    pos: String,
    example: String,
    tags: [String],
    needsRevision: Boolean,
    related: String,
    dialect: String,
    memorization: Number,
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = {
    LanguCard: mongoose.model("LanguCard", languCardSchema),
    languCardSchema: languCardSchema,
};
