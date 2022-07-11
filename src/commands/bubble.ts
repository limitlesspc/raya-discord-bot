import { random } from '@limitlesspc/limitless';

import command from '$services/command';

const fileNames = [
  'azzy.png',
  'bee.gif',
  'cabinet.gif',
  'cate.gif',
  'chug.gif',
  'dumb-regular-show.gif',
  'eeto.gif',
  'hehe-neko.gif',
  'hog-rider.gif',
  'lobber.gif',
  'metal-gear-big-boss.gif',
  'nya.png',
  'peak-trans.gif',
  'spy-cat.gif',
  'zzz.gif'
];

export default command(
  {
    desc: 'Sends a speech bubble',
    options: {}
  },
  i =>
    i.reply(`${process.env.FILES_ORIGIN}/speech-bubbles/${random(fileNames)}`)
);
