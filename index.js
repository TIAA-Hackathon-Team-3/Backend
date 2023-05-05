const express = require('express');
const cors = require('cors');
const connectDB =  require('./Config/DB_Config');
const helmet =require('helmet')
require('dotenv').config()
const authRoute = require('./Routes/AuthRoute')
const port = process.env.REACT_APP_PORT;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
connectDB();

app.use('/api/v1',authRoute);
app.get("/", (req, res) => {
    res.json({ message: "Hello from Quora" });
  });

app.listen(port , ()=>{
    console.log(`Server is running on ${port} ...`);
})