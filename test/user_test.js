const chai = require("chai");
const { expect, assert } = chai;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("User actions", function () {
    const serverUrl = "http://localhost:5000";
    const fakeEmail = "b@b.b";
    const passwordA = "1a2A3!test";
    const passwordB = "987abc#z";
    let authToken = "";
    const fakePacketInfo = { language: "Arabic", writingDir: "rtl" };
    let packetId = "";
    const fakeCard = {
        term: "بيت",
        definition: "house",
        pos: "n",
        tags: ["places", "things"],
        needsRevision: false,
        dialect: "Palestinian",
        memorization: 4,
    };
    let languCardId = "";

    it("Registers a new user", function (done) {
        chai.request(serverUrl)
            .post("/register")
            .send({ email: fakeEmail, password: passwordA })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                return done();
            });
    });
    it("Logs user in", function (done) {
        chai.request(serverUrl)
            .post("/login")
            .send({ email: fakeEmail, password: passwordA })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                assert(!!res.body.authToken, "No authToken in response");
                authToken = res.body.authToken;
                return done();
            });
    });
    it("Changes user password", function (done) {
        chai.request(serverUrl)
            .post("/change-password")
            .send({ email: fakeEmail, password: passwordA, newPassword: passwordB })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                authToken = "";
                return done();
            });
    });
    it("Logs user back in with new password", function (done) {
        chai.request(serverUrl)
            .post("/login")
            .send({ email: fakeEmail, password: passwordB })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                assert(!!res.body.authToken, "No authToken in response");
                authToken = res.body.authToken;
                return done();
            });
    });

    it("Creates a new packet", function (done) {
        chai.request(serverUrl)
            .post("/packets")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("auth-token", authToken)
            .send(fakePacketInfo)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                return done();
            });
    });
    it("Gets packets", function (done) {
        chai.request(serverUrl)
            .get("/packets")
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.length.greaterThan(0);
                packetId = res.body[0]._id;
                return done();
            });
    });
    it("Adds a card to packet", function (done) {
        chai.request(serverUrl)
            .post(`/packets/${packetId}`)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("auth-token", authToken)
            .send(fakeCard)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                return done();
            });
    });
    it("Gets dialects in packet", function (done) {
        chai.request(serverUrl)
            .get(`/packets/${packetId}/dialects`)
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.length.greaterThan(0);
                return done();
            });
    });
    it("Gets tags in packet", function (done) {
        chai.request(serverUrl)
            .get(`/packets/${packetId}/tags`)
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.length.greaterThan(0);
                return done();
            });
    });
    it("Gets cards in packet", function (done) {
        chai.request(serverUrl)
            .get(`/packets/${packetId}/cards`)
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.length.greaterThan(0);
                languCardId = res.body[0]._id;
                return done();
            });
    });
    it("Gets specific card's info", function (done) {
        chai.request(serverUrl)
            .get(`/packets/${packetId}/${languCardId}`)
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                assert(!!res.body.term, "This LanguCard does not have a term");
                return done();
            });
    });
    it("Edits card", function (done) {
        fakeCard.term = "دار";
        chai.request(serverUrl)
            .put(`/packets/${packetId}/${languCardId}`)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("auth-token", authToken)
            .send(fakeCard)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                assert(res.body.term === "دار", "LanguCard's term did not get updated");
                return done();
            });
    });
    it("Deletes card", function (done) {
        chai.request(serverUrl)
            .delete(`/packets/${packetId}/${languCardId}`)
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                return done();
            });
    });
    it("Changes packet details", function (done) {
        chai.request(serverUrl)
            .put(`/packets/${packetId}`)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("auth-token", authToken)
            .send({ language: "Aramaic" })
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                return done();
            });
    });
    it("Deletes packet", function (done) {
        chai.request(serverUrl)
            .delete(`/packets/${packetId}`)
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                return done();
            });
    });

    it("Deletes mock user", function (done) {
        chai.request(serverUrl)
            .delete("/delete-user")
            .set("auth-token", authToken)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .send({ email: fakeEmail, password: passwordB })
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                authToken = "";
                return done();
            });
    });
});
