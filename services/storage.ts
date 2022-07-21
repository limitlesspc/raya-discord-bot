import { Storage } from '@google-cloud/storage';

import './env';

const storage = new Storage({
  credentials: JSON.parse(process.env.GCP_STORAGE_CRED || '')
});
export default storage;

export const filesBucket = storage.bucket(process.env.FILES_DOMAIN || '');
