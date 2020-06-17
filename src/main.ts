import { loadEnvVariables } from './env';
import { startServer } from './server/server';

loadEnvVariables();
startServer({
  host: process.env.HOST,
  port: +process.env.PORT,
  botIsConnected: false,
  botname: process.env.BOTNAME,
});
