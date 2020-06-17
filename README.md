[![Unlicense][license-badge]][license]

# This is WIP and not ready to use yet!

# twitch-chatbot-boilerplate

> This project is not affiliated to Twitch Interactive Inc in any way.

Uses:

- [TypeScript][typescript]
- [tmi.js (Twitch Messaging Interface)][tmijs]
- [ESLint][eslint]
- [Jest][jest]
- [Prettier][prettier]
- [.editorconfig][editorconfig]

### How does it work?

1. First things first, got to [dev.twitch.tv][devtwitchtv] and [create an App][createtwitchapp].
2. Create a new Twitch Account for your bot. (It is possible to create multiple twitch accounts with the same email address, when you enable it)
3. Clone or download this repository
4. Install dependencies `npm install`
5. Build and start the bot `npm run build` and `npm run start`
6. Follow further instructions

## Available Scripts

- `clean` - remove caches and build files,
- `build` - TypeScript build,
- `build:watch` - executes `build` on every file change,
- `lint` - run the linter,
- `test` - run the tests,
- `test:watch` - executes `test` on every file change

## License

Licensed under the Unlicense. See the [LICENSE](https://github.com/fosefx/twitch-chatbot-boilerplate/blob/master/LICENSE) file for details.

[typescript]: https://www.typescriptlang.org/
[tmijs]: https://tmijs.com/
[license-badge]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license]: https://github.com/fosefx/node-typescript-boilerplate/blob/master/LICENSE
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[travis]: https://travis-ci.org
[editorconfig]: https://editorconfig.org/
[devtwitchtv]: https://dev.twitch.tv/
[createtwitchapp]: https://dev.twitch.tv/docs/authentication/#registration
