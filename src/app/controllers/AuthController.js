const AdminUser = require('../models/AdminUser');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
require('dotenv/config');

module.exports = {
    async getHealth(req, res) {
        return res.status(200).send("Aplicação Teste está funcionando perfeitamente!")
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            let user = await AdminUser.findOne({ email }).select('+password').lean();
            if (user) {
                if (user.status === "active") {
                    const password_verify = await bcrypt.compare(password, user.password);
                    if (password_verify) {
                        let expiryDate = moment().add(8, 'hours');
                        let tokenObj = {
                            name: user.name,
                            email: user.email,
                            tokenExpiration: expiryDate,
                            role: user.role
                        };
                        const token = jwt.sign({ tokenObj }, process.env.NODEMON_API_KEY);
                        return res.json({ token });
                    }
                    return res.status(400).json({ error: "Senha inválida!" });
                }
                return res.status(400).json({ error: "Conta inativa!" });
            }
            return res.status(400).json({ error: "Usuário não encontrado!" });
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
}