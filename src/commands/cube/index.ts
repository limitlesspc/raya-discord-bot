import { join } from 'node:path';
import { AttachmentBuilder } from 'discord.js';
import { mat4 } from 'gl-matrix';
import command from '@limitlesspc/limitless/discord/command';

import GL from '$services/gl';

const size = 512;
const frames = 20;

export default command(
  {
    desc: 'Makes your profile or attachment spin on a cube',
    options: {
      image: {
        type: 'attachment',
        desc: 'The image to pixel sort',
        optional: true
      }
    }
  },
  async (i, { image }) => {
    await i.deferReply();
    const url =
      image?.url || i.user.displayAvatarURL({ extension: 'png', size: 512 });

    const gl = new GL(size, size, true);
    await gl.createProgramFromPaths(
      join(__dirname, './shader.vert'),
      join(__dirname, './shader.frag')
    );

    gl.createVertexBuffer(GL.unitCubeTextured.vertexData);
    gl.createIndexBuffer(GL.unitCubeTextured.indexData);
    gl.attributes([
      { name: 'position', type: 'vec3' },
      { name: 'uv', type: 'vec2' }
    ]);

    await gl.createTexture(url, { isGif: image?.contentType === 'image/gif' });

    const projectionMatrix = mat4.perspective(
      mat4.create(),
      Math.PI / 3,
      1,
      0.1,
      1000
    );
    gl.uniform('projectionMatrix', 'mat4', projectionMatrix);
    const modelViewMatrix = mat4.create();

    let angle = 0;

    const attachment = new AttachmentBuilder(
      await gl.mp4Stream(frames, join(__dirname, './cube.mp3'), {
        fps: 10,
        prerender: () => {
          gl.background(0, 0, 0, 1);

          mat4.identity(modelViewMatrix);
          mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5]);
          mat4.rotateX(modelViewMatrix, modelViewMatrix, angle);
          mat4.rotateY(modelViewMatrix, modelViewMatrix, angle);
          mat4.rotateZ(modelViewMatrix, modelViewMatrix, angle);
          gl.uniform('modelViewMatrix', 'mat4', modelViewMatrix);

          angle += (Math.PI * 2) / frames;
        }
      }),
      { name: 'cube.mp4' }
    );

    await i.editReply({
      content: null,
      files: [attachment]
    });
  }
);
