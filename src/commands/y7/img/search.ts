import prisma from '$services/prisma';
import command from '$services/command';

export default command(
  {
    desc: 'Search for an image from yyyyyyy.info',
    options: {
      file_name: {
        type: 'string',
        desc: 'The file name to search for',
        autocomplete: async search => {
          const images = await prisma.y7File.findMany({
            select: {
              name: true
            },
            where: {
              name: {
                search
              },
              extension: {
                not: 'gif'
              }
            },
            orderBy: {
              name: 'asc'
            },
            take: 5
          });
          return images.map(({ name }) => name);
        }
      }
    }
  },
  (i, { file_name }) => {
    const url = `${process.env.FILES_DOMAIN}/y7/images/${file_name}`;
    return i.reply(url);
  }
);
