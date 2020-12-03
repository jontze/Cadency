FROM node:14.15 as build
WORKDIR /usr/discordbot
COPY package*.json ./
COPY tsconfig.json .
RUN npm install && mkdir src
COPY . .
RUN npm run build

FROM node:14.15 as production
WORKDIR /usr/discordbot
RUN apt-get update || : && apt-get install python -y
RUN apt-get install ffmpeg -y
COPY package*.json ./
RUN npm install ci --only=production
COPY --from=build /usr/discordbot/dist .
USER node
CMD ["node", "index.js"]