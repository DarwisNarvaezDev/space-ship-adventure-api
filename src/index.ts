import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from "dotenv";
import { UrlMappings } from "../enums/UrlMappings";
import http, { Server } from 'http'
import { initServer } from "./socket/SocketProvider";
import { Command } from "./interfaces/Command";
import { Events } from "./util/Events";
import { configureLogger } from "./logger/Logger";

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
const io = initServer(server, clientUrl, allowedHttpMethods)

app.get(UrlMappings.TEST_ENDPOINT, (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.post(UrlMappings.SEND_COMMAND, (req: Request, res: Response) => {
    try {
        const command: Command = req.body
        if( command ){
            // Emit the event to client
            appLogger.info(`Sending event: [${Events.COMMAND_EVENT}] to origin: ${clientUrl}, with payload: [distance: ${command.distance}, speed: ${command.rocketSpeed}, time: ${command.flightTime}])}]`)
            io.emit(Events.COMMAND_EVENT, command);
            appLogger.info("Event emitted!")
            return res.json({message: "Command sent successfully."})
        }else{
            appLogger.error("Bad request for event.")
            res.status(400).json("Please check the command.")
        }
    }catch(error: Error | unknown){
        appLogger.error(`Error while processing the command request: ${error}`)
        console.error(`Error while processing the command request: ${error}`)
    }
});

server.listen(port, () => {
    appLogger.info(`Server is running at *:${port}`);
});