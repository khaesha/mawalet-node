const User = require("../models/user.model");

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
      const error = new Error('Not authentication');
      error.statusCode = 401;
      throw error;
  }
  const token = authHeader.split(" ")[1];

  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }

      req.user = user;
      next();
    })
    .catch(err => {
      console.log('[authenticate][findByToken] err', err)
    });
};

module.exports = { authenticate };
