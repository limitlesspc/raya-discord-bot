import { MessageEmbed } from 'discord.js';
import { fetch } from 'undici';

import { incCount } from '$services/users';
import command from '$services/command';

const CATEGORIES = [
  'baka',
  'blush',
  'bored',
  'cry',
  'cuddle',
  'dance',
  'happy',
  'highfive',
  'hug',
  'kiss',
  'laugh',
  'neko',
  'pat',
  'pout',
  'sleep',
  'smile',
  'smug',
  'think',
  'thumbsup',
  'tickle',
  'wave',
  'wink',
  'waifu',
  'handhold',
  'shoot'
] as const;

interface Response {
  results: [
    {
      artist_href?: string;
      artist_name?: string;
      source_url?: string;
      anime_name?: string;
      url: string;
    }
  ];
}

export default command(
  {
    desc: 'Sends a random nekos.best image',
    options: {
      category: {
        type: 'choice',
        desc: 'Category in which the image will be in',
        choices: CATEGORIES,
        default: 'neko'
      }
    }
  },
  async (i, { category }) => {
    const response = await fetch(`https://nekos.best/api/v2/${category}`);
    const data = (await response.json()) as Response;
    const result = data.results[0];

    const {
      url,
      artist_name = 'Unknown',
      artist_href,
      source_url,
      anime_name
    } = result;
    const embed = new MessageEmbed()
      .setImage(url)
      .setAuthor({ name: artist_name, url: artist_href })
      .setFooter({
        text: 'Powered by nekos.best',
        iconURL: 'https://nekos.best/favicon.png'
      });
    if (source_url) embed.setURL(source_url);
    if (anime_name) embed.setTitle(anime_name);

    await i.reply({ embeds: [embed] });
    return incCount(i.user.id, 'weeb');
  }
);
