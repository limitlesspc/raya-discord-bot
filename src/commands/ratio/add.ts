import prisma from '$services/prisma';
import command from 'limitless/discord/command';

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
    const ratioStrs = ratios
      .split('+')
      .map(s => s.trim())
      .filter(Boolean);
    await prisma.ratio.createMany({
      data: ratioStrs.map(s => ({ content: s })),
      skipDuplicates: true
    });
    return i.reply('Added to ratios');
  }
);
