import command from 'limitless/discord/command';

export default command(
  {
    desc: 'Ping!',
    options: {}
  },
  async i => i.reply(`Pong! ${Date.now() - i.createdTimestamp} ms`)
);
