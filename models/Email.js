const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ["pending", "responded"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  receivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Email", emailSchema);