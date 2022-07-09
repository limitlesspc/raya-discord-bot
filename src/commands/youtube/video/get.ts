import { formatDuration, getVideo } from '$services/youtube';
import command from '$services/command';
import { createEmbed } from '../embed';

export default command(
  {
    desc: 'Get information a YouTube video',
    options: {
      url: {
        desc: 'The URL of the video',
        type: 'string'
      }
    }
  },
  async (i, { url }) => {
    try {
      const {
        title,
        channel,
        thumbnail,
        description,
        duration,
        views,
        likes,
        comments,
        tags,
        uploadedAt
      } = await getVideo(url);

      const embed = createEmbed()
        .setTitle(title)
        .setAuthor({
          name: channel.title,
          url: `https://www.youtube.com/channel/${channel.id}`
        })
        .setURL(url)
        .setThumbnail(thumbnail.url)
        .setTimestamp(uploadedAt)
        .addFields(
          {
            name: 'Duration',
            value: formatDuration(duration),
            inline: true
          },
          {
            name: 'Views',
            value: views.toLocaleString(),
            inline: true
          },
          {
            name: 'Likes',
            value: likes.toLocaleString(),
            inline: true
          },
          {
            name: 'Comments',
            value: comments.toLocaleString(),
            inline: true
          }
        );

      const maxDesc = 1024;
      if (description)
        embed.setDescription(
          description.length < maxDesc
            ? description
            : `${description.slice(0, maxDesc - 3)}...`
        );
      if (tags.length) embed.addField('Tags', tags.join(', '));

      return await i.reply({
        embeds: [embed]
      });
    } catch (error) {
      console.error(error);
      return i.reply({
        content: 'Failed to get YouTube video',
        ephemeral: true
      });
    }
  }
);
