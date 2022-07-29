import { join } from 'node:path';
import { AttachmentBuilder } from 'discord.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import glsl from 'glslify';
import command from '@limitlesspc/limitless/discord/command';

import GL from '$services/gl';

const size = 512;
const scale = 100;
const frames = 24;

export default command(
  {
    desc: 'Generates a image with Perlin noise',
    options: {
      gif: {
        type: 'bool',
        desc: 'Whether to generate a gif instead of a png',
        default: false
      }
    }
  },
  async (i, { gif }) => {
    await i.deferReply();

    const gl = await GL.screen(
      size,
      size,
      glsl(await GL.loadFile(join(__dirname, './shader.frag')))
    );
    gl.uniform('scale', 'float', scale);

    let offset = Math.random() * 1000;
    let attachment: AttachmentBuilder;
    if (gif) {
      attachment = new AttachmentBuilder(
        await gl.gifBuffer(frames, {
          fps: 10,
          prerender: () => {
            offset += 3;
            gl.uniform('offset', 'float', offset);
          }
        }),
        { name: 'noise.gif' }
      );
    } else {
      gl.uniform('offset', 'float', offset);
      gl.render();
      attachment = new AttachmentBuilder(gl.pngBuffer(), { name: 'noise.png' });
    }

    return i.editReply({
      content: null,
      files: [attachment]
    });
  }
);
