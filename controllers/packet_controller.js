// all of these are for protected routes

const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = {
    async getDialectsInPacket(req, res) {
        // USE THIS FOR GETTING Dialects IN "more filters"
        // GET path: '/packets/:packetid/dialects'
    },
    async getTagsInPacket(req, res) {
        // USE THIS FOR GETTING Tags IN "more filters"
        // GET path: '/packets/:packetid/tags'
    },
    async getCardsInPacket(req, res) {
        // GET path: '/packets/:packetid/cards?sort=date&posfilter=n;v;adj'
        // query params: sort, posfilter, nrfilter, tagsfilter, diafilter, memofilter, search, page
        const { sort = "date", posfilter, nrfilter, tagsfilter, diafilter, memofilter, search, page = 0 } = req.query;
        // page: every time we scroll to bottom of cards we send a new getCards request with the next page
        // the page number is taken and used like: aggregate(X).skip(page*20).limit(20)
        // this way we accumulate more and more cards in the Redux store
        // upon returning to Learning Box / re-doing search: clear Redux store's card list

        // Query Params Types [MUST-FIELDS marked with *]:
        // search: String | null
        // posfilter: 'n;ij;adj;...' | null
        // nrfilter: 0 | 1 | null
        // tagsfilter: 'xxx;yyy;zzz' | null
        // diafilter: 'dd;ee;ff' | null
        // memofilter: '1;2;5' | null
        // * page: 0 | 1 | 2 | ...
        // * sort: 'term', '-term', 'date', '-date'

        // 🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠
        // 🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠
        // 🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠
        // MAKE SURE REGEX SEARCH WORKS
        // 🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠
        // 🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠
        // 🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠
        const optionalSearchAndFilter = [
            { $match: search ? { $or: [{ term: { $regex: search, $options: "i" } }, { definition: { $regex: search, $options: "i" } }] } : {} },
            { $match: posfilter ? { pos: { $in: posfilter.split(";") } } : {} },
            { $match: nrfilter ? { needsRevision: !!nrfilter } : {} },
            { $match: tagsfilter ? { tags: { $in: tagsfilter.split(";") } } : {} },
            { $match: diafilter ? { dialect: { $in: diafilter.split(";") } } : {} },
            { $match: memofilter ? { memorization: { $in: memofilter.split(";").map((s) => parseInt(s)) } } : {} },
        ];

        try {
            const cards = await User.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(req.userInfo._id) } }, // find user's packets by their _id
                { $unwind: "$packets" }, // allow for accessing the subfields in each packet object by breaking into separate objects, each with one packet
                { $match: { "packets._id": mongoose.Types.ObjectId(req.params.packetid) } }, // get only the packet we are interested in
                { $unwind: "$packets.cards" }, // allow for accessing subfields in each card - now every obj is { userId, packets: packetId, cards: CARD }
                { $replaceWith: "$packets.cards" }, // eliminate top-level fields and get only the packets.cards field so that we have { CARD }
                ...optionalSearchAndFilter,
                { $project: { term: 1, definition: 1, pos: 1, needsRevision: 1 } },
            ])
                .sort(sort)
                .skip(page * 20)
                .limit(20);
            res.status(200).send(cards);
        } catch (error) {
            res.status(400).send("Failed to get cards: ", error);
        }
    },
};
