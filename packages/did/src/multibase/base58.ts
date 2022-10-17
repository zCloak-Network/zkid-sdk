import { Codec } from './Codec';

export const base58btc = new Codec(
  'z',
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
);

export const base58flickr = new Codec(
  'Z',
  '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'
);
