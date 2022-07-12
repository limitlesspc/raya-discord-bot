import {
  categories,
  contentWarnings,
  query,
  ratings,
  User,
  Work
} from '$services/ao3';
import { createEmbed } from '../embed';

export function createWorkEmbed(
  {
    id,
    title,
    author,
    rating,
    warnings,
    categories: workCategories,
    relationships,
    characters,
    tags,
    language,
    series,
    stats: { published, updated, words, chapters, kudos, bookmarks, hits },
    symbols
  }: Work,
  { url: authorURL, iconURL }: User
) {
  const embed = createEmbed()
    .setTitle(title)
    .setAuthor({ name: author, url: authorURL, iconURL })
    .setURL(`${query}${id}`)
    .setThumbnail(
      `${process.env.FILES_ORIGIN}/ao3/squares/${symbols.rating}_${symbols.category}_${symbols.warning}_${symbols.complete}.png`
    );
  if (rating) embed.addField('Rating', ratings[rating]);
  if (warnings.length)
    embed.addField(
      'Warnings',
      warnings.map(warning => contentWarnings[warning]).join(', ')
    );
  if (workCategories.length)
    embed.addField(
      'Categories',
      workCategories.map(category => categories[category]).join(', ')
    );
  if (relationships.length)
    embed.addField('Relationships', relationships.join(', '));
  if (characters.length) embed.addField('Characters', characters.join(', '));
  if (tags.length) embed.addField('Tags', tags.join(', '));
  embed.addField('Language', language);
  if (series)
    embed.addField(
      'Series',
      `[${series.title}](https://archiveofourown.org/series/${series.id})`
    );

  embed.addField(
    'Stats:',
    `* Published: ${published.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })}${
      updated
        ? `
* Updated: ${updated.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })}`
        : ''
    }
* Words: ${words}
* Chapters: ${chapters[0]}/${chapters[1] || '?'}
* Kudos: ${kudos}
* Bookmarks: ${bookmarks}
* Hits: ${hits}`
  );
  return embed;
}
