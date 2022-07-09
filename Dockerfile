FROM ubuntu

RUN apt update
RUN apt upgrade -y
RUN apt autoremove -y

RUN apt install -y python-is-python3

FROM node:16
ENV NODE_ENV=production

RUN npm i --location=global pnpm

WORKDIR /home/node/raya

COPY package.json pnpm-lock.json ./
RUN pnpm run setup
COPY . .

CMD pnpm start