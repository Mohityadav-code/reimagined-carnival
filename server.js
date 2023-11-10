const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // enable CORS
app.use(express.json()); // parse incoming JSON

mongoose.connect("mongodb+srv://vs:vUT02El6bo6jnZzH@project-z.n0ck4xa.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to MongoDB Atlas");
});
function parseData(array) {
    const [first, second, third, fourth, fifth, sixth, seventh] = array;

    const parseNumberAndPercentage = (str) => {
        const numPercMatch = str.match(/([\d,.]+)\+?([\d.]+)%/);
        return numPercMatch ? { number: numPercMatch[1], percentage: numPercMatch[2] } : { number: str, percentage: '0.00' };
    };

    // Helper function to parse price, change and percentage
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
}
 

// Example usage
const data2 = [
    null,
    "10.00%",
    "₹1,318.70-31.30 (2.32%)",
    "18,100.00",
    "₹1.00-0.60 (37.50%)",
    "4,297+3.39%",
    null
];

const parsedData2 = parseData(data2);
console.log(parsedData2);


// Example usage
const data = [
    null,
    '90,993+36.14%',
    '₹4.75-2.30 (32.62%)',
    '19,800.00',
    '₹338.30-18.15 (5.09%)',
    '3,924+110.40%',
    null
];

const parsedData = parseData(data);
console.log(parsedData);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/send_data", (req, res) => {
    
    console.log(req.body);
    const data = req.body.data
    console.log("Printing data values:");
    console.log(data);
const updatedArray = data.map((item,index) => {
        if(index !==0)
    return parseData(item);
})
 console.log(updatedArray)
    return res.status(200);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
