import { getUser, getWork, getWorkId } from '$services/ao3';
import command from '$services/command';
import { createWorkEmbed } from './shared';

export default command(
  {
    desc: 'Get information on a work from Archive of Our Own',
    options: {
      url: {
        desc: 'The URL of the work',
        type: 'string'
      }
    }
  },
  async (i, { url }) => {
    try {
      const id = getWorkId(url);
      const work = await getWork(id);
      const author = await getUser(work.author);

      const embed = createWorkEmbed(work, author);
      return await i.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      return i.reply({ content: 'Invalid AO3 url', ephemeral: true });
    }
  }
);
