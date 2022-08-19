const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languCardSchema = new Schema({
    term: {
        type: String,
        required: true
    },
    definition: {
        type: String,
        required: true
    },
    pos: String,
    exampleUsage: String,
    tags: [String],
    needsRevision: Boolean,
    dialect: String,
    memorization: Number
});

module.exports = {
    LanguCard: mongoose.model('LanguCard', languCardSchema),
    languCardSchema: languCardSchema
};