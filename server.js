const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // enable CORS

mongoose.connect("mongodb+srv://vs:vUT02El6bo6jnZzH@project-z.n0ck4xa.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to MongoDB Atlas");
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/send_data", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
