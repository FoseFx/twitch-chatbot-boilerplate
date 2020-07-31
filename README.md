[![Unlicense][license-badge]][license]
![Dependabot](https://flat.badgen.net/dependabot/FoseFx/twitch-chatbot-boilerplate?icon=dependabot)
[![Maintainability](https://api.codeclimate.com/v1/badges/7a50cf1e04aa3d0ad861/maintainability)](https://codeclimate.com/github/FoseFx/twitch-chatbot-boilerplate/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7a50cf1e04aa3d0ad861/test_coverage)](https://codeclimate.com/github/FoseFx/twitch-chatbot-boilerplate/test_coverage)

# twitch-chatbot-boilerplate ([Wiki][wiki])

> This project is not affiliated to Twitch Interactive Inc in any way.

![Header](.github/images/header.png?raw=true)

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

If you don't like the choices made for you by the boilerplate you can just use the [core npm package][core] by itself.
It exports the [initialize()][initialize-api] function which takes care of setting up an http server and the setup process. You call it and get a tmi.js client back which is already connected to twitch.

## Setup (short)

> The full setup guide with screenshots is available in the [wiki][setup-full]

1. [Register a twitch app][createtwitchapp].
2. Make sure to include the `/setup/callback`, `/add/callback` and `/setup/callback` routes.
3. Clone or download this repository
4. Install dependencies `npm install`
5. Copy both the secret and your Client-ID into a `.env` file (`cp .env.example .env` first)
6. Build and start the bot: `npm run build` and `npm run start`
7. Follow further instructions
8. Write your bot (`/main.ts`)
9. **Profit**

[Next Steps][next-steps]

## Caveats
See [wiki][caveats]

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

[wiki]: https://github.com/FoseFx/twitch-chatbot-boilerplate/wiki
[initialize-api]: https://fosefx.github.io/twitch-chatbot-boilerplate-core/docs/modules/_core_.html#initialize
[core]: https://github.com/FoseFx/twitch-chatbot-boilerplate-core
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
[caveats]: https://github.com/FoseFx/twitch-chatbot-boilerplate/wiki/Caveats
[setup-full]: https://github.com/FoseFx/twitch-chatbot-boilerplate/wiki/Setup#setup-full
[next-steps]: https://github.com/FoseFx/twitch-chatbot-boilerplate/wiki/Setup#next-steps
