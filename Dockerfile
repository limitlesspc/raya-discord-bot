FROM ubuntu

RUN sudo apt update
RUN sudo apt upgrade -y
RUN sudo apt autoremove -y

RUN sudo apt install git curl xvfb libgl1-mesa-dev python-is-python3 -y

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

RUN sudo npm i -g pnpm

WORKDIR /raya

ENV NODE_ENV=production

COPY ["package.json", "pnpm-lock.json", "./"]
RUN pnpm run setup
COPY . .

CMD [ "pnpm", "start" ]