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
const LearningBoxController = require('../controllers/learningbox_controller');
const PacketController = require('../controllers/packet_controller');

module.exports = (app) => {
    app.get('/packets', authMiddleware, LearningBoxController.getPackets);
    app.post('/packets', authMiddleware, LearningBoxController.createPacket);
    
    app.get('/packets/:packetid/dialects', authMiddleware, PacketController.getDialectsInPacket);
    app.get('/packets/:packetid/tags', authMiddleware, PacketController.getTagsInPacket)
    app.get('/packets/:packetid/cards', authMiddleware, PacketController.getCardsInPacket);
    app.get('/packets/:packetid/langucard', authMiddleware, PacketController.getCardInfo);
    app.post('/packets/:packetid/langucard', authMiddleware, PacketController.addCard)
    app.put('/packets/:packetid/langucard', authMiddleware, PacketController.editCard);
    app.delete('/packets/:packetid/langucard', authMiddleware, PacketController.deleteCard);

    app.get('/logout', authMiddleware, UserController.logoutUser);
    app.post('/change-passowrd', authMiddleware, UserController.changePassword);
}