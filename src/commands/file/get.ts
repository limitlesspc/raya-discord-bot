import prisma from '$services/prisma';
import command from '$services/command';

export default command(
  {
    desc: 'Get a random file from files.in5net.io/discord (mostly from #general)',
    options: {}
  },
  async i => {
    const count = await prisma.file.count();
    const skip = Math.floor(Math.random() * count);
    const file = await prisma.file.findFirst({
      select: {
        name: true,
        extension: true
      },
      skip
    });
    if (!file) return i.reply('No file found');
    const { name, extension } = file;

    const url = `${process.env.FILES_ORIGIN}/discord/${name}.${extension}`;
    return i.reply(url);
  }
);
