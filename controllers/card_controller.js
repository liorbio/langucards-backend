// all of these are for protected routes

const User = require('../models/User');

module.exports = {
    async addCard(req, res) {
        // get user credentials + packetId + cardInfo
        // save cardInfo under liorUser-->arabicPacket
    },
    async editCard(req, res) {

    },
    async deleteCard(req, res) {

    },
    async getCards(req, res) {
        // path: '/:packet-id/cards'
        // query params: sort, filter, search, page 
        const packetId = req.params["packet-id"];
        const { sort, filter, search, page } = req.query;
        // page: every time we scroll to bottom of cards we send a new getCards request with the next page
        // the page number is taken and used like: find(X).skip(page*20).limit(20)
        // this way we accumulate more and more cards in the Redux store
        // upon returning to Learning Box / re-doing search: clear Redux store's card list

        let cards;
        if (sort) {
            cards = await User.findById(req.userInfo._id).select({ packets: { $elemMatch: { _id: packetId } } }).select('cards');
        } else if (filter) {

        }
        // 🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠
        // --------------------------------------------------------------------
        // THINK HOW TO IMPLEMENT sort, filter, search, page QUERIES WITH MONGO
        // --------------------------------------------------------------------
        // 🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠🧠

        // return only: cardId, Term, Definition, POS, needsRevision (enough for LanguListItem)
    },
    async getCardInfo(req, res) {
        // path '/:packet-id/langucard' WITH QUERY PARAM cardId

        // return all card information fields
    }
};