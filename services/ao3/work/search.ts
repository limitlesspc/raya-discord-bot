import fetch from 'node-fetch';

import ORIGIN from '../origin';
import type languages from './languages.json';

const ENDPOINT = `${ORIGIN}/works/search`;

enum Rating {
  General = '10', // General Audiences
  Teen = '11', // Teen And Up Audiences
  None = '9', // Not Rated
  Mature = '12', // Mature Audiences
  Explicit = '13' // Explicit
}

enum Warning {
  None = '16', // No Archive Warnings Apply
  ChooseNot = '14', // Creator Chose Not To Use Archive Warnings
  Violence = '17', // Graphic Depictions Of Violence
  Death = '18', // Major Character Death
  Underage = '20', // Underage
  Rape = '19' // Rape/Non-Con
}

enum Category {
  General = '21', // Gen
  Straight = '22', // F/M
  Lesbian = '116', // F/F
  Gay = '23', // M/M
  Other = '24', // Other
  Multi = '2246' // Multi
}

enum OrderBy {
  BestMatch = '_score', // Best Match
  Author = 'authors_to_sort_on', // Author
  Title = 'title_to_sort_on', // Title
  CreatedAt = 'created_at', // Date Posted
  UpdatedAt = 'revised_at', // Date Updated
  Words = 'word_count', // Word Count
  Hits = 'hits', // Hits
  Kudos = 'kudos_count', // Kudos
  Comments = 'comments_count', // Comments
  Bookmarks = 'bookmarks_count' // Bookmarks
}

interface Options {
  query?: string;
  title?: string;
  author?: string;
  date?: string;
  complete?: boolean;
  crossovers?: boolean;
  singleChapter?: boolean;
  words?: number | string;
  language?: keyof typeof languages;
  rating?: Rating;
  warnings?: Warning[];
  categories?: Category[];
  characters?: string[];
  relationships?: string[];
  tags?: string[];
  hits?: number | string;
  kudos?: number | string;
  comments?: number | string;
  bookmarks?: number | string;
  orderBy?: OrderBy;
  order?: 'asc' | 'desc';
  page?: number;
}

interface SearchParams {
  // Any Field
  'work_search[query]'?: string;

  // Title
  'work_search[title]'?: string;

  // Author/Artist
  'work_search[creators]'?: string;

  // Date
  'work_search[revised_at]'?: string;

  // Completion Status
  'work_search[complete]':
    | '' // All Works
    | 'T' // Complete works only
    | 'F'; // Works in progress only

  // Crossovers
  'work_search[crossover]':
    | '' // Include Crossovers
    | 'F' // Exclude Crossovers
    | 'T'; // Show only Crossovers

  // Single Chapter
  'work_search[single_chapter]'?: '0' | '1';

  // Word Count
  'work_search[word_count]'?: string;

  // Language
  'work_search[language_id]'?: keyof typeof languages;

  // Fandoms
  'work_search[fandom_names]'?: string; // Comma-separated list

  // Rating
  'include_work_search[rating_ids]'?: Rating;

  // Warnings
  'include_work_search[archive_warning_ids][]'?: Warning;

  // Categories
  'include_work_search[category_ids][]'?: Category;

  // Characters
  'work_search[character_names]'?: string; // Comma-separated list

  // Relationships
  'work_search[relationship_names]'?: string; // Comma-separated list

  // Additional Tags
  'work_search[freeform_names]'?: string; // Comma-separated list

  // Hits
  'work_search[hits]'?: string;

  // Kudos
  'work_search[kudos_count]'?: string;

  // Comments
  'work_search[comments_count]'?: string;

  // Bookmarks
  'work_search[bookmarks_count]'?: string;

  // Sort by
  'work_search[sort_column]': OrderBy;

  // Sort direction
  'work_search[sort_direction]': 'asc' | 'desc';

  page?: string;
}

export async function searchWorks({
  query,
  title,
  author,
  date,
  complete,
  crossovers,
  singleChapter,
  words,
  language,
  rating,
  warnings,
  categories,
  characters,
  relationships,
  tags,
  hits,
  kudos,
  comments,
  bookmarks,
  orderBy,
  order,
  page
}: Options) {
  const url = new URL(ENDPOINT);
  const searchParams: (readonly [
    key: keyof SearchParams,
    value: string | string[]
  ])[] = [];

  if (query) searchParams.push(['work_search[query]', query]);
  if (title) searchParams.push(['work_search[title]', title]);
  if (author) searchParams.push(['work_search[creators]', author]);
  if (date) searchParams.push(['work_search[revised_at]', date]);
  if (complete)
    searchParams.push(['work_search[complete]', complete ? 'T' : 'F']);
  if (crossovers)
    searchParams.push(['work_search[crossover]', crossovers ? 'T' : 'F']);
  if (singleChapter)
    searchParams.push([
      'work_search[single_chapter]',
      singleChapter ? '1' : '0'
    ]);
  if (words) searchParams.push(['work_search[word_count]', words.toString()]);
  if (language) searchParams.push(['work_search[language_id]', language]);
  if (rating) searchParams.push(['include_work_search[rating_ids]', rating]);
  if (warnings)
    searchParams.push(
      ...warnings.map(
        warning =>
          ['include_work_search[archive_warning_ids][]', warning] as const
      )
    );
  if (categories)
    searchParams.push(
      ...categories.map(
        category => ['include_work_search[category_ids][]', category] as const
      )
    );
  if (characters)
    searchParams.push(['work_search[character_names]', characters]);
  if (relationships)
    searchParams.push(['work_search[relationship_names]', relationships]);
  if (tags) searchParams.push(['work_search[freeform_names]', tags]);
  if (hits) searchParams.push(['work_search[hits]', hits.toString()]);
  if (kudos) searchParams.push(['work_search[kudos_count]', kudos.toString()]);
  if (comments)
    searchParams.push(['work_search[comments_count]', comments.toString()]);
  if (bookmarks)
    searchParams.push(['work_search[bookmarks_count]', bookmarks.toString()]);
  if (orderBy) searchParams.push(['work_search[sort_column]', orderBy]);
  if (order) searchParams.push(['work_search[sort_direction]', order]);
  if (page) searchParams.push(['page', page.toString()]);

  searchParams.forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );

  const response = await fetch(url);
  return response;
}
