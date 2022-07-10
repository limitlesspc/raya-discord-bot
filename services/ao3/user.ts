import { load } from 'cheerio';
import { fetch } from 'undici';

import ORIGIN from './origin';

const query = `${ORIGIN}/users/`;
const ao3Regex = new RegExp(`${query}(.+)`);

export function getNameFromURL(url: string): string {
  if (!url.match(ao3Regex)) return '';
  return url.replace(query, '').split(/\/|\?|#/)[0] || '';
}

export interface User {
  name: string;
  url: string;
  iconURL: string;
}
export async function getUser(name: string): Promise<User> {
  const response = await fetch(`${query}${name}`);
  const html = await response.text();
  const $ = await load(html);

  return {
    name,
    url: `${query}${name}`,
    iconURL:
      $('#main > div.user.home > div.primary.header.module > p > a > img').attr(
        'src'
      ) || ''
  };
}
