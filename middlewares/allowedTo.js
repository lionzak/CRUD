const decode_JWT_token = require("../utils/decode_JWT_token");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/http.status.text");

module.exports = (...roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decodedToken = decode_JWT_token(token);
    if(!roles.includes(decodedToken.role)){
      const err = appError.create("Not authorized", 403, httpStatusText.FAIL);
      return next(err);

    }
    next();
  };
};
