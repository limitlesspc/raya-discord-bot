import command from './command';

export default command(
  {
    desc: 'Ping!',
    options: {}
  },
  async i => i.reply('Pong!', { ephemeral: true })
);
