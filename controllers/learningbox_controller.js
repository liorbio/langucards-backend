// all of these are for protected routes

const mongoose = require("mongoose");
const User = require("../models/User");
const { Packet } = require("../models/Packet");

module.exports = {
    async createPacket(req, res) {
        if (!req.body.language | !req.body.writingDir) {
            return res.status(400).send("Failure adding packet: language or writing direction not specified");
        }
        const newPacket = new Packet({
            language: req.body.language,
            cards: [],
            writingDir: req.body.writingDir,
        });
        try {
            await User.findByIdAndUpdate(req.userInfo._id, { $push: { packets: newPacket } });
            res.status(200).send("New packet added successfully!");
        } catch (error) {
            res.status(400).send("Packet addition failed: ", error);
        }
    },
    async getPackets(req, res) {
        try {
            const userPackets = await User.findById(req.userInfo._id, { "packets.language": 1, "packets._id": 1 });

            const packetsArray = userPackets.packets;

            res.status(200).send(packetsArray);
        } catch (error) {
            res.status(400).send("Packets not found: ", error);
        }
    },
    async changePacketDetails(req, res) {
        try {
            if (req.body.language) {
                await User.findByIdAndUpdate(
                    req.userInfo._id,
                    {
                        $set: { "packets.$[p].language": req.body.language },
                    },
                    {
                        arrayFilters: [{ "p._id": { $eq: mongoose.Types.ObjectId(req.params.packetid) } }],
                    }
                );
            }
            if (req.body.writingDir) {
                await User.findByIdAndUpdate(
                    req.userInfo._id,
                    {
                        $set: { "packets.$[p].writingDir": req.body.writingDir },
                    },
                    {
                        arrayFilters: [{ "p._id": { $eq: mongoose.Types.ObjectId(req.params.packetid) } }],
                    }
                );
            }

            res.status(200).send("Packets details updated successfully!");
        } catch (error) {
            res.status(400).send(`Error updating packet details: ${error}`);
        }
    },
    async deletePacket(req, res) {
        try {
            await User.findByIdAndUpdate(req.userInfo._id, {
                $pull: { packets: { _id: mongoose.Types.ObjectId(req.params.packetid) } },
            });
            res.status(200).send("Packet deleted successfully!");
        } catch (error) {
            res.status(400).send(`Error deleting packet: ${error}`);
        }
    },
};
