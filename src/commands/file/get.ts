import prisma from '$services/prisma';
import command from 'limitless/discord/command';
import { extensions, sendFile, Type, types } from './shared';

export default command(
  {
    desc: 'Get a random file from files.in5net.io/discord',
    options: {
      type: {
        type: 'choice',
        desc: 'Type of file to get',
        choices: types,
        optional: true
      },
      googas: {
        type: 'bool',
        desc: 'googas + gradi',
        optional: true
      }
    }
  },
  async (i, { type, googas }) => {
    if (googas)
      return i.reply(
        ['googas.mp4', 'gradi.png']
          .map(name => `https://${process.env.FILES_DOMAIN}/discord/${name}`)
          .join(' ')
      );

    const file = await getRandomFile(type);
    if (!file) return i.reply('No file found');

    return sendFile(i, file.name);
  }
);

export async function getRandomFile(type?: Type) {
  const where = type
    ? {
        extension: {
          in: extensions[type]
        }
      }
    : undefined;
  const count = await prisma.file.count({ where });
  const skip = Math.floor(Math.random() * count);
  const file = await prisma.file.findFirst({
    select: {
      name: true
    },
    where,
    skip
  });
  return file;
}
