import prisma from '$services/prisma';
import command from '$services/command';
import { sendFile } from './shared';

export default command(
  {
    desc: 'Search for an file from files.in5net.io/discord',
    options: {
      file_name: {
        type: 'string',
        desc: 'The file name to search for',
        autocomplete: async query => {
          const files = await prisma.file.findMany({
            select: {
              name: true,
              extension: true
            },
            where: {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            },
            orderBy: {
              name: 'asc'
            },
            take: 5
          });
          return files
            ?.map(({ name, extension }) => `${name}.${extension}`)
            .filter(fileName => fileName.length <= 100);
        }
      }
    }
  },
  (i, { file_name }) => sendFile(i, file_name)
);
