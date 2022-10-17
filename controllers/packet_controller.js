// all of these are for protected routes

const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = {
    async getTagsAndDialectsInPacket(req, res) {
        // USE THIS FOR GETTING Dialects IN "more filters"
        // GET path: '/packets/:packetid/dialects'
        try {
            const userTagsAndDialects = await User.aggregate([
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
                    $project: { "packets.dialects": 1, "packets.tags": 1 },
                },
            ]);
            const tags = userTagsAndDialects[0].packets.tags;
            const dialects = userTagsAndDialects[0].packets.dialects;

            res.status(200).send({ tags: tags, dialects: dialects });
        } catch (error) {
            res.status(400).send(`Error fetching dialects in packet: ${error}`);
        }
    },
    async getDialectsInPacket(req, res) {
        // unused
        try {
            const userDialects = await User.aggregate([
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
                    $project: { "packets.dialects": 1 },
                },
            ]);
            const dialects = userDialects[0].packets.dialects;
            res.status(200).send(dialects);
        } catch (error) {
            res.status(400).send(`Error fetching dialects in packet: ${error}`);
        }
    },
    async getTagsInPacket(req, res) {
        // unused
        try {
            const userDialects = await User.aggregate([
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
                    $project: { "packets.tags": 1 },
                },
            ]);
            const tags = userDialects[0].packets.tags;
            res.status(200).send(tags);
        } catch (error) {
            res.status(400).send(`Error fetching tags in packet: ${error}`);
        }
    },
    async getCardsInPacket(req, res) {
        // GET path: '/packets/:packetid/cards?sort=date&posfilter=n;v;adj'
        // query params: sort, posfilter, nrfilter, tagsfilter, diafilter, memofilter, search, page
        const { sort = "date", posfilter, nrfilter, tagsfilter, diafilter, memofilter, search, page = 0 } = req.query;
        // page: every time we scroll to bottom of cards we send a new getCards request with the next page
        // the page number is taken and used like: aggregate(X).skip(page*20).limit(20)
        // this way we accumulate more and more cards in the Redux store
        // upon returning to Learning Box / re-doing search: clear Redux store's card list

        // Query Params Types:
        // search: String | null
        // posfilter: 'n;ij;adj;...' | null
        // nrfilter: 0 | 1 | null
        // tagsfilter: 'xxx;yyy;zzz' | null
        // diafilter: 'dd;ee;ff' | null
        // memofilter: '1;2;4' | null
        // page: 0 | 1 | 2 | ...
        // sort: 'term', '-term', 'date', '-date'

        const optionalSearchAndFilter = [
            { $match: search ? { $or: [{ term: { $regex: search, $options: "i" } }, { definition: { $regex: search, $options: "i" } }] } : {} },
            { $match: posfilter ? { pos: { $in: posfilter.split(";") } } : {} },
            { $match: !!parseInt(nrfilter) ? { needsRevision: true } : {} },
            { $match: tagsfilter ? { tags: { $in: tagsfilter.split(";") } } : {} },
            { $match: diafilter ? { dialect: { $in: diafilter.split(";") } } : {} },
            { $match: memofilter ? { memorization: { $in: memofilter.split(";").map((s) => parseInt(s) - 1) } } : {} },
        ];

        try {
            const cards = await User.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(req.userInfo._id) } }, // find user's packets by their _id
                { $unwind: "$packets" }, // allow for accessing the subfields in each packet object by breaking into separate objects, each with one packet
                { $match: { "packets._id": mongoose.Types.ObjectId(req.params.packetid) } }, // get only the packet we are interested in
                { $unwind: "$packets.cards" }, // allow for accessing subfields in each card - now every obj is { userId, packets: packetId, cards: CARD }
                { $replaceWith: "$packets.cards" }, // eliminate top-level fields and get only the packets.cards field so that we have { CARD }
                ...optionalSearchAndFilter,
                /* { $project: { term: 1, definition: 1, pos: 1, needsRevision: 1, date: 1 } },*/ // Commenting this out since I postulate that getting all fields isn't that heavy on the network
            ])
                .sort(sort)
                .skip(page * 30)
                .limit(30);
            res.status(200).send(cards);
        } catch (error) {
            res.status(400).send("Failed to get cards: ", error);
        }
    },
};
