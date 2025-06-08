import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.replace(/ /g, "").split(","); 

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Request ➝ CORS ➝ JSON Parser ➝ URL Parser ➝ Static ➝ Cookie ➝ Routes ➝ Error Handler

app.use(cors(corsOptions));

app.use(express.json({limit: "16kb"}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());

//routes import
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

//routes declaration
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res) => {
  res.send("API Working")
})

// Error Handling Middleware (should be placed after routes)
app.use(errorHandler);

export { app };