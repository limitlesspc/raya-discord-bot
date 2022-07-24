import { EmbedBuilder } from 'discord.js';
import fetch from 'cross-fetch';
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
    desc: 'Sends a random dog',
    options: {}
  },
  async i => {
    const response = await fetch('https://api.thedogapi.com/v1/images/search');
    const data = (await response.json()) as Response;
    const [dog] = data;
    if (!dog) throw new Error('No dog found');

    const embed = new EmbedBuilder()
      .setTitle('Dog')
      .setColor('#2470D7')
      .setImage(dog.url)
      .setFooter({
        text: 'Powered by The Dog API',
        iconURL: 'https://thedogapi.com/favicon.ico'
      });
    return i.reply({ embeds: [embed] });
  }
);
