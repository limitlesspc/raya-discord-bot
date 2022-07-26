// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import fetch, { Headers, Request, Response } from 'node-fetch';

if (!globalThis.fetch) {
  globalThis.fetch = fetch as any;
  globalThis.Headers = Headers as any;
  globalThis.Request = Request as any;
  globalThis.Response = Response as any;
}

export { Fetcher } from 'openapi-typescript-fetch';
