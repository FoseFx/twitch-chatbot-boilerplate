import * as core from 'twitch-chatbot-boilerplate';
import { Client, ChatUserstate } from 'tmi.js';
import { main } from '../src/main';

/**
 * In case you wonder, in the /.jest/preload.js file I overwrote
 * `console.log()` and `console.info()`,
 * so you wont see any logs
 * */
describe('main.ts', () => {
  let client: Client;
  beforeEach(() => {
    // New Client, here is where you should add stubs
    client = Client({});
    client.say = jest.fn(); // Calls so client.say() now go to jest

    // Just give the main function our new Client
    jest
      .spyOn(core, 'initialize')
      .mockResolvedValue({ client, app: undefined });

    // Call function, so we dont have to do so in every test
    main();
  });

  describe('Heya', () => {
    it('should answer when sb. posts "!hello"', () => {
      expect.assertions(1);
      const userstate: ChatUserstate = {
        username: 'FoseFx',
      };

      // Fake an incoming message
      client.emit('message', 'who_cares', userstate, '!hello', false);

      // this works because we replaced client.say with jest.fn() in beforeEach()
      expect(client.say).toHaveBeenCalledWith('who_cares', `@FoseFx, heya!`);
    });

    it('should not answer when sb. posts any message', () => {
      expect.assertions(1);
      const userstate: ChatUserstate = {
        username: 'FoseFx',
      };
      client.emit('message', 'who_cares', userstate, 'KEKW', false);

      expect(client.say).not.toHaveBeenCalled();
    });

    it('should not answer when bot itself posts "!hello"', () => {
      expect.assertions(1);
      const userstate: ChatUserstate = {
        username: 'nice-bot',
      };
      client.emit('message', 'who_cares', userstate, '!hello', true);

      expect(client.say).not.toHaveBeenCalled();
    });
  });
});
