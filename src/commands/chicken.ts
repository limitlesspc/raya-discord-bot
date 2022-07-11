import command from '$services/command';

export default command(
  {
    desc: 'Chicken!',
    options: {
      sticken: {
        desc: 'Sticken!',
        type: 'bool',
        optional: true
      }
    }
  },
  i => i.reply(`${process.env.FILES_ORIGIN}/memes/chicken.mp4`)
);
