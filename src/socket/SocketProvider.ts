import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Logger } from 'pino';
import dotenv from 'dotenv'

// Configure dotenv
dotenv.config();

/**
 * Socket unique token
 */
const clientToken: string = process.env.AUTH_TOKEN || ''

/**
 * To type the payload needed by client
 * 
 */
export interface ExternalCommand {
    distance: number
    rocketSpeed: number
    flightTime: number
};

/**
 * Interfaces needed to configure io (not needed)
 */
interface ClientToServerEvents { }
interface InterServerEvents { }
interface SocketData { }

/**
 * To type event subscription, every function correspond to a client's consumed event
 * 
 */
interface ServerToClientEvents {
    commandReceived: (state: ExternalCommand) => void
}

/**
 * Opens a web socket to given client URL and auth, returns a io instance.
 * 
 */
export function initServer(
    httpServer: HttpServer,
    clientUrl: string,
    appLogger: Logger
): Server {
    try {
        appLogger.info(`Starting io (WebSocket) server emitter for: ${clientUrl} with token: ${clientToken}.`)
        const ioServer: Server = new Server<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >(httpServer, {
            cors: {
                origin: clientUrl
            },
        });
        ioServer.use(addAuthToken);
        return ioServer
    } catch (error: Error | unknown) {
        throw new Error(`Error during socket connection: ${error}`)
    }
}

async function addAuthToken (socket: Socket, next: (err?: Error) => void){
    const token: string = socket.handshake.auth.token;
    const appToken: string = clientToken
    if( token && appToken ){
        try{
            if( token == appToken ){
                next();
            }else{
                next(new Error('Token not valid.'))
            }
        }catch(err: Error | unknown){
            throw new Error(`Unexpected error during handshake: ${err}`)   
        }
    }
}