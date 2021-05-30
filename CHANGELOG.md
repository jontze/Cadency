# [2.0.0](https://github.com/UsingPython/DiscordBot/compare/v1.3.0...v2.0.0) (2021-05-30)


* refactor(main)!: Refactor entry file to use updated name of main class ([a43866b](https://github.com/UsingPython/DiscordBot/commit/a43866bf452094a0bb681489e0d5534039fb739c))
* refactor(bot)!: Rename discordbot class to cadency and refactor ([dca88a4](https://github.com/UsingPython/DiscordBot/commit/dca88a482e233760fdc438481567b3337ebf04b5))
* feat(base)!: Refactor and initialize new Database class ([f0490d7](https://github.com/UsingPython/DiscordBot/commit/f0490d74d70d1a8753b646714ed3a6a50107899a))


### Features

* **commands:** Add command to change prefix ([6529fd5](https://github.com/UsingPython/DiscordBot/commit/6529fd58122ed037e58843c7a767abe7920189e1))
* **commands:** Remove `test` command ([46189be](https://github.com/UsingPython/DiscordBot/commit/46189be3428783144e762c0d4b18236978c9a7bc))
* **config:** Setup config class with default constants ([29b720c](https://github.com/UsingPython/DiscordBot/commit/29b720ce31cc4893251191b8ed2f83041642457c))
* **database:** Create prismaORM wrapper classes ([726ecbb](https://github.com/UsingPython/DiscordBot/commit/726ecbbe729683e62dc60c4a025377868f880c0b))
* **errors:** Setup custom errors to improve error handling to user ([027dead](https://github.com/UsingPython/DiscordBot/commit/027dead18f6ea8d57f9fecc7520b936ef0442a14))
* **messageHandler:** Add command handler to execute command pass custom errorsto user ([a522c91](https://github.com/UsingPython/DiscordBot/commit/a522c91762b504cb0dbcd69f8e65523583924537))
* **prisma:** Setup schema and init migration ([4228c9f](https://github.com/UsingPython/DiscordBot/commit/4228c9f9ea352743215cd198e7f39b9dc2c4ce1f))


### BREAKING CHANGES

* Now `main.js` is used to start the application instead of `index.js`
* `DiscordBot` class renamed to `Cadency`
* The usage of the bot now *requires* a running postgres database

# [1.3.0](https://github.com/UsingPython/DiscordBot/compare/v1.2.10...v1.3.0) (2021-04-28)


### Bug Fixes

* **dependencies:** Update dependencies to latest ([51aae52](https://github.com/UsingPython/DiscordBot/commit/51aae52e0f3b7ff9bf02a61edbe53cee51e35e34))


### Features

* **devcontainer:** Setup typescript devcontainer with postgres ([76a7984](https://github.com/UsingPython/DiscordBot/commit/76a7984a146c262c2bec980e12e6ad619b6af518))

## [1.2.10](https://github.com/UsingPython/DiscordBot/compare/v1.2.9...v1.2.10) (2021-03-22)


### Bug Fixes

* **basebot:** Fix code smell ([ac84c0c](https://github.com/UsingPython/DiscordBot/commit/ac84c0c398ddd2e8fc4f1212996713621b59a9b7))

## [1.2.9](https://github.com/UsingPython/DiscordBot/compare/v1.2.8...v1.2.9) (2021-03-21)


### Bug Fixes

* **publish-image:** Change repo to lower-case ([2c41d09](https://github.com/UsingPython/DiscordBot/commit/2c41d09d6fdf36bd0738f85b5024f1aa2dee7877))

## [1.2.8](https://github.com/UsingPython/DiscordBot/compare/v1.2.7...v1.2.8) (2021-03-21)


### Bug Fixes

* **publish-image:** Change repo to lower-case ([7fd9896](https://github.com/UsingPython/DiscordBot/commit/7fd98964bb0b96f419e544ce00c89bfeda80cf84))

## [1.2.7](https://github.com/UsingPython/DiscordBot/compare/v1.2.6...v1.2.7) (2021-03-21)


### Bug Fixes

* **publish-image:** Correct tags name ([5da1128](https://github.com/UsingPython/DiscordBot/commit/5da112840431e5502f9cd5593b34d950095e86ef))

## [1.2.6](https://github.com/UsingPython/DiscordBot/compare/v1.2.5...v1.2.6) (2021-03-21)


### Bug Fixes

* **publish-image:** Add missing tags ([c15d893](https://github.com/UsingPython/DiscordBot/commit/c15d8938e6f1344e9c86d85d6c123e9df63eb4ef))

## [1.2.5](https://github.com/UsingPython/DiscordBot/compare/v1.2.4...v1.2.5) (2021-03-18)


### Bug Fixes

* **publish-image:** Switch to ghcr.io registry ([8bc758a](https://github.com/UsingPython/DiscordBot/commit/8bc758a76a972c9a637e206f0ee911008535bb71))

## [1.2.4](https://github.com/UsingPython/DiscordBot/compare/v1.2.3...v1.2.4) (2021-03-18)


### Bug Fixes

* **query-string:** Major dependency update ([107f0f9](https://github.com/UsingPython/DiscordBot/commit/107f0f9687f50e15dfc4ce44b051ea82aab0f171))

## [1.2.3](https://github.com/UsingPython/DiscordBot/compare/v1.2.2...v1.2.3) (2021-03-18)


### Bug Fixes

* **sonarcloud:** Fix some code smells ([6094a86](https://github.com/UsingPython/DiscordBot/commit/6094a86bba5c45f83326fbde465508a15036880c))
