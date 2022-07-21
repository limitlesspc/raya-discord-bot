import test from 'ava';

import '../env';
import { getVideo, searchVideos } from './video';

test('get video', async t => {
  const url = 'https://youtu.be/ZjOUc7rKtPQ';
  const video = await getVideo(url);
  t.truthy(video);
});

test('search video', async t => {
  const query = 'peternity';
  const videos = await searchVideos(query);
  t.truthy(videos);
});
