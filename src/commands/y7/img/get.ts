import prisma from '$services/prisma';
import command from '$services/command';

export default command(
  {
    desc: 'Get a random image from yyyyyyy.info',
    options: {}
  },
  async i => {
    const where = {
      extension: {
        not: 'gif'
      }
    };
    const count = await prisma.y7File.count({ where });
    const skip = Math.floor(Math.random() * count);
    const image = await prisma.y7File.findFirst({
      select: {
        name: true
      },
      where,
      skip
    });
    if (!image) return i.reply('No image found');

    const url = `${process.env.FILES_ORIGIN}/y7/images/${image.name}`;
    return i.reply(url);
  }
);
