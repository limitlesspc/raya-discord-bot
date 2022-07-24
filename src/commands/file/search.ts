import prisma from '$services/prisma';
import command from 'limitless/discord/command';
import { sendFile } from './shared';

export default command(
  {
    desc: 'Search for an file from files.in5net.io/discord',
    options: {
      file_name: {
        type: 'string',
        desc: 'The file name to search for',
        autocomplete: async search => {
          const files = await prisma.file.findMany({
            select: {
              name: true
            },
            where: {
              name: {
                search
              }
            },
            orderBy: {
              name: 'asc'
            },
            take: 5
          });
          return files.map(({ name }) => name);
        }
      }
    }
  },
  (i, { file_name }) => sendFile(i, file_name)
);
