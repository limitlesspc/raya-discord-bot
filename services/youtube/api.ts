import { youtube } from '@googleapis/youtube';

const api = youtube({
  version: 'v3',
  auth: process.env.GOOGLE_APIS_KEY
});
export default api;
