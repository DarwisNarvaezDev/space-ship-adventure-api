import { Server } from 'socket.io';
import { Server as HttpServer } from 'http'

export interface ExternalCommand {
    distance: number
    rocketSpeed: number
    flightTime: number
};

interface ClientToServerEvents { }

interface ServerToClientEvents {
    commandReceived: (state: ExternalCommand) => void
}

interface InterServerEvents { }

interface SocketData { }

/**
 * Opens a web socket to given client URL and auth.
 * 
 */
export function initServer(
    httpServer: HttpServer,
    clientUrl: string,
    allowedMethods: string[]
): Server {
    try {
        return new Server<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >(httpServer, {
            cors: {
                origin: clientUrl,
                // methods: allowedMethods,
            },
        });
    } catch (error: Error | unknown) {
        throw new Error(`Error during socket connection: ${error}`)
    }
}