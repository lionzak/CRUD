const httpStatusText = require("../utils/http.status.text");
const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/async-wrapper");
const decode_JWT_token = require("../utils/decode_JWT_token");


const verifyToken = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!authHeader) {
    const err = appError.create("Token is required", 401, httpStatusText.FAIL);
    return next(err);
  }

  try {
    const decodedToken = decode_JWT_token(token);

    next();
  } catch (error) {
    const err = appError.create(error.message, 401, httpStatusText.ERROR);
    return next(err);
  }
});

module.exports = {
  verifyToken,
};
