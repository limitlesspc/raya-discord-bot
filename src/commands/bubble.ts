import command from '$services/command';
import prisma from '$services/prisma';

export default command(
  {
    desc: 'Sends a speech bubble',
    options: {}
  },
  async i => {
    const count = await prisma.speechBubble.count();
    const skip = Math.floor(Math.random() * count);
    const { name } = await prisma.speechBubble.findFirstOrThrow({ skip });
    return i.reply(`${process.env.FILES_ORIGIN}/speech-bubbles/${name}`);
  }
);
