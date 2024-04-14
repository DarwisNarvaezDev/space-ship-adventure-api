import { Request, Response } from "express";
import { Logger } from "pino";
import { Server } from "socket.io";

/**
 * Interface to specify the behavio of the service
 * 
 */
export interface CommandService {
    /**
     * Emits the command event to client
     * 
     * @param req 
     * @param res 
     * @param appLogger 
     * @param io 
     */
    emitCommandEvent (
        req: Request,
        res: Response,
        appLogger: Logger,
        io: Server,
    ): void
}