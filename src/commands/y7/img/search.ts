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
          const images = await prisma.y7Image.findMany({
            select: {
              fileName: true
            },
            where: {
              fileName: {
                search
              }
            },
            orderBy: {
              fileName: 'asc'
            },
            take: 5
          });
          return images
            .map(({ fileName }) => fileName)
            .filter(fileName => fileName.length <= 100);
        }
      }
    }
  },
  (i, { file_name }) => {
    const url = `${process.env.FILES_ORIGIN}/y7/images/${file_name}`;
    return i.reply(url);
  }
);
