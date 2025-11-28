import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    spa: { type: mongoose.Schema.Types.ObjectId, ref: "Spa", required: true },
    spaId: { type: String, required: true },
    spaName: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    services: [{ type: String }],
    message: { type: String },
    source: {
      type: String,
      default: "chatbot",
      enum: ["chatbot", "admin", "import", "unknown"],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Lead", leadSchema);

