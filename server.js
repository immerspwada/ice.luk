const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/order", (req, res) => {
    const order = req.body;
    console.log("📦 ออเดอร์ที่ได้รับ:", order);
    res.json({ message: "ออเดอร์ถูกบันทึกแล้ว!" });
});

app.listen(3000, () => console.log("🚀 Server started on port 3000"));
