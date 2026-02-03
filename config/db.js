// config/db.js
const { MongoClient } = require("mongodb");

let ticketsCollection;

async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db("ticketDB"); // اسم قاعدة البيانات
    ticketsCollection = db.collection("tickets");
    return ticketsCollection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = { connectDB };
