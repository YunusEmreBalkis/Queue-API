require("dotenv").config()
require("express-async-errors");

const express  = require("express");
const app = express();

const connectDb = require("./db/connect")

//rest of packages

const cookieParser = require("cookie-parser")
const rateLimiter = require("express-rate-limit")
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const mongoSanatize = require("express-mongo-sanitize")

//Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoute");
const queueRoutes = require("./routes/queueRoutes")


//Middleware
const notFound = require("./middleware/not-found");
const errorHandleMiddleware = require("./middleware/error-handler")

app.set("trust proxy",1)
app.use(rateLimiter({
    windowMs: 15*60*1000,
    max:60,
}))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanatize())

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"))


app.get("/api/v1",(req,res) => {
    res.send("Home Page");
})
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/place",placeRoutes);
app.use("/api/v1/queue",queueRoutes);


app.use(notFound)
app.use(errorHandleMiddleware)

const port = process.env.PORT ||"7000";

const start = async ()=>{
    try {
        await connectDb(process.env.MONGO_URL)
        app.listen(port, ()=>console.log(`Server listening on port ${port}`));
    } catch (error) {
        
    }
}

start();
console.log("Queue Api")