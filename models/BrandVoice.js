const mongoose = require("mongoose");

const brandVoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tone: { type: String, required: true },
  commonPhrases: { type: String, required: true },
  //createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BrandVoice", brandVoiceSchema);