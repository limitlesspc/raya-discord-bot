import { fetch } from 'undici';

import ORIGIN from './origin';

const ENDPOINT = `${ORIGIN}/autocomplete/relationship`;

export interface Relationship {
  id: string;
  name: string;
}

type Response = Relationship[];
export async function searchTags(term: string) {
  const url = new URL(ENDPOINT);
  url.searchParams.set('term', term);
  const response = await fetch(url);
  const tags = (await response.json()) as Response;
  return tags;
}
