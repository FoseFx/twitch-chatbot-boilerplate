import { initialize } from 'twitch-chatbot-boilerplate';
import { ChatUserstate } from 'tmi.js';

/** Called using `npm run start` */
export async function main(): Promise<void> {
  /**
   * Thank you for using this boilerplate!
   * Here is how it works (for more info checkout the README):
   *  - You register an Application on dev.twitch.tv
   *  - (You deploy the bot somewhere)
   *  - You set the necessary environment variables (in a .env file)
   *  - You create a new twitch account for your bot
   *  - You start the bot and follow the instructions
   *  - Profit! Streamers can now visit <HOST>/add and the bot will join their stream
   *
   * The initialize() function takes care of starting the HTTP server
   * and everything related to the bot in terms of starting and joining
   *
   * It will return a tmi.js Client Object, this Client is already connected, dont f things up
   * You can focus on writing your bot, if you are unsure what todo with the Client, have a look into the
   * tmi.js docs!
   *
   * Build something great!
   */
  const { client } = await initialize();

  console.info('Client is ready!');

  // This is the example listed on the tmi.js website annotated with types
  client.on(
    'message',
    (
      channel: string,
      userstate: ChatUserstate,
      message: string,
      self: boolean,
    ) => {
      if (self) return;
      if (message.toLowerCase() === '!hello') {
        client.say(channel, `@${userstate.username}, heya!`);
      }
    },
  );
}
