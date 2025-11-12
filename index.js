const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");


mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() =>
    console.log("=============MongoDb Database connected successfuly")
  )
  .catch((err) => console.log("Database Not connected !!!", err));

//middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const product = require("./route/product");
const Clients = require("./route/clients");
const order = require("./route/order");
const quotations = require("./route/quotations");
// const termscondition = require("./route/termscondition");
const user = require("./route/user");
// const clientAuth = require("./route/Auth/clientAuth.js");
const master = require("./route/Auth/Master.js");
const invoiceRoutes = require('./route/Invoicename.js'); 
const Clientauth = require('./route/clients.js');
const Paymentrout = require('./route/Payment.js')

app.use("/api/user", user);
app.use("/api/product", product);
app.use("/api/client", Clients);
app.use("/api/order", order);
app.use("/api/quotations", quotations);
// app.use("/api/termscondition", termscondition);
app.use("/api/master", master);
app.use("/api/invoicename", invoiceRoutes);
app.use('/api/client',Clientauth);
app.use("/api/payment",Paymentrout)


const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Rent Angadi" });
});

app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});
