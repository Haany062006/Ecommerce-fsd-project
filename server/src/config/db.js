const mongoose = require("mongoose");

let usersConn;
let appConn;

async function connectUsersDB() {
  const uri = process.env.MONGO_URI_USERS;
  if (!uri) throw new Error("MONGO_URI_USERS missing");

  usersConn = await mongoose.createConnection(uri).asPromise();
  console.log("Users DB connected");
}

async function connectAppDB() {
  const uri = process.env.MONGO_URI_APP;
  if (!uri) throw new Error("MONGO_URI_APP missing");

  appConn = await mongoose.createConnection(uri).asPromise();
  console.log("App DB connected");
}

module.exports = { connectUsersDB, connectAppDB };