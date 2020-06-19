import { AuthData } from '../server/server.types';

let _botRunning = false;
export async function startBot(authData: AuthData | null): Promise<void> {
  if (_botRunning || authData === null) {
    return;
  }
  console.log('TODO', authData); // TODO
  _botRunning = true;
}
