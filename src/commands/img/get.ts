import prisma from '$services/prisma';
import command from '$services/command';

export default command(
  {
    desc: 'Get a random image from files.in5net.io (mostly from #general)',
    options: {}
  },
  async i => {
    const count = await prisma.image.count();
    const skip = Math.floor(Math.random() * count);
    const image = await prisma.image.findFirst({
      select: {
        fileName: true
      },
      skip
    });
    if (!image) return i.reply('No image found');

    const url = `${process.env.FILES_ORIGIN}/images/${image.fileName}`;
    return i.reply(url);
  }
);
