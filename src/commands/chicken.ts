import { random } from '@limitlesspc/limitless';

import command from '$services/command';

const fileNames = ['explode.mp4', 'stick.png'];

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
