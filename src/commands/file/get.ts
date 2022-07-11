import { MessageAttachment } from 'discord.js';

import prisma from '$services/prisma';
import command from '$services/command';

const extensions = {
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
        choices: ['image', 'video', 'audio'] as const,
        optional: true
      }
    }
  },
  async (i, { type }) => {
    const count = await prisma.file.count();
    const skip = Math.floor(Math.random() * count);
    const file = await prisma.file.findFirst({
      select: {
        name: true,
        extension: true
      },
      where: type
        ? {
            extension: {
              in: extensions[type]
            }
          }
        : undefined,
      skip
    });
    if (!file) return i.reply('No file found');
    const { name, extension } = file;

    const fileName = `${name}.${extension}`;
    const url = `${process.env.FILES_ORIGIN}/discord/${fileName}`;
    if (['mp3', 'wav', 'ogg'].includes(extension))
      return i.reply({
        attachments: [new MessageAttachment(url, fileName)]
      });
    return i.reply(url);
  }
);
