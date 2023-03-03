const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
require("dotenv/config");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    uf: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    registerDate: { type: String, required: true },
    status: { type: String, required: true, default: "active" },
  },
  { timestamps: {} }
);

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", UserSchema);
