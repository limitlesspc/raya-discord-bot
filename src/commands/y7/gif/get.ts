import prisma from '$services/prisma';
import command from '../../command';

export default command(
  {
    desc: 'Get a random gif from yyyyyyy.info',
    options: {}
  },
  async i => {
    const count = await prisma.y7GIF.count();
    const skip = Math.floor(Math.random() * count);
    const gif = await prisma.y7GIF.findFirst({
      select: {
        fileName: true
      },
      skip
    });
    if (!gif) return i.reply('No image found');

    const url = `${process.env.FILES_ORIGIN}/y7/images/${gif.fileName}`;
    return i.reply(url);
  }
);
