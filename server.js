// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const ticketRoutes = require("./routes/tickets");

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const ticketsCollection = await connectDB();

    // تمرير collection لكل route
    app.use((req, res, next) => {
      req.ticketsCollection = ticketsCollection;
      next();
    });

    app.use("/api/tickets", ticketRoutes);

    app.get("/", (req, res) => res.send("Ticket Booking API is running!"));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

startServer();
