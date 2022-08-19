const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access denied!');

    try {
        const userInfo = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.userInfo = userInfo;
        next();
    } catch (error) {
        res.status(400).send('Invalid token!');
    }
}

const UserController = require('../controllers/user_controller');
const PacketController = require('../controllers/packet_controller');
const CardController = require('../controllers/card_controller');

module.exports = (app) => {
    app.get('/packets', authMiddleware, PacketController.getPackets);
    app.post('/packets', authMiddleware, PacketController.createPacket);
    
    app.get('/:packet-id/cards', authMiddleware, CardController.getCards);
    app.get('/:packet-id/langucard', authMiddleware, CardController.getCardInfo);
    app.post('/:packet-id/langucard', authMiddleware, CardController.addCard)
    app.put('/:packet-id/langucard', authMiddleware, CardController.editCard);
    app.delete('/:packet-id/langucard', authMiddleware, CardController.deleteCard);

    app.get('/logout', authMiddleware, UserController.logoutUser);
    app.post('/change-passowrd', authMiddleware, UserController.changePassword);
}