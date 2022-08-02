import { AttachmentBuilder } from 'discord.js';
import command from '@limitlesspc/limitless/discord/command';
import type { Chicken } from '@prisma/client';

import prisma from '$services/prisma';

const stickenFileName = 'stick.png';

export default command(
  {
    desc: 'Chicken!',
    options: {
      sticken: {
        desc: 'Sticken!',
        type: 'bool',
        optional: true
      }
    }
  },
  async (i, { sticken }) => {
    await i.deferReply();
    let name: string;
    if (sticken) name = stickenFileName;
    else {
      const [chicken]: [Chicken] = await prisma.$queryRaw`SELECT name
      FROM "Chicken"
      ORDER BY random()
      LIMIT 1;`;
      name = chicken.name;
    }
    const url = `https://${process.env.FILES_DOMAIN}/chicken/${name}`;
    if (name.endsWith('.mp3'))
      return i.editReply({
        content: null,
        files: [new AttachmentBuilder(url)]
      });
    return i.editReply(url);
  }
);
