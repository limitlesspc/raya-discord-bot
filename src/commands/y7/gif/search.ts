import prisma from '$services/prisma';
import command from '$services/command';
import { NSFW_FILE_NAME } from './shared';

export default command(
  {
    desc: 'Search for an image from yyyyyyy.info',
    options: {
      file_name: {
        type: 'string',
        desc: 'The file name to search for',
        autocomplete: async query => {
          const gifs = await prisma.y7GIF.findMany({
            select: {
              fileName: true
            },
            where: {
              fileName: {
                contains: query,
                mode: 'insensitive',
                not: NSFW_FILE_NAME
              }
            },
            orderBy: {
              fileName: 'asc'
            },
            take: 5
          });
          return gifs
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
