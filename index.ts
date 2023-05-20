import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToMongo } from "./db/db";
import shortUrlRouter from './routes/short-url';
import shorty from './routes/shorty';
const app: Express = express();
import bodyParser from 'body-parser';
import cors from 'cors';

const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


dotenv.config();

connectToMongo();

const port = process.env.PORT || 3001;
const host = process.env.HOST;

app.use('/short-url', shortUrlRouter);
app.use('/shorty', shorty);

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server');
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at ${host}:${port}`);
});