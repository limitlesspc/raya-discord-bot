import type Channel from './channel';
import type Thumbnail from './thumbnail';
import type { Video } from './video';

interface Playlist {
  id: string;
  title: string;
  videoCount: number;
  lastUpdate?: string;
  views?: number;
  url: string;
  link?: string;
  channel?: Channel;
  thumbnail?: Thumbnail;
  videos: Video[];
}
export default Playlist;
