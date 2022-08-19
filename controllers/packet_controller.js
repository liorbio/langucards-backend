// all of these are for protected routes

const User = require('../models/User');
const { Packet } = require('../models/Packet');

module.exports = {
    async createPacket(req, res) {
        const newPacket = new Packet({
            language: req.body.language,
            cards: [],
            writingDir: req.body.writingDir
        }); 
        try {
            await User.findByIdAndUpdate(req.userInfo._id, { $push: { packets: newPacket }});
            res.status(200).send("New packet added successfully!");    
        } catch (error) {
            res.status(400).send("Packet addition failed: ", error);
        }
    },
    async getPackets(req, res) {
        try {
            const packets = await Unit.findById(req.userInfo._id).select('packets');
            res.status(200).send(packets);
        } catch (error) {
            res.status(400).send("Packets not found: ", error);
        }
    }
};