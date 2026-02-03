const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    location: {
      type: String,
    },
    profile: {
      type: String, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
