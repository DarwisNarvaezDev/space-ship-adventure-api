import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { UrlMappings } from "../enums/UrlMappings";

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT || 8080;

app.get(UrlMappings.TEST_ENDPOINT, (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.post(UrlMappings.SEND_COMMAND, (req: Request, res: Response) => {
    
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});