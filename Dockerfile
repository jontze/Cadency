FROM node:14.15-alpine as build
WORKDIR /usr/discordbot
COPY package*.json ./
COPY tsconfig.json .
RUN npm install && mkdir src
COPY . .
RUN npm run build

FROM node:14.15-alpine as production
RUN apk update
WORKDIR /usr/discordbot
COPY package*.json ./
RUN npm install ci --only=production
COPY --from=build /usr/discordbot/dist .
USER node
CMD ["node", "index.js"]