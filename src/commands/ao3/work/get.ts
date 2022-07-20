import { getUser, getWork, getWorkId } from '$services/ao3';
import command from '$services/command';
import { createWorkEmbedBuilder } from './embed';

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
    const id = getWorkId(url);
    const work = await getWork(id);
    const author = await getUser(work.author);

    const embed = createWorkEmbedBuilder(work, author);
    return i.reply({ embeds: [embed], ephemeral: true });
  }
);
