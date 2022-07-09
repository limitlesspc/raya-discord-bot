import command from '$services/command';

export default command(
  {
    desc: 'Ping!',
    options: {}
  },
  async i => i.reply('Pong!', { ephemeral: true })
);
