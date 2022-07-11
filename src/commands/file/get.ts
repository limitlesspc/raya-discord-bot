import { MessageAttachment } from 'discord.js';

import prisma from '$services/prisma';
import command from '$services/command';

const types = ['image', 'video', 'audio'] as const;
type Type = typeof types[number];
const extensions: Record<Type, string[]> = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  video: ['mp4', 'mov', 'mkv', 'webm'],
  audio: ['mp3', 'wav', 'ogg']
};

export default command(
  {
    desc: 'Get a random file from files.in5net.io/discord (mostly from #general)',
    options: {
      type: {
        type: 'choice',
        desc: 'Type of file to get',
        choices: types,
        optional: true
      }
    }
  },
  async (i, { type }) => {
    const file = await getRandomFile(type);
    if (!file) return i.reply('No file found');
    const { name, extension } = file;

    const fileName = `${name}.${extension}`;
    const url = `${process.env.FILES_ORIGIN}/discord/${fileName}`;
    if (['mp3', 'wav', 'ogg'].includes(extension))
      return i.reply({
        content: null,
        files: [new MessageAttachment(url, fileName)]
      });
    return i.reply(url);
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
