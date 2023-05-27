import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToMongo } from "./db/db";
import shortUrlRouter from './routes/short-url';
import authRouter from './routes/auth';
import shortyRouter from './routes/shorty';
import expenseRouter from './routes/expense';
const app: Express = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieparser from 'cookie-parser';

const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieparser());


dotenv.config();

connectToMongo();

const port = process.env.PORT || 3001;
const host = process.env.HOST;

app.use('/short-url', shortUrlRouter);
app.use('/shorty', shortyRouter);
app.use('/expense', expenseRouter);
app.use('/', authRouter);


app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at ${host}:${port}`);
});