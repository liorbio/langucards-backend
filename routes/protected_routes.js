const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access denied!");

    try {
        const userInfo = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.userInfo = userInfo;
        next();
    } catch (error) {
        res.status(400).send("Invalid token!");
    }
};

const UserController = require("../controllers/user_controller");
const LearningBoxController = require("../controllers/learningbox_controller");
const PacketController = require("../controllers/packet_controller");
const LanguCardController = require("../controllers/langucard_controller");

module.exports = (app) => {
    // put a req['auth-token'] for each endpoint here

    app.get("/packets", authMiddleware, LearningBoxController.getPackets);
    app.post("/packets", authMiddleware, LearningBoxController.createPacket); // req.body { language, writingDir }
    app.put("/packets/:packetid", authMiddleware, LearningBoxController.changePacketDetails); // req.body { language AND/OR writingDir }
    app.delete("/packets/:packetid", authMiddleware, LearningBoxController.deletePacket);

    app.get("/packets/:packetid/dialects", authMiddleware, PacketController.getDialectsInPacket);
    app.get("/packets/:packetid/tags", authMiddleware, PacketController.getTagsInPacket);
    app.get("/packets/:packetid/cards", authMiddleware, PacketController.getCardsInPacket); // SEE getCardsInPacket definition for more details. ?sort=date&posfilter=n;v;adj

    app.get("/packets/:packetid/:langucardid", authMiddleware, LanguCardController.getCardInfo);
    app.post("/packets/:packetid", authMiddleware, LanguCardController.addCard); // req.body { LanguCard }
    app.put("/packets/:packetid/:langucardid", authMiddleware, LanguCardController.editCard); // req.body { LanguCard }
    app.delete("/packets/:packetid/:langucardid", authMiddleware, LanguCardController.deleteCard);

    app.get("/logout", authMiddleware, UserController.logoutUser);
    app.post("/change-password", authMiddleware, UserController.changePassword);
};
