import { EmbedBuilder } from 'discord.js';
import fetch from 'cross-fetch';
import command from '@limitlesspc/limitless/discord/command';
import { incCount } from '$services/users';

interface Response {
  url: string;
  artist: string;
  artist_url: string;
  source_url: string;
  error: string;
}

export default command(
  {
    desc: 'Sends a random catboys.com image',
    options: {}
  },
  async i => {
    const response = await fetch('https://api.catboys.com/img');
    const data = (await response.json()) as Response;
    const { url, artist, artist_url, source_url } = data;

    const embed = new EmbedBuilder()
      .setTitle('Catboy')
      .setColor('#6839B6')
      .setImage(url)
      .setFooter({
        text: 'Powered by catboys.com',
        iconURL: 'https://catboys.com/favicon.png'
      });
    if (source_url.startsWith('http')) embed.setURL(source_url);
    if (artist_url.startsWith('http'))
      embed.setAuthor({ name: artist, url: artist_url });

    await i.reply({ embeds: [embed] });
    return incCount(i.user.id, 'weeb');
  }
);
