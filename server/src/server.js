require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectUsersDB, connectAppDB } = require("./config/db");
const { initUserModel } = require("./controllers/auth.controller");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ecommerce backend running");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (process.env.MONGO_URI_USERS) {
      const usersConn = await connectUsersDB();
      await connectAppDB();
      initUserModel(usersConn);
    }

    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  } catch (err) {
    console.error(err.message);
  }
}

start();