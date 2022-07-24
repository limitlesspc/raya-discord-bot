import { AttachmentBuilder } from 'discord.js';
import { createCanvas } from '@napi-rs/canvas';
import command from 'limitless/discord/command';

const size = 128;

export default command(
  {
    desc: 'Generates a (literally) random image',
    options: {}
  },
  async i => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const image = ctx.createImageData(size, size);
    image.data.set(
      new Uint8ClampedArray(size * size * 4).map(() =>
        Math.floor(Math.random() * 256)
      )
    );
    ctx.putImageData(image, 0, 0);

    console.log('Done');
    return i.reply({
      files: [new AttachmentBuilder(canvas.toBuffer('image/png'))]
    });
  }
);
