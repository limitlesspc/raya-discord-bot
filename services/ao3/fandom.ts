import fetch from 'node-fetch';

import ORIGIN from './origin';

const ENDPOINT = `${ORIGIN}/fandom/tag`;

export interface Fandom {
  id: string;
  name: string;
}

type Response = Fandom[];
export async function searchFandoms(term: string) {
  const url = new URL(ENDPOINT);
  url.searchParams.set('term', term);
  const response = await fetch(url);
  const tags = (await response.json()) as Response;
  return tags;
}
