// routes/tickets.js
const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// GET كل التذاكر
router.get("/", async (req, res) => {
  try {
    const ticketsCollection = req.ticketsCollection;
    if (!ticketsCollection) return res.status(500).json({ message: "DB not connected" });

    const tickets = await ticketsCollection.find({}).toArray();
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST حجز تذكرة جديدة
router.post("/", async (req, res) => {
  try {
    const ticketsCollection = req.ticketsCollection;
    if (!ticketsCollection) return res.status(500).json({ message: "DB not connected" });

    const { event, date, seatNumber, customerName } = req.body;
    if (!event || !date || !seatNumber || !customerName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await ticketsCollection.find({ seatNumber }).toArray();
    if (existing.length > 0) return res.status(400).json({ message: "Seat already booked" });

    const newTicket = { event, date, seatNumber, customerName, bookedAt: new Date() };
    await ticketsCollection.insertOne(newTicket);

    res.status(201).json(newTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE تذكرة
router.delete("/:id", async (req, res) => {
  try {
    const ticketsCollection = req.ticketsCollection;
    if (!ticketsCollection) return res.status(500).json({ message: "DB not connected" });

    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ticket ID" });

    const result = await ticketsCollection.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Ticket not found" });

    res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
