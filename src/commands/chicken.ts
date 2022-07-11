import command from '$services/command';

export default command(
  {
    desc: 'Chicken!',
    options: {}
  },
  i => i.reply(`${process.env.FILES_ORIGIN}/memes/chicken.mp4`)
);
