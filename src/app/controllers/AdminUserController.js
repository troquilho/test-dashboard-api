const AdminUser = require('../models/AdminUser');
const bcrypt = require("bcryptjs");

module.exports = {
    async index(req, res) {
        try {
            const { paginate = false, limit = 20, page = 1, order = "desc", sortBy = "createdAt", name = '' } = req.query;
            let adminUser;
            if (paginate == "true") {
                adminUser = await AdminUser.paginate({ name: {$regex: name, $options: "i"} }, { page, limit: parseInt(limit), sort: { [sortBy]: order } });
            } else {
                adminUser = await AdminUser.find({ name: {$regex: name, $options: "i"} }).sort({ [sortBy]: order }).limit(parseInt(limit))
            }
            return res.json(adminUser);
        } catch (error) {
            return res.status(400).json({ error });
        }
    },
    async show(req, res) {
        try {
            const adminUser = await AdminUser.findOne({ _id: req.params.id });
            return res.json(adminUser);
        } catch (error) {
            return res.status(400).json({ error });
        }
    },
    async store(req, res) {
        try {
            if (await AdminUser.findOne({ email: req.body.email })) {
                return res.status(400).json({ error: "Usuário administrativo já cadastrado." });
            }
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const adminUser = await AdminUser.create(req.body);
            return res.status(201).json(adminUser);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error });
        }
    },
    async update(req, res) {
        try {
            const adminUser = await AdminUser.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            return res.json(adminUser);
        } catch (error) {
            return res.status(400).json({ error });
        }
    },
    async destroy(req, res) {
        try {
            await AdminUser.findOneAndUpdate({ _id: req.params.id }, { status: "inactive" }, { new: true });
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
}