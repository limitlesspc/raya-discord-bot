import { shuffle } from '@limitlesspc/limitless';
import command from '@limitlesspc/limitless/discord/command';

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
    const count = await prisma.ratio.count();
    const skip = Math.floor(Math.random() * Math.max(count - NUM_RATIOS, 0));
    const ratios = await prisma.ratio.findMany({
      select: {
        content: true
      },
      skip
    });
    const texts = shuffle(ratios.map(({ content }) => content));
    await incCount(i.user.id, 'ratio');
    return i.editReply(
      texts.join(' + ') ||
        'Looks like there are no ratios, use `/ratio add` to add some'
    );
  }
);
