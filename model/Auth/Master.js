const mongoose = require("mongoose");

const teamsSchema = new mongoose.Schema(
  {
    name: String,
    password: String,
    email: String,
    Dashboard: Boolean,
    user:Boolean,
    clients:Boolean,
    orders:Boolean,
    quotation:Boolean,
    paymentreports:Boolean,
    termsandcondition:Boolean,
    product:Boolean,
  },
  {
    timestamps: true,
  }
);

const TeamMembers = mongoose.model("TeamMembers", teamsSchema);
module.exports = TeamMembers;
