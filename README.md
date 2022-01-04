# Cadency - Discord Bot

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![Linting](https://github.com/jontze/Cadency/workflows/Linting/badge.svg?branch=develop&event=push)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/jontze/Cadency/master)
[![GitHub license](https://img.shields.io/github/license/jontze/Cadency)](https://github.com/jontze/Cadency/blob/master/LICENSE)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_DiscordBot&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=UsingPython_DiscordBot)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_DiscordBot&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=UsingPython_DiscordBot)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=UsingPython_DiscordBot&metric=security_rating)](https://sonarcloud.io/dashboard?id=UsingPython_DiscordBot)

- [Cadency - Discord Bot](#cadency---discord-bot)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Features](#features)
  - [Contributing](#contributing)

## Requirements

- Docker
- Docker-compose
- A valid discord bot token ([How to get a token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token))

## Installation

- Clone the repo
- Create a `.env` file based on the [.env.example](https://github.com/UsingPython/DiscordBot/blob/master/.env.example)
- Start the postgres database and after that the app
  - ` docker-compose up -d postgres`
  - ` docker-compose up -d app`

## Features

- Play music from YouTube by URL and search query
  - start adding music to the queue with `<prefix>play <youtube-video-url / search-query>`
  - search for a song with `search <search query>`
  - `skip` / `pause` / `resume` the songs in the queue
  - `show` or `purge` the songs on the queue
- Some more stuff, just ask the bot with `<prefix>help`

## Contributing

**You will need...**

- Min. NodeJS v14.15
- Yarn
- Docker and docker-compose or a local postgres server
- A valid discord bot token
- [ffmpeg](https://www.ffmpeg.org) local installed
