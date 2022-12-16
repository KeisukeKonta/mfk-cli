import { basename, join } from 'https://deno.land/std/path/mod.ts';
import { parse } from 'https://deno.land/std/encoding/csv.ts';
import MFKData from '../interfaces/mfk-data.ts';

function flatJSON(json: object, entry: object | number, keys: string[]) {
  if (typeof entry === 'object') {
    Object.keys(entry).forEach((key) =>
      flatJSON(json, entry[key], [...keys, key])
    );
  } else {
    json[keys.join('.')] = entry;
  }
}

export default async function convertToJason(file: string) {
  const text = await Deno.readTextFile(file);
  const csv: string[][] = await parse(text, { separator: ',' })
    .map((row) =>
      row.map((d: string, i: number) =>
        1 <= i && i <= 2 ? new Date(d) : i === 3 ? String(d) : Number(d)
      )
    );
  const mfkData: MFKData[] = [];
  for (const d of csv) {
    const data: MFKData = {
      type: 'mfk::Replicate',
      at: d[0],
      ac_uuid: d[1],
      rc_uuid: d[2],
      replicate_values: {},
      rotation: { roll: d[29], pitch: d[30], yaw: d[31] },
      points_of_interest: [],
    };
    const replicate_values = {
      topcon: {
        asbuilt_shapes: {
          base_front_side: { enabled: d[4] },
          blade: { enabled: d[19], apply_when: d[20] },
          bucket_outline_a: { enabled: d[21] },
          bucket_outline_b: { enabled: d[22] },
          bucket_outline_c: { enabled: d[23] },
          bucket_outline_d: { enabled: d[24] },
        },
        nodes: {
          boom: { ry: d[5] },
          stick: { ry: d[7] },
          implement: { ry: d[9] },
          base: { rz: d[11] },
        },
        transform: {
          local_position: {
            northing: d[13],
            easting: d[14],
            elevation: d[15],
          },
          local_rotation: {
            pitch: d[16],
            yaw: d[17],
            roll: d[18],
          },
        },
      },
    };
    flatJSON(data.replicate_values, replicate_values, []);
    const points_of_interest = [
      'implement',
      'base_rl',
      'base_rr',
      'base_fl',
      'base_fr',
      'base_ml',
      'base_mr',
      'bucket_r',
      'bucket_l',
      'bucket_outline_a_r',
      'bucket_outline_a_l',
      'bucket_outline_b_r',
      'bucket_outline_b_l',
      'bucket_outline_c_r',
      'bucket_outline_c_l',
      'bucket_outline_d_r',
      'bucket_outline_d_l',
    ];
    data.points_of_interest = points_of_interest.map((id, i) => ({
      id,
      n: d[35 + 3 * i],
      e: d[36 + 3 * i],
      u: d[37 + 3 * i],
    }));
    mfkData.push(data);
  }
  await Deno.writeTextFile(
    join('json', basename(file).replace('csv', 'json')),
    JSON.stringify(mfkData),
  );
}
