import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import apiRouter from './routes/apiRoutes';
import mongoose from 'mongoose';
import winston from './config/winston';

// Instantiate the express app
const app = express();

// Setup middleware
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/public')));
app.use(apiRouter);

// Connect to the Mongo DB and log
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/nyt-react-scraper",
    {
        useNewUrlParser: true
    },
    () => {
        winston.log({ level: 'info', message: 'Started MongoDB' });
    });

export default app;
