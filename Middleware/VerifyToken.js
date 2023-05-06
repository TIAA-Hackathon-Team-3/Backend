const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {

    try {
        const token = req.headers['x-access-token'] || req.headers['authorization'];
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        const decoded = jwt.verify(token, config.JWT_SECRETKEY);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};

module.exports = verifyToken;