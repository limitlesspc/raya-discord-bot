FROM ubuntu

RUN apt update
RUN apt upgrade -y
RUN apt autoremove -y

RUN apt install -y python-is-python3

FROM node:16
ENV NODE_ENV=production

RUN npm i -g pnpm

COPY package.json pnpm-lock.json ./
RUN pnpm run setup
COPY . .

CMD pnpm start