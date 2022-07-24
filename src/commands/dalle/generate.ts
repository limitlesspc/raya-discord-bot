import fetch from 'cross-fetch';
import command from '$services/command';
import { generate } from '$services/dalle';
import prisma from '$services/prisma';
import { filesBucket } from '$services/storage';
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
    if (i.user.bot) return i.reply('Bots cannot use DALL·E 2');
    await i.deferReply();

    if (i.user.id !== process.env.OWNER_ID) {
      const lastDalleAt = await getLastUsedAt(i.user.id);
      if (lastDalleAt) {
        const now = new Date().getTime();
        const diff = now - lastDalleAt.getTime();
        if (diff < WAIT_MILLIS)
          return i.editReply('You can only generate new images every 24 hours');
      }
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
    await i.editReply('Uploading images...');

    const urls: string[] = [];
    for (const { id, url } of task.files) {
      const response = await fetch(url);
      const path = `dalle/${id}.webp`;
      const stream = filesBucket.file(path).createWriteStream({
        gzip: true,
        metadata: {
          metadata: {
            uid: i.user.id,
            prompt
          }
        }
      });
      response.body.pipe(stream);
      const fileURL = await new Promise<string>((resolve, reject) =>
        stream
          .on('finish', () =>
            resolve(`https://${process.env.FILES_DOMAIN}/${path}`)
          )
          .on('error', reject)
      );
      urls.push(fileURL);
      console.log(`Uploaded ${fileURL}`);
    }

    return i.editReply(`${prompt}
${urls.join(' ')}`);
  }
);
