import { Command } from "../interfaces/Command";

const validateCommandRequest = (body: Command) => {
    if( !body.distance || !body.flightTime || !body.flightTime ){
        return false;
    }
}