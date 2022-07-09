import prisma from '$services/prisma';
import command from '../../command';

export default command(
  {
    desc: 'Get a random image from yyyyyyy.info',
    options: {}
  },
  async i => {
    const count = await prisma.y7Image.count();
    const skip = Math.floor(Math.random() * count);
    const image = await prisma.y7Image.findFirst({
      select: {
        fileName: true
      },
      skip
    });
    if (!image) return i.reply('No image found');

    const url = `${process.env.FILES_ORIGIN}/y7/images/${image.fileName}`;
    return i.reply(url);
  }
);
