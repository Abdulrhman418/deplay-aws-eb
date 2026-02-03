const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  event: { type: String, required: true },
  date: { type: Date, required: true },
  seatNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ticket", TicketSchema);
