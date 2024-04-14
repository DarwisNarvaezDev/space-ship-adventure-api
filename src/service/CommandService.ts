import { Request, Response } from "express";
import { Logger } from "pino";
import { Command } from "../interfaces/Command";
import { Server as IoServer } from 'socket.io';
import { Events } from "../util/Events";

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

export class CommandService {
    static emitCommandEvent (
        req: Request,
        res: Response,
        appLogger: Logger,
        io: IoServer
    ) {
        try {
            const command: Command = req.body
            if( 
                command.distance && command.flightTime && command.rocketSpeed
             ){
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
    }
}