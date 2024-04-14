import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from "dotenv";
import http, { Server } from 'http'
import { initServer } from "./socket/SocketProvider";
import { configureLogger } from "./logger/Logger";
import { Server as IoServer } from 'socket.io';
import {CommandService} from "./service/CommandService";
import { UrlMappings } from "./util/UrlMappings";

dotenv.config();

const port = process.env.SERVER_PORT || 8080;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'
const allowedHttpMethods = ['GET', 'POST']

// Configure Logging
const appLogger = configureLogger();

// Configure express
const app: Express = express();
app.use(cors({ origin: clientUrl }));
app.use(bodyParser.json());

// Socket init
const server: Server = http.createServer(app);
const io: IoServer = initServer(server, clientUrl, allowedHttpMethods)

app.post(UrlMappings.SEND_COMMAND, (req: Request, res: Response) => {
    CommandService.emitCommandEvent(
        req,
        res,
        appLogger,
        io
    )
});

server.listen(port, () => {
    appLogger.info(`Server is running at *:${port}`);
});

export default app;