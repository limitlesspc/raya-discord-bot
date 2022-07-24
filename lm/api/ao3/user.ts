import { load } from 'cheerio';
import fetch from 'cross-fetch';

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
  name = name.split('(')[0]?.trim() || '';
  const url = `${query}${name}`;
  const response = await fetch(url);
  const html = await response.text();
  const $ = await load(html);

  let iconURL = $('img.icon').attr('src') || '';
  if (!iconURL.startsWith('http')) iconURL = `${ORIGIN}${iconURL}`;

  return {
    name,
    url,
    iconURL
  };
}
