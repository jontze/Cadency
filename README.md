# Discord Bot

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![Linting](https://github.com/UsingPython/DiscordBot/workflows/Linting/badge.svg?branch=develop&event=push)

- [Requirements](#requirements)
- [Installation](#installation)
- [Contributing](#contributing)

## Requirements

- min. NodeJS v14.15

## Installation

- With Docker:
  - Build the image and run the container with the `BOT_TOKEN` as environment variable `docker run -d --env-file=.env <image-name>`
- Without Docker:
  - Install node_modules: `npm i --save`
  - Build: `npm run build`
  - Create an .env file based on the .env.example with an valid BOT_TOKEN
  - Execute index.js in dist-Folder: `node dist/index.js`

## Contributing

 You want to add an command?
 Just create a new file in the commands directory, look at the other commands for the basic layout, write your code and don't forgett to import your new file in the index.js of the commands directory.
