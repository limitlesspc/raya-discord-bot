import fetch from 'node-fetch';
import command from '@limitlesspc/limitless/discord/command';

import { variations } from '$services/dalle';
import prisma from '$services/prisma';
import { filesBucket } from '$services/storage';
import { getLastUsedAt, WAIT_MILLIS } from './shared';

export default command(
  {
    desc: `Create 3 images based on an input image using OpenAI's DALL·E 2`,
    options: {
      image: {
        type: 'attachment',
        desc: 'Image to generate variations from'
      }
    }
  },
  async (i, { image }) => {
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

    if (!image.width || !image.height || image.width !== image.height)
      return i.editReply('Image must be square');

    const task = await variations(image.url);
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
    for (const { id, url } of [image, ...task.files]) {
      const response = await fetch(url);
      const path = `dalle/${id}.webp`;
      const stream = filesBucket.file(path).createWriteStream({
        gzip: true,
        metadata: {
          metadata: {
            uid: i.user.id,
            ...(url !== image.url
              ? { variationFrom: image.url }
              : { original: 'true' })
          }
        }
      });
      if (!response.body) return i.editReply('Error: no response body');
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

    const [original, ...variationURLs] = urls;
    return i.editReply(`Original: ${original}

Variations: ${variationURLs.join(' ')}`);
  }
);
