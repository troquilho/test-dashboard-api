const jwt = require("jsonwebtoken");
const moment = require("moment");
require('dotenv/config');

const auth = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = (String(authorization).startsWith('Bearer ')) ? authorization.slice(7, authorization.length) : authorization;
    if (token) {
        jwt.verify(token, process.env.NODEMON_API_KEY, (err, decoded) => {
            if (err) return res.status(401).json({ error: err.name });
            if(moment() > moment(decoded.tokenObj.tokenExpiration)) return res.status(401).json({ error: "Não autorizado. Token expirado." });
            req.decoded = decoded.tokenObj;
            return next();
        });
    } else {
        return res.status(401).json({ error: "Não autorizado." });
    }
};

const authAdmin = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = (String(authorization).startsWith('Bearer ')) ? authorization.slice(7, authorization.length) : authorization;
    if (token) {
        jwt.verify(token, process.env.NODEMON_API_KEY, (err, decoded) => {
            if (err) return res.status(401).json({ error: err.name });
            if(moment() > moment(decoded.tokenObj.tokenExpiration)) return res.status(401).json({ error: "Não autorizado. Token expirado." });
            if(decoded.tokenObj.role !== 'admin') return res.status(401).json({ error: "Não autorizado. Rota não compatível com nível de acesso." });
            req.decoded = decoded.tokenObj;
            return next();
        });
    } else {
        return res.status(401).json({ error: "Não autorizado." });
    }
};

module.exports = {
    auth: auth,
    authAdmin: authAdmin
};