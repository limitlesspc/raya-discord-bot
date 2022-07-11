import { MessageEmbed } from 'discord.js';
import { fetchRandom } from 'nekos-best.js';

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

export default command(
  {
    desc: 'Sends a random nekos.best image',
    options: {
      category: {
        type: 'choice',
        desc: 'Category in which the image will be in',
        choices: CATEGORIES,
        optional: true
      }
    }
  },
  async (i, { category }) => {
    const {
      results: [result]
    } = await fetchRandom(category);
    if (!result) return i.reply('No 猫 found');

    const { url, artist_name, artist_href, source_url, anime_name } = result;
    const embed = new MessageEmbed().setImage(url).setFooter({
      text: 'Powered by nekos.best',
      iconURL: 'https://nekos.best/favicon.png'
    });
    if (artist_name) embed.setAuthor({ name: artist_name, url: artist_href });
    if (source_url) embed.setURL(source_url);
    if (anime_name) embed.setTitle(anime_name);

    await i.reply({ embeds: [embed] });
    return incCount(i.user.id, 'weeb');
  }
);
