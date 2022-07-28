import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';
import command from '@limitlesspc/limitless/discord/command';

import ImageSearch from '$services/customsearch';
import { COLOR } from '$services/env';

export default command(
  {
    desc: 'Google search for an image',
    options: {
      query: {
        type: 'string',
        desc: 'The image query'
      }
    }
  },
  async (i, { query }) => {
    await i.deferReply();
    const search = new ImageSearch(query);

    const embed = new EmbedBuilder()
      .setDescription(query)
      .setColor(COLOR)
      .setImage(await search.next());
    const prevButton = new ButtonBuilder()
      .setCustomId('prev')
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled();
    const nextButton = new ButtonBuilder()
      .setCustomId('next')
      .setEmoji('➡️')
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(prevButton, nextButton);
    await i
      .editReply({
        embeds: [embed],
        components: [row]
      })
      .catch(() => null);

    i.channel
      ?.createMessageComponentCollector({
        filter: int => int.user.id === i.user.id,
        time: 60_000
      })
      .on('collect', async i => {
        try {
          embed.setImage(
            i.customId === 'prev' ? await search.prev() : await search.next()
          );
          prevButton?.setDisabled(!search.hasPrev());
          await i.update({
            embeds: [embed],
            components: [row]
          });
        } catch {
          await i.editReply('Some error occurred...imagine').catch(() => null);
        }
      })
      .once('end', async () => {
        await i.followUp('Ran out of time ⏱');
      });
  }
);
