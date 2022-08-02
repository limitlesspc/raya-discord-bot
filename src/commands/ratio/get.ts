import { shuffle } from '@limitlesspc/limitless';
import command from '@limitlesspc/limitless/discord/command';
import type { Ratio } from '@prisma/client';

import prisma from '$services/prisma';
import { incCount } from '$services/users';

const NUM_RATIOS = 50;

export default command(
  {
    desc: 'Get ratioed',
    options: {}
  },
  async i => {
    await i.deferReply();
    const ratios: Ratio[] = await prisma.$queryRaw`SELECT content
    FROM "Ratio"
    ORDER BY random()
    LIMIT ${NUM_RATIOS}`;
    const texts = shuffle(ratios.map(({ content }) => content));
    await incCount(i.user.id, 'ratio');
    return i.editReply(
      texts.join(' + ') ||
        'Looks like there are no ratios, use `/ratio add` to add some'
    );
  }
);
