const chai = require("chai");
const { expect, assert } = chai;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

describe("User registration and login", function () {
    const fakeEmail = "b@b.b";
    const passwordA = "1a2A3!test";
    const passwordB = "987abc#z";
    let authToken = "";

    it("Registers a new user", function (done) {
        chai.request("http://localhost:5000")
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
        chai.request("http://localhost:5000")
            .post("/login")
            .send({ email: fakeEmail, password: passwordA })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.have.header("auth-token");
                authToken = res.header["auth-token"];
                return done();
            });
    });
    it("Changes user password", function (done) {
        chai.request("http://localhost:5000")
            .post("/change-password")
            .send({ email: fakeEmail, password: passwordA, newPassword: passwordB })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                assert(!res.header["auth-token"], "auth-token header still attached");
                authToken = "";
                return done();
            });
    });
    it("Logs user back in with new password", function (done) {
        chai.request("http://localhost:5000")
            .post("/login")
            .send({ email: fakeEmail, password: passwordB })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.have.header("auth-token");
                authToken = res.header["auth-token"];
                return done();
            });
    });

    it("Adds a new packet", function (done) {});
    it("Gets packets", function (done) {});
    it("Adds a card to packet", function (done) {});
    it("Gets dialects in packet", function (done) {});
    it("Gets tags in packet", function (done) {});
    it("Gets cards in packet", function (done) {});
    it("Gets specific card's info", function (done) {});
    it("Edits card", function (done) {});
    it("Deletes card", function (done) {});
    it("Changes packet details", function (done) {});
    it("Deletes packet", function (done) {});

    it("Logs user out", function (done) {
        chai.request("http://localhost:5000")
            .get("/logout")
            .set("auth-token", authToken)
            .end((error, res) => {
                expect(error).to.be.null;
                expect(res).to.have.status(200);
                assert(!res.header["auth-token"], "auth-token header still attached");
                authToken = "";
                return done();
            });
    });
});
