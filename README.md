# Discord Bot

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![Linting](https://github.com/UsingPython/DiscordBot/workflows/Linting/badge.svg?branch=develop&event=push)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/UsingPython/DiscordBot/master)
[![GitHub license](https://img.shields.io/github/license/UsingPython/DiscordBot)](https://github.com/UsingPython/DiscordBot/blob/master/LICENSE)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_DiscordBot&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=UsingPython_DiscordBot)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_DiscordBot&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=UsingPython_DiscordBot)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_DiscordBot&metric=security_rating)](https://sonarcloud.io/dashboard?id=UsingPython_DiscordBot)

- [Discord Bot](#discord-bot)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Features](#features)
  - [Contributing](#contributing)

## Requirements

- min. NodeJS v14.15
- a valid Discord Bot-Token ([How to get a token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token))
- [ffmpeg](https://www.ffmpeg.org)
- _Optional:_ Docker

## Installation

- With Docker:
  - Build the image and run the container with the `BOT_TOKEN` as environment variable `docker run -d --env-file=.env <image-name>`
- Without Docker:
  - Install node_modules: `npm i --save`
  - Build: `npm run build`
  - Create an .env file based on the .env.example with an valid BOT_TOKEN
  - Execute the index.js in dist-Folder: `node dist/index.js`
- The default prefix is `/`. If you want another prefix, you can change it:

```js
new Bot(<BOT_TOKEN>, {
  prefix: '!',
  activity: 'some music',
  activityType: 'PLAYING', // PLAYING | STREAMING | LISTENING | WATCHING | CUSTOM_STATUS | COMPETING
  status: 'online' // online | idle | dnd | invisible | undefined
}).start()
```

## Features

- Play music from YouTube by URL
  - start adding music to the queue with `<prefix>play <youtube-video-url>`
  - `skip` / `stop` / `pause` / `resume` the songs in the queue
  - `show` or `purge` the songs on the queue
- Some more stuff, just ask the bot with `<prefix>help`

## Contributing

You want to add an command?
Just create a new file in the commands directory, look at the other commands for the basic layout, write your code and don't forgett to import your new file in the index.ts of the commands directory.
