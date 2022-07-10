import prisma from '$services/prisma';
import command from '$services/command';

export default command(
  {
    desc: 'Search for an image from files.in5net.io',
    options: {
      file_name: {
        type: 'string',
        desc: 'The file name to search for',
        autocomplete: async query => {
          const images = await prisma.image.findMany({
            select: {
              fileName: true
            },
            where: {
              fileName: {
                contains: query,
                mode: 'insensitive'
              }
            },
            orderBy: {
              fileName: 'asc'
            },
            take: 5
          });
          return images?.map(({ fileName }) => fileName);
        }
      }
    }
  },
  (i, { file_name }) => {
    const url = `${process.env.FILES_ORIGIN}/images/${file_name}`;
    return i.reply(url);
  }
);
