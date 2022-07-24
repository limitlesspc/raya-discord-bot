import { EmbedBuilder } from 'discord.js';
import command from 'limitless/discord/command';

export default command(
  {
    desc: "Gets your, a user's, profile picture",
    options: {
      user: {
        type: 'user',
        desc: 'The user to get the profile picture of',
        optional: true
      }
    }
  },
  (i, { user = i.user }) => {
    const avatar = user.avatarURL({ dynamic: true, size: 1024 });
    if (!avatar) return i.reply('No profile picture found');

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s profile picture`)
      .setImage(avatar);
    return i.reply({ embeds: [embed] });
  }
);
