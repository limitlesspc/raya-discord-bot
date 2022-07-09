import { searchVideos } from '$services/youtube';
import command from '$services/command';
import { createEmbed } from '../embed';

export default command(
  {
    desc: 'Search for YouTube videos',
    options: {
      query: {
        desc: 'The search query to find videos',
        type: 'string'
      },
      limit: {
        desc: 'The maximum number of videos to return',
        type: 'int',
        min: 1,
        max: 10,
        optional: true
      }
    }
  },
  async (i, { query, limit }) => {
    try {
      const videos = await searchVideos(query, limit);

      const embed = createEmbed()
        .setTitle(`Search results for "${query}"`)
        .setURL(
          `https://www.youtube.com/results?search_query=${query
            .split(' ')
            .join('+')}`
        )
        .addFields(
          ...videos.map(({ id, title }, i) => ({
            name: `${i + 1}. ${title}`,
            value: `https://youtu.be/${id}`
          }))
        );

      return await i.reply({
        embeds: [embed]
      });
    } catch (error) {
      console.error(error);
      return i.reply({
        content: 'Failed to search for YouTube videos',
        ephemeral: true
      });
    }
  }
);
