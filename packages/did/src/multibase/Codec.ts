import { base } from './base-x';

type BaseEncode = (source: Uint8Array) => string;
type BaseDecode = (str: string) => Uint8Array;

export class Codec {
  public prefix: string;
  public baseEncode: BaseEncode;
  public baseDecode: BaseDecode;

  constructor(prefix: string, alphabet: string) {
    this.prefix = prefix;
    const { decode, encode } = base(alphabet);

    this.baseEncode = encode;
    this.baseDecode = decode;
  }

  /**
   * @param {Uint8Array} input
   */
  public encode(input: Uint8Array): string {
    return `${this.prefix}${this.baseEncode(input)}`;
  }

  /**
   * @param {string} input
   */
  decode(input: string): Uint8Array {
    if (input[0] !== this.prefix) {
      throw new Error(
        `Unable to decode multibase string ${JSON.stringify(
          input
        )},  decoder only supports inputs prefixed with ${this.prefix}`
      );
    }

    return this.baseDecode(input.slice(this.prefix.length));
  }
}
