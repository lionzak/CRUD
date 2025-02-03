const jwt = require("jsonwebtoken");


module.exports = (token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decodedToken;
};