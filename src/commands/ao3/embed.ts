import { MessageEmbed } from 'discord.js';

export const createEmbed = () =>
  new MessageEmbed()
    .setColor('#990000')
    .setFooter({
      text: 'Archive of Our Own',
      iconURL:
        'https://upload.wikimedia.org/wikipedia/commons/8/88/Archive_of_Our_Own_logo.png'
    });
