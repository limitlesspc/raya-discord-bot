import command from '$services/command';
import { generate } from '$services/dalle';
import prisma from '$services/prisma';
import { getLastUsedAt, WAIT_MILLIS } from './shared';

export default command(
  {
    desc: `Create 4 images from a prompt using OpenAI's DALL·E 2`,
    options: {
      prompt: {
        type: 'string',
        desc: 'Prompt to generate'
      }
    }
  },
  async (i, { prompt }) => {
    await i.deferReply();
    const lastDalleAt = await getLastUsedAt(i.user.id);
    if (lastDalleAt) {
      const now = new Date().getTime();
      const diff = now - lastDalleAt.getTime();
      if (diff < WAIT_MILLIS)
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
    await i.editReply(task.urls.join(' '));
    return i.followUp(prompt);
  }
);
