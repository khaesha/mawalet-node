const chai = require("chai");
const chaiHttp = require("chai-http");

const app = require("../index");
const {
  users,
  populateUsers,
  cashFlows,
  populateCashFlows
} = require("./seed/seed");

chai.use(chaiHttp);
chai.should();

beforeEach(populateUsers);
beforeEach(populateCashFlows);

describe("Cash Flow", function() {
  describe("GET /", function() {
    it("Should get all cash flow records", function(done) {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});
