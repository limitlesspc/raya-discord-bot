import { shuffle } from '@limitlesspc/limitless';

import prisma from '$services/prisma';
import { incCount } from '$services/users';
import command from '$services/command';

const NUM_RATIOS = 50;

export default command(
  {
    desc: 'Get ratioed',
    options: {}
  },
  async i => {
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
    return i.reply(
      texts.join(' + ') ||
        'Looks like there are no ratios, use `/ratio add` to add some'
    );
  }
);
