import command from '$services/command';

export default command(
  {
    desc: 'Ping!',
    options: {}
  },
  async i =>
    i.reply({
      content: `Pong! ${Date.now() - i.createdTimestamp} ms`,
      ephemeral: true
    })
);
