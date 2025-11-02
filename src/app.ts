import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes';
import checkoutRoutes from './routes/checkoutRoutes';
import shareRoutes from './routes/shareRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://10.176.124.56:5173', // Explicitly allow your frontend origin
    credentials: true // Required when using credentials: "include" in fetch

}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DB = process.env.MONGO_URI?.replace('<PASSWORD>', process.env.DB_PASSWORD!);

mongoose.connect(DB!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error", err));

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use('/api/v1', shareRoutes);

app.use(errorHandler); 

export default app;
