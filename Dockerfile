FROM node:14-alpine

WORKDIR /usr/src/discordbot

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]