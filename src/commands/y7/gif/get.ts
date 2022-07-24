import command from '@limitlesspc/limitless/discord/command';
import prisma from '$services/prisma';
import { NSFW_FILE_NAME } from './shared';

export default command(
  {
    desc: 'Get a random gif from yyyyyyy.info',
    options: {}
  },
  async i => {
    const where = {
      name: {
        not: NSFW_FILE_NAME
      },
      extension: 'gif'
    };
    const count = await prisma.y7File.count({ where });
    const skip = Math.floor(Math.random() * count);
    const gif = await prisma.y7File.findFirst({
      select: {
        name: true
      },
      where,
      skip
    });
    if (!gif) return i.reply('No image found');

    const url = `https://${process.env.FILES_DOMAIN}/y7/images/${gif.name}`;
    return i.reply(url);
  }
);
