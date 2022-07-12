import {
  getUser,
  searchCharacters,
  searchFandoms,
  searchRelationships,
  searchTags
} from '$services/ao3';
import {
  Category,
  OrderBy,
  Rating,
  searchWorks,
  Warning
} from '$services/ao3/work/search';
import command from '$services/command';
import { createWorkEmbed } from './shared';

export default command(
  {
    desc: 'Get information on a work from Archive of Our Own',
    options: {
      fandom: {
        type: 'string',
        desc: 'Fandom name to search for',
        optional: true,
        async autocomplete(query) {
          const fandoms = await searchFandoms(query);
          return fandoms.map(({ id }) => id);
        }
      },
      rating: {
        type: 'choice',
        desc: 'Rating to search for',
        choices: Rating,
        optional: true
      },
      warning: {
        type: 'choice',
        desc: 'Warning tag to search for',
        choices: Warning,
        optional: true
      },
      category: {
        type: 'choice',
        desc: 'Category name to search for',
        choices: Category,
        optional: true
      },
      relationship: {
        type: 'string',
        desc: 'Relationship to search for',
        optional: true,
        async autocomplete(query) {
          const relationships = await searchRelationships(query);
          return relationships
            .map(({ id }) => id)
            .filter(id => id.length <= 100);
        }
      },
      character: {
        type: 'string',
        desc: 'Character to search for',
        optional: true,
        async autocomplete(query) {
          const characters = await searchCharacters(query);
          return characters.map(({ id }) => id).filter(id => id.length <= 100);
        }
      },
      tag: {
        type: 'string',
        desc: 'Tag to search for',
        optional: true,
        async autocomplete(query) {
          const tags = await searchTags(query);
          return tags.map(({ id }) => id).filter(id => id.length <= 100);
        }
      },
      order_by: {
        type: 'choice',
        desc: 'Order the search by a field',
        choices: OrderBy,
        optional: true
      },
      order: {
        type: 'choice',
        desc: 'Order the search by a direction',
        choices: ['asc', 'desc'] as const,
        optional: true
      }
    }
  },
  async (
    i,
    {
      fandom,
      rating,
      warning,
      category,
      relationship,
      character,
      tag,
      order_by,
      order
    }
  ) => {
    try {
      const works = await searchWorks({
        fandoms: fandom ? [fandom] : undefined,
        rating,
        warnings: warning ? [warning] : undefined,
        categories: category ? [category] : undefined,
        relationships: relationship ? [relationship] : undefined,
        characters: character ? [character] : undefined,
        tags: tag ? [tag] : undefined,
        orderBy: order_by,
        order
      });

      const embeds = await Promise.all(
        works.map(async work => {
          const author = await getUser(work.author);
          return createWorkEmbed(work, author);
        })
      );

      return await i.reply({ embeds, ephemeral: true });
    } catch (error) {
      console.error(error);
      return i.reply({ content: 'Invalid AO3 url', ephemeral: true });
    }
  }
);
