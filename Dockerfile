FROM node:14.15-alpine as build
WORKDIR /usr/discordbot
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
RUN yarn
COPY ./src ./src
COPY ./prisma ./prisma
RUN yarn build

FROM node:14.15 as production
WORKDIR /usr/discordbot
RUN apt-get update || : && apt-get install python -y
RUN apt-get install ffmpeg -y
COPY package.json ./
COPY yarn.lock ./
COPY ./prisma ./prisma
RUN yarn --prod
COPY --from=build /usr/discordbot/dist ./dist
RUN chown -R node node_modules/.prisma/client/ && mkdir logs
USER node
CMD ["yarn", "start"]