export default interface MFKData {
  type: 'mfk::Replicate';
  at: number;
  ac_uuid: Date;
  rc_uuid: Date;
  replicate_values: {
    'topcon.asbuilt_shapes.base_front_side.enabled': number;
    'topcon.nodes.boom.ry': number;
    'topcon.nodes.stick.ry': number;
    'topcon.nodes.implement.ry': number;
    'topcon.nodes.base.rz': number;
    'topcon.transform.local_position.northing': number;
    'topcon.transform.local_position.easting': number;
    'topcon.transform.local_position.elevation': number;
    'topcon.transform.local_rotation.pitch': number;
    'topcon.transform.local_rotation.yaw': number;
    'topcon.transform.local_rotation.roll': number;
    'topcon.asbuilt_shapes.blade.enabled': number;
    'topcon.asbuilt_shapes.blade.apply_when': number;
    'topcon.asbuilt_shapes.bucket_outline_a.enabled': number;
    'topcon.asbuilt_shapes.bucket_outline_b.enabled': number;
    'topcon.asbuilt_shapes.bucket_outline_c.enabled': number;
    'topcon.asbuilt_shapes.bucket_outline_d.enabled': number;
  };
  rotation: { roll: number; pitch: number; yaw: number };
  points_of_interest: [
    { id: 'implement'; n: number; e: number; u: number },
    { id: 'base_rl'; n: number; e: number; u: number },
    { id: 'base_rr'; n: number; e: number; u: number },
    { id: 'base_fl'; n: number; e: number; u: number },
    { id: 'base_fr'; n: number; e: number; u: number },
    { id: 'base_ml'; n: number; e: number; u: number },
    { id: 'base_mr'; n: number; e: number; u: number },
    { id: 'bucket_r'; n: number; e: number; u: number },
    { id: 'bucket_l'; n: number; e: number; u: number },
    { id: 'bucket_outline_a_r'; n: number; e: number; u: number },
    { id: 'bucket_outline_a_l'; n: number; e: number; u: number },
    { id: 'bucket_outline_b_r'; n: number; e: number; u: number },
    { id: 'bucket_outline_b_l'; n: number; e: number; u: number },
    { id: 'bucket_outline_c_r'; n: number; e: number; u: number },
    { id: 'bucket_outline_c_l'; n: number; e: number; u: number },
    { id: 'bucket_outline_d_r'; n: number; e: number; u: number },
    { id: 'bucket_outline_d_l'; n: number; e: number; u: number },
  ];
}
