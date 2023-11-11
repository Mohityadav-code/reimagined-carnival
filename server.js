const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://vs:vUT02El6bo6jnZzH@project-z.n0ck4xa.mongodb.net/db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error "));

db.once("open", function () {
    console.log("Connected to DB");
});

const Model = require('./src/models/model');

function parseData(array) {
    const [first, second, third, fourth, fifth, sixth, seventh] = array;
    const parseNumberAndPercentage = (str) => {
        const numPercMatch = str.match(/([\d,.]+)\+?([\d.]+)%/);
        return numPercMatch ? { number: numPercMatch[1], percentage: numPercMatch[2] } : { number: str, percentage: '0.00' };
    };
    const parsePriceChangePercentage = (str) => {
        const priceChangeMatch = str.match(/₹([\d,.]+)([+-][\d,.]*) \(([\d.]+)%\)/);
        return priceChangeMatch ? { price: priceChangeMatch[1], change: priceChangeMatch[2], percentage: priceChangeMatch[3] } : { price: str, change: '0.00', percentage: '0.00' };
    };
    return {
        button_buy: first,
        oi_data_call: parseNumberAndPercentage(second),
        call_price: parsePriceChangePercentage(third),
        strike_price: fourth,
        put_price: parsePriceChangePercentage(fifth),
        oi_data_put: parseNumberAndPercentage(sixth),
        button_sell: seventh
    };
};

app.get("/get_data", async (req, res) => {
    try {
        const data = await Model.find();
        res.send(data).status(200);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/send_data", async (req, res) => {
    const request = req.body;
    const updatedArray = request.map((item) => {
        return parseData(item);
    })
    const data = new Model({
        data: updatedArray
    });
    try {
        const dataToSave = await data.save();
        res.status(200).json({ message: "added", value: dataToSave });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
