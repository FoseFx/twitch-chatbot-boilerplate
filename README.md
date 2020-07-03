[![Unlicense][license-badge]][license]
![Dependabot](https://flat.badgen.net/dependabot/FoseFx/twitch-chatbot-boilerplate?icon=dependabot)
[![Maintainability](https://api.codeclimate.com/v1/badges/7a50cf1e04aa3d0ad861/maintainability)](https://codeclimate.com/github/FoseFx/twitch-chatbot-boilerplate/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7a50cf1e04aa3d0ad861/test_coverage)](https://codeclimate.com/github/FoseFx/twitch-chatbot-boilerplate/test_coverage)

# twitch-chatbot-boilerplate

> This project is not affiliated to Twitch Interactive Inc in any way.

Uses:

- [TypeScript][typescript]
- [tmi.js (Twitch Messaging Interface)][tmijs]
- [express][express]
- [ESLint][eslint]
- [Jest][jest]
- [Prettier][prettier]
- [.editorconfig][editorconfig]
- [dotenv][dotenv]

## Don't like x ?

Feel free to use the [npm package version of this boilerplate][npm-version]. The package gives you access to the magic `initialize()` function.

## How does it work?

![screenshot][i1]

1. Enable 2FA in your twitch account's security settings, you need this in order to access Twitch Developers
2. You later need to create a new account for your bot, while you are here you can allow twitch to create multiple accounts with one email address

![screenshot][i2]

3. Go to [dev.twitch.tv][devtwitchtv] and [register an App][createtwitchapp].

![screenshot][i3]

4. Go through the wizard and make sure to include the `/setup/callback`, `/add/callback` and `/setup/callback` routes.

5. Create a new Twitch Account for your bot. (You need 2FA on this one aswell if you like to get verified)

6. Clone or download this repository
7. Install dependencies `npm install`

![screenshot][i4]

8. Generate a new secret and copy both the secret and your Client-ID
9. Create a `.env` file (`cp .env.example .env`) and enter all necessary information, alternatively you can use any other way of setting an environment variable
10. Build and start the bot `npm run build` and `npm run start`
11. Follow further instructions

![screenshot][i5]

12. Write your bot (`/main.ts`)

13. Deploy it
14. **Profit**

## Next Steps

- Customize the `/views`
- Add static files to `/public`
- Read the [tmi.js docs][tmijsdocs]
- Read more about [commands and message limits][limits]
- Get your bot [known and verified][verifydocs]

## Caveats

### New Routes

Even though `initialize()` also returns the express instance, you can not simply add new routes (e.g. simply do a `app.get('/test', () => {...})`).
Instead you need to use the `beforeRouteSetup` hook.

Example:

```TypeScript
const options = {
    beforeRouteSetup(app) {
        app.get('/test', (req, res) => { ... })
    }
};

const { client } = await initialize(options);
```

### Join and part chats

Normaly streamers can add the bot by visiting `/add` and remove it on `/remove`.
When the bot goes down and needs to be restarted, the list of channels is persisted in `.config/channels.json`.
If you need to, for whatever reason, join or part channels programmatically,
import the `joinChannel()` and `leaveChannel()` functions from `core/bot/bot.ts`.

Example:

```TypeScript
import { joinChannel, leaveChannel } from './core/bot/bot.ts';

...
await joinChannel("fosefx");
await leaveChannel("fosefx");
...
```

## Available Scripts

- `clean` - remove caches and build files,
- `build` - TypeScript build,
- `build:watch` - executes `build` on every file change,
- `lint` - run the linter,
- `test` - run the tests,
- `test:watch` - executes `test` on every file change

## License

Licensed under the Unlicense. See the [LICENSE](https://github.com/fosefx/twitch-chatbot-boilerplate/blob/master/LICENSE) file for details.

The following files in `public/fonts` are licensed under the [SIL Open Font License][ofl], Version 1.1, Copyright (c) 2010-2011 by tyPoland Lukasz Dziedzic (team@latofonts.com) with Reserved Font Name "Lato":
"lato-v16-latin-900.eot", "lato-v16-latin-900.svg", "lato-v16-latin-900.ttf", "lato-v16-latin-900.woff", "lato-v16-latin-900.woff2", "lato-v16-latin-regular.eot",lato-v16-latin-regular.svg", "lato-v16-latin-regular.ttf", "lato-v16-latin-regular.woff" and "lato-v16-latin-regular.woff2"

`public/TwitchGlitchWhite.png`: Copyright (c) Twitch Interactive, Inc

[npm-version]: https://github.com/FoseFx/twitch-chatbot-boilerplate/tree/npm/#twitch-chatbot-boilerplate-npm-package
[typescript]: https://www.typescriptlang.org/
[tmijs]: https://tmijs.com/
[license-badge]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license]: https://github.com/fosefx/twitch-chatbot-boilerplate/blob/master/LICENSE
[ofl]: https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[travis]: https://travis-ci.org
[editorconfig]: https://editorconfig.org/
[devtwitchtv]: https://dev.twitch.tv/
[createtwitchapp]: https://dev.twitch.tv/docs/authentication/#registration
[dotenv]: https://www.npmjs.com/package/dotenv
[express]: https://expressjs.com/
[tmijsdocs]: https://github.com/tmijs/docs/tree/gh-pages/_posts/v1.4.2
[limits]: https://dev.twitch.tv/docs/irc/guide#command--message-limits
[verifydocs]: https://dev.twitch.tv/docs/irc/guide#known-and-verified-bots
[i1]: https://github.com/FoseFx/twitch-chatbot-boilerplate/blob/master/.github/images/1.jpg?raw=true
[i2]: https://github.com/FoseFx/twitch-chatbot-boilerplate/blob/master/.github/images/2.jpg?raw=true
[i3]: https://github.com/FoseFx/twitch-chatbot-boilerplate/blob/master/.github/images/3.jpg?raw=true
[i4]: https://github.com/FoseFx/twitch-chatbot-boilerplate/blob/master/.github/images/4.jpg?raw=true
[i5]: https://github.com/FoseFx/twitch-chatbot-boilerplate/blob/master/.github/images/5.png?raw=true
[setuproutes]: https://github.com/FoseFx/twitch-chatbot-boilerplate/blob/master/src/core/server/routes.ts#L16
