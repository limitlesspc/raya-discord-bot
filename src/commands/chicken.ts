import command from '$services/command';
import prisma from '$services/prisma';

const stickenFileName = 'stick.png';

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
  async (i, { sticken }) => {
    let fileName: string;
    if (sticken) fileName = stickenFileName;
    else {
      const count = await prisma.chicken.count();
      const skip = Math.floor(Math.random() * count);
      const chicken = await prisma.chicken.findFirstOrThrow({ skip });
      fileName = chicken.fileName;
    }
    return i.reply(`${process.env.FILES_ORIGIN}/chicken/${fileName}`);
  }
);
