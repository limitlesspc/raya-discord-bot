import { random } from '@limitlesspc/limitless';

import command from '$services/command';

const stickenFileName = 'stick.png';
const fileNames = [stickenFileName, 'explode.mp4', 'ballin.mp4'];

export default command(
  {
    desc: 'Chicken!',
    options: {
      sticken: {
        desc: 'Sticken!',
        type: 'bool',
        optional: true
      }
    }
  },
  i => i.reply(`${process.env.FILES_ORIGIN}/chicken/${random(fileNames)}`)
);
