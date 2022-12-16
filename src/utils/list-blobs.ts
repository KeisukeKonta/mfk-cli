import { basename } from 'https://deno.land/std/path/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { parse } from 'https://deno.land/x/xml/mod.ts';

const { ACCOUNT, CONTAINER, TOKEN } = config();

function toJson(macAddress: string, blobs: string[]): object {
  const dates = {};
  for (const blob of blobs) {
    const Date = blob.match(
      new RegExp(
        String
          .raw`urn_X-topcon_machine_${macAddress}_(\d{4})-(\d{2})-(\d{2})T(\d{2})_00_00\+09_00_Asia-Tokyo.csv`,
      ),
    );
    const [year, month, date, hour] = Date!.slice(1);
    if (!dates.hasOwnProperty(year)) {
      dates[year] = {};
    }
    if (!dates[year].hasOwnProperty(month)) {
      dates[year][month] = {};
    }
    if (!dates[year][month].hasOwnProperty(date)) {
      dates[year][month][date] = [];
    }
    dates[year][month][date].push(hour);
  }
  return dates;
}

function printList(list: object) {
  console.log(
    '┌──────┬───────┬──────┬─────────────────────────────────────────────────────────────────────────┐',
  );
  console.log(
    '│ year │ month │ date │                                  hours                                  │',
  );
  console.log(
    '├──────┼───────┼──────┼─────────────────────────────────────────────────────────────────────────┤',
  );
  const years = list;
  for (const year of Object.keys(years)) {
    const months = years[year];
    months['count'] = 0;
    for (const month of Object.keys(months).filter((m) => m !== 'count')) {
      const dates = months[month];
      dates['count'] = 0;
      for (const date of Object.keys(dates).filter((d) => d !== 'count')) {
        const hours = dates[date].map(Number);
        dates['count']++;
        months['count']++;
        const yyyy = `${months.count === 1 ? year : '    '}`;
        const mm = `${dates.count === 1 ? month : '  '}`;
        const dd = date;
        const hh = [...Array(24).keys()].map((h) =>
          hours.includes(h) ? String(h).padStart(2, '0') : '  '
        ).join(' ');
        console.log(
          `│ ${yyyy} │  ${mm}   │  ${dd}  │ ${hh} │`,
        );
      }
    }
  }
  console.log(
    '└──────┴───────┴──────┴─────────────────────────────────────────────────────────────────────────┘',
  );
}

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
        .map((blob) => basename(blob.Name)),
    );
  } while (marker);
  const dates = toJson(macAddress, blobs);
  printList(dates);
}
