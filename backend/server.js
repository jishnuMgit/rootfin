import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectMongoDB from './db/database.js';
import UserRouter from './route/LoginRoute.js';
// import { sendWhatsAppMessage } from './lib/WhatsAppMessage.js';
const app = express();

const port = process.env.PORT || 7000;

//http://localhost:3000

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://localhost:5173/', 'http://localhost:3000'],
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('App is running');
});

app.use("/user",UserRouter)



app.listen(port, () => {
  connectMongoDB()
  console.log(`Server running on port ${port}`);
});

