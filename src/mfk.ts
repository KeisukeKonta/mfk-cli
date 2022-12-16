import { parse } from 'https://deno.land/std/flags/mod.ts';
import MFKBlob from './interfaces/mfk-blob.ts';
import convertToJason from './utils/convert-to-json.ts';
import getBlob from './utils/get-blob.ts';
import listBlobs from './utils/list-blobs.ts';
import serveMfk from './utils/serve-mfk.ts';

const cmd = parse(Deno.args)._[0];

switch (cmd) {
  // List blobs
  case 'list': {
    const macAddress = parse(Deno.args).M;
    if (!macAddress) {
      throw `No MAC address specified: -M ${macAddress}`;
    } else if (typeof macAddress !== 'string') {
      throw `Invalid option: -M ${macAddress}\nIt has to be a string.`;
    }
    await listBlobs(macAddress);
    break;
  }
  // Get a blob
  case 'get': {
    const opt = parse(Deno.args);
    ['M', 'y', 'm', 'd', 'h'].forEach((o) => {
      const type = o == 'M' ? 'string' : 'number';
      if (!opt[o]) {
        throw `No option: -${o}`;
      } else if (typeof opt[o] !== type) {
        throw `Invalid option: -${o} ${opt[o]}\nIt has to be a ${type}.`;
      }
    });
    const blob: MFKBlob = {
      macAddress: opt.M,
      year: opt.y,
      month: opt.m,
      date: opt.d,
      hour: opt.h,
    };
    await getBlob(blob);
    break;
  }
  // Convert to a JSON
  case 'c2j': {
    const file = parse(Deno.args)._[1];
    if (!file) {
      throw `No file specified: c2j ${file}`;
    } else if (typeof file !== 'string') {
      throw `Invalid option: c2j ${file}\nIt has to be a string.`;
    }
    await convertToJason(file);
    break;
  }
  // Serve MFK data
  case 'serve': {
    const file = parse(Deno.args)._[1];
    const port = parse(Deno.args).p;
    if (!file) {
      throw `No file specified: serve ${file}`;
    } else if (typeof file !== 'string') {
      throw `Invalid option: serve ${file}\nIt has to be a string.`;
    }
    await serveMfk(file, port);
    break;
  }
  // Invalid command
  default:
    throw `Invalid command: ${parse(Deno.args)._.join(' ')}`;
}
