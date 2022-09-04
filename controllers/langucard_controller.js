const mongoose = require("mongoose");
const { LanguCard } = require("../models/LanguCard");
const User = require("../models/User");

module.exports = {
    async addCard(req, res) {
        // POST path: 'packets/:packetid/langucard'
        // get user credentials + packetId + cardInfo
        // save cardInfo under liorUser-->arabicPacket
        const card = new LanguCard({
            term: req.body.term,
            definition: req.body.definition,
            pos: req.body.pos,
            example: req.body.example,
            tags: req.body.tags,
            needsRevision: req.body.needsRevision,
            dialect: req.body.dialect,
            related: req.body.related,
            memorization: req.body.memorization,
        });

        let dialectAndTagsAddition = {};
        if (req.body.dialect) {
            dialectAndTagsAddition["packets.$[p].dialects"] = req.body.dialect;
        }
        if (req.body.tags) {
            dialectAndTagsAddition["packets.$[p].tags"] = { $each: req.body.tags };
        }

        try {
            await User.findByIdAndUpdate(
                req.userInfo._id,
                {
                    $push: { "packets.$[p].cards": card },
                    $addToSet: dialectAndTagsAddition,
                },
                { arrayFilters: [{ "p._id": req.params.packetid }] }
            );
            res.status(200).send("Card added successfully!");
        } catch (error) {
            res.status(400).send("Card addition failure: ", error);
        }
    },
    async getCardInfo(req, res) {
        // path 'packets/:packetid/:langucardid' WITH QUERY PARAM card-id
        try {
            const userPacketCard = await User.aggregate([
                {
                    $match: { _id: mongoose.Types.ObjectId(req.userInfo._id) },
                },
                {
                    $unwind: "$packets",
                },
                {
                    $match: { "packets._id": mongoose.Types.ObjectId(req.params.packetid) },
                },
                {
                    $unwind: "$packets.cards",
                },
                {
                    $match: { "packets.cards._id": mongoose.Types.ObjectId(req.params.langucardid) },
                },
            ]);

            const card = userPacketCard[0].packets.cards;

            res.status(200).send(card);
        } catch (error) {
            res.status(400).send("Error getting card: ", error);
        }

        // return all card information fields
    },
    async editCard(req, res) {
        // PUT path: /packets/:packetid/:langucardid
        const card = new LanguCard({
            term: req.body.term,
            definition: req.body.definition,
            pos: req.body.pos,
            example: req.body.example,
            tags: req.body.tags,
            needsRevision: req.body.needsRevision,
            dialect: req.body.dialect,
            related: req.body.related,
            memorization: req.body.memorization,
        });

        let dialectAndTagsAddition = {};
        if (req.body.dialect) {
            dialectAndTagsAddition["packets.$[p].dialects"] = req.body.dialect;
        }
        if (req.body.tags) {
            dialectAndTagsAddition["packets.$[p].tags"] = { $each: req.body.tags };
        }

        try {
            await User.findByIdAndUpdate(
                req.userInfo._id,
                {
                    $set: { "packets.$[p].cards.$[c]": card },
                    $addToSet: dialectAndTagsAddition,
                },
                { arrayFilters: [{ "p._id": req.params.packetid }, { "c._id": req.params.langucardid }] }
            );
            res.status(200).send("Card edited successfully!");
        } catch (error) {
            res.status(400).send("Card edit failure: ", error);
        }
    },
    async deleteCard(req, res) {
        // DELETE path: /packets/:packetid/:langucardid
        try {
            await User.findByIdAndUpdate(
                req.userInfo._id,
                {
                    $pull: { "packets.$[p].cards": { _id: mongoose.Types.ObjectId(req.params.langucardid) } },
                },
                {
                    arrayFilters: [{ "p._id": req.params.packetid }],
                }
            );
            res.status(200).send("Card deleted successfully!");
        } catch (error) {
            res.status(400).send(`Error deleting card: ${error}`);
        }
    },
};
