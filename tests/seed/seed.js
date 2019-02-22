const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const CashFlow = require("../../models/cash-flow.model");
const User = require("../../models/user.model");

const userOneId = mongoose.Types.ObjectId();
const userTwoId = mongoose.Types.ObjectId();
const users = [
  {
    _id: userOneId,
    name: "Monah",
    email: "monah@test.com",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: "auth" }, "abc123").toString()
      }
    ]
  },
  {
    _id: userTwoId,
    name: "Mandra",
    email: "mandra@test.com",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userTwoId, access: "auth" }, "abc123").toString()
      }
    ]
  }
];

const cashFlows = [
  {
    _id: mongoose.Types.ObjectId(),
    type: "in",
    category: "Lain - lain",
    amount: 1000,
    description: "Uang test pertama",
    user: userOneId
  },
  {
    _id: mongoose.Types.ObjectId(),
    type: "in",
    category: "Lain - lain",
    amount: 2000,
    description: "Uang test kedua",
    user: userOneId
  },
  {
    _id: mongoose.Types.ObjectId(),
    type: "out",
    category: "Lain - lain",
    amount: 500,
    description: "Uang test ketiga",
    user: userOneId
  }
];

const populateUsers = function(done) {
  User.remove({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
  // .catch(e => done(e));
};

const populateCashFlows = function(done) {
  CashFlow.remove({})
    .then(() => {
      return CashFlow.insertMany(cashFlows);
    })
    .then(() => done());
  // .then(e => done(e));
};

module.exports = { users, populateUsers, cashFlows, populateCashFlows };
