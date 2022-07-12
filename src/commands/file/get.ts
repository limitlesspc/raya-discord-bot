import prisma from '$services/prisma';
import command from '$services/command';
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
        desc: 'Googas',
        optional: true
      }
    }
  },
  async (i, { type, googas }) => {
    if (googas)
      return i.reply(
        `${process.env.FILES_ORIGIN}/discord/googas.mp4 ${process.env.FILES_ORIGIN}/discord/gradi.png`
      );

    const file = await getRandomFile(type);
    if (!file) return i.reply('No file found');
    const { name, extension } = file;

    const fileName = `${name}.${extension}`;
    return sendFile(i, fileName);
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
      name: true,
      extension: true
    },
    where,
    skip
  });
  return file;
}
