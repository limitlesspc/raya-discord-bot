import { EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import command from '@limitlesspc/limitless/discord/command';

type Response = {
  breeds: string[];
  id: string;
  url: string;
  width: number;
  height: number;
}[];

export default command(
  {
    desc: 'Sends a random cat',
    options: {}
  },
  async i => {
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = (await response.json()) as Response;
    const [cat] = data;
    if (!cat) throw new Error('No cat found');

    const embed = new EmbedBuilder()
      .setTitle('Cat')
      .setColor('#D24515')
      .setImage(cat.url)
      .setFooter({
        text: 'Powered by The Cat API',
        iconURL: 'https://thecatapi.com/favicon.ico'
      });
    return i.reply({ embeds: [embed] });
  }
);
