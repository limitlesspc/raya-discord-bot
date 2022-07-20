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
    let name: string;
    if (sticken) name = stickenFileName;
    else {
      const count = await prisma.chicken.count();
      console.log(count);
      const skip = Math.floor(Math.random() * count);
      console.log(skip);
      const chicken = await prisma.chicken.findFirstOrThrow({ skip });
      name = chicken.name;
    }
    return i.reply(`${process.env.FILES_ORIGIN}/chicken/${name}`);
  }
);
