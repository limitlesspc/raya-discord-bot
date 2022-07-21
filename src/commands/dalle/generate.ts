import command from '$services/command';
import { generate } from '$services/dalle';
import prisma from '$services/prisma';

export default command(
  {
    desc: 'For now, just returns the number of free credits left',
    options: {
      prompt: {
        type: 'string',
        desc: 'Prompt to generate'
      }
    }
  },
  async (i, { prompt }) => {
    await i.deferReply();
    const user = await prisma.user.findUnique({
      select: {
        lastDalleAt: true
      },
      where: {
        id: i.user.id
      }
    });
    if (user?.lastDalleAt) {
      const now = new Date().getTime();
      const diff = now - user.lastDalleAt.getTime();
      if (diff < 1000 * 60 * 60 * 24)
        return i.editReply('You can only generate new images every 24 hours');
    }
    const task = await generate(prompt);
    if (task.error)
      return i.editReply(
        `Error \`${task.error}\`: your prompt doesn't follow the content policy`
      );
    await prisma.user.upsert({
      create: {
        id: i.user.id,
        lastDalleAt: new Date()
      },
      update: {
        lastDalleAt: new Date()
      },
      where: {
        id: i.user.id
      }
    });
    return i.editReply(task.urls.join(' '));
  }
);
