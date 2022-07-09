FROM ubuntu

RUN apt update
RUN apt upgrade -y
RUN apt autoremove -y

RUN apt install git curl xvfb libgl1-mesa-dev python-is-python3 -y

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | -E bash -
RUN apt-get install -y nodejs

RUN npm i -g pnpm

WORKDIR /raya

ENV NODE_ENV=production

COPY ["package.json", "pnpm-lock.json", "./"]
RUN pnpm run setup
COPY . .

CMD [ "pnpm", "start" ]