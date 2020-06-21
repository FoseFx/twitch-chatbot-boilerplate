[![Unlicense][license-badge]][license]
[![Maintainability](https://api.codeclimate.com/v1/badges/7a50cf1e04aa3d0ad861/maintainability)](https://codeclimate.com/github/FoseFx/twitch-chatbot-boilerplate/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7a50cf1e04aa3d0ad861/test_coverage)](https://codeclimate.com/github/FoseFx/twitch-chatbot-boilerplate/test_coverage)

# This is WIP and not ready to use yet!

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

### How does it work?

- Go to [dev.twitch.tv][devtwitchtv] and [create an App][createtwitchapp].
- Create a new Twitch Account for your bot. (It is possible to create multiple twitch accounts with the same email address, when you enable it)
- Clone or download this repository
- Install dependencies `npm install`
- Create a `.env` file (`cp .env.example .env`) and enter all necessary information, alternatively you can use any other way of setting an environment variable
- Build and start the bot `npm run build` and `npm run start`
- Follow further instructions

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
