const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
require('dotenv/config');

const AdminUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, default: "user" },
    status: { type: String, required: true, default: 'active' },
}, { timestamps: {} });

AdminUserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('AdminUser', AdminUserSchema);
