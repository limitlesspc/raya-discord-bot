FROM ubuntu

RUN apt update
RUN apt upgrade -y
RUN apt autoremove -y

RUN apt install -y python-is-python3

FROM node:16

RUN npm i -g pnpm

ENV NODE_ENV=production

COPY package.json pnpm-lock.json ./
RUN pnpm run setup
COPY . .

CMD pnpm start