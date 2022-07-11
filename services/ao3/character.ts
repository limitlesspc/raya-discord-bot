import { fetch } from 'undici';

import ORIGIN from './origin';

const ENDPOINT = `${ORIGIN}/autocomplete/character`;

export interface Character {
  id: string;
  name: string;
}

type Response = Character[];
export async function searchTags(term: string) {
  const url = new URL(ENDPOINT);
  url.searchParams.set('term', term);
  const response = await fetch(url);
  const tags = (await response.json()) as Response;
  return tags;
}
