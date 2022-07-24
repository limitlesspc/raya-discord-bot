import { EmbedBuilder } from 'discord.js';

import { getUser } from '$services/users';
import command from 'limitless/discord/command';

export default command(
  {
    desc: 'Displays the number of times a user has used certain commands',
    options: {
      user: {
        type: 'user',
        desc: 'The user to view the counts for',
        optional: true
      }
    }
  },
  async (i, { user = i.user }) => {
    const data = await getUser(user.id);
    const embed = new EmbedBuilder().setTitle(`${user.username}'s counts`);
    if (data?.counts)
      embed.addFields(
        ...Object.entries(data.counts).map(([name, count]) => ({
          name,
          value: count.toString()
        }))
      );
    else embed.setDescription('No counts found');
    return i.reply({ embeds: [embed] });
  }
);
