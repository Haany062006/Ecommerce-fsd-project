const mongoose = require("mongoose");

let usersConn;
let appConn;

async function connectUsersDB() {
  const uri = process.env.MONGO_URI_USERS;
  if (!uri) throw new Error("MONGO_URI_USERS missing");

  usersConn = await mongoose.createConnection(uri).asPromise();
  console.log("Users DB connected");
  return usersConn;   // ✅ IMPORTANT
}

async function connectAppDB() {
  const uri = process.env.MONGO_URI_APP;
  if (!uri) throw new Error("MONGO_URI_APP missing");

  appConn = await mongoose.createConnection(uri).asPromise();
  console.log("App DB connected");
  return appConn;     // (not required but clean)
}

module.exports = { connectUsersDB, connectAppDB };