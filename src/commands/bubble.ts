import command from '@limitlesspc/limitless/discord/command';
import type { SpeechBubble } from '@prisma/client';

import prisma from '$services/prisma';

export default command(
  {
    desc: 'Sends a speech bubble',
    options: {}
  },
  async i => {
    const [{ name }]: [SpeechBubble] = await prisma.$queryRaw`SELECT name
    FROM "SpeechBubble"
    ORDER BY random()
    LIMIT 1;`;
    return i.reply(
      `https://${process.env.FILES_DOMAIN}/speech-bubbles/${name}`
    );
  }
);
