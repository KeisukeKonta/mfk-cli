import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
import { parse } from 'https://deno.land/x/xml/mod.ts';

const { ACCOUNT, CONTAINER, TOKEN } = config();

export default async function listBlobs(macAddress: string) {
  const blobs: Array<string> = [];
  let marker = undefined;
  do {
    const URI =
      `https://${ACCOUNT}.blob.core.windows.net/${CONTAINER}?restype=container&comp=list${
        macAddress ? '&prefix=' + macAddress : ''
      }${marker ? '&marker=' + marker : ''}`;
    const response = await fetch(`${URI}${TOKEN.replace('?', '&')}`);
    const text = await response.text();
    const xml = parse(text);
    marker = xml.EnumerationResults.NextMarker;
    blobs.push(
      ...xml.EnumerationResults.Blobs.Blob
        .filter((blob) => blob.Properties['Content-Length'] > 0)
        .map((blob) => blob.Name.split('/')[1]),
    );
  } while (marker);
  console.log(blobs.join('\n'));
}
