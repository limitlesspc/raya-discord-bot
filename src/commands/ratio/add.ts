import command from '@limitlesspc/limitless/discord/command';

import prisma from '$services/prisma';

export default command(
  {
    desc: 'Adds some ratios to the list',
    options: {
      ratios: {
        type: 'string',
        desc: "The ratios to add ('+' separated)"
      }
    }
  },
  async (i, { ratios }) => {
    await i.deferReply();
    const ratioStrs = ratios
      .split('+')
      .map(s => s.trim())
      .filter(Boolean);
    await prisma.ratio.createMany({
      data: ratioStrs.map(s => ({ content: s })),
      skipDuplicates: true
    });
    return i.editReply('Added to ratios');
  }
);
