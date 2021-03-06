import command from '@limitlesspc/limitless/discord/command';
import type { SpeechBubble } from '@prisma/client';

import prisma from '$services/prisma';

export default command(
  {
    desc: 'Sends a speech bubble',
    options: {}
  },
  async i => {
    const [{ name }] = await prisma.$queryRaw<[SpeechBubble]>`SELECT name
    FROM SpeechBubble
    ORDER BY RAND()
    LIMIT 1;`;
    return i.reply(
      `https://${process.env.FILES_DOMAIN}/speech-bubbles/${name}`
    );
  }
);
