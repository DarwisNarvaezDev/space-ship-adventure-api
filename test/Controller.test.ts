import {describe, expect, test} from '@jest/globals';
import app from '../src/index';
import request from 'supertest';
import { Command } from '../src/interfaces/Command';

const commandEndpoint = "/command"

describe('Command controller', ()=>{
    test('Happy trail', async ()=> {
        const dummyPayload: Command = {
            distance: 123,
            flightTime: 123,
            rocketSpeed: 123
        }
        const res = await request(app).post(commandEndpoint).send(dummyPayload);
        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
        expect(res.body.message).toBe("Command sent successfully.")
    })

    test('Should respond 400 if any command prop is not passed', async ()=> {
        const wrongPayload: Object = {
            distance: 123,
            flightTime: 123,
        }
        const res = await request(app).post(commandEndpoint).send(wrongPayload);
        expect(res.status).toBe(400);
    })
})