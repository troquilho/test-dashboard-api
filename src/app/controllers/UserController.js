const User = require('../models/User');
const moment = require("moment");

module.exports = {
    async index(req, res) {
        try {
            const { paginate = false, limit = 10, page = 1, order = "desc", sortBy = "createdAt", name = '' } = req.query;
            let user;
            if (paginate == "true") {
                user = await User.paginate({ name: {$regex: name, $options: "i"} }, { page, limit: parseInt(limit), sort: { [sortBy]: order } });
            } else {
                user = await User.find({ name: {$regex: name, $options: "i"} }).sort({ [sortBy]: order }).limit(parseInt(limit))
            }
            return res.json(user);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error });
        }
    },
    async show(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id });
            return res.json(user);
        } catch (error) {
            return res.status(400).json({ error });
        }
    },
    async store(req, res) {
        try {
            if (await User.findOne({ email: req.body.email })) {
                return res.status(400).json({ error: "E-mail já cadastrado." });
            }

            req.body.registerDate = moment().format('YYYY-MM-DD');
            const user = await User.create(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return res.status(400).json({ error });
        }
    },
    async update(req, res) {
        try {
            const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            return res.json(user);
        } catch (error) {
            return res.status(400).json({ error });
        }
    },
    async destroy(req, res) {
        try {
            await User.findOneAndUpdate({ _id: req.params.id }, { status: "inactive" }, { new: true });
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ error });
        }
    },
    async getCount(req, res) {
        try {
            const total = await User.countDocuments();
            const ontem = await User.countDocuments({ registerDate: {$eq: (moment().subtract(1, 'days').format("YYYY-MM-DD"))} });
            const hoje = await User.countDocuments({ registerDate: {$eq: (moment().format("YYYY-MM-DD"))} });
            const ativo = await User.countDocuments({ status: 'active' });
            const inativo = await User.countDocuments({ status: 'inactive' });

            let obj = {total, ontem, hoje, ativo, inativo};
            return res.json(obj);
        } catch (error) {
            return res.status(400).send({ error });
        }
    },
}