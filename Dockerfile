FROM ubuntu

RUN apt update
RUN apt upgrade -y
RUN apt autoremove -y

RUN apt install mesa-utils xvfb libgl1-mesa-dri libglapi-mesa libosmesa6 -y
RUN apt install curl python-is-python3 -y

FROM node:16

RUN npm i -g pnpm

WORKDIR /raya

ENV NODE_ENV=production

COPY ["package.json", "pnpm-lock.json", "./"]
RUN pnpm run setup
COPY . .

CMD [ "xvfb-run", "-s", "-ac -screen 0 1280x1024x24", "pnpm", "start" ]