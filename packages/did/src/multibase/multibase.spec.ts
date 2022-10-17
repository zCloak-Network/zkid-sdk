import { base58Decode, base58Encode } from './bs58';

describe('multibase', (): void => {
  it('base58 encode', (): void => {
    const bytes = new TextEncoder().encode('abcd');

    expect(base58Encode(bytes)).toEqual('z3VNr6P');
  });
  it('base58 decode', (): void => {
    const bytes = base58Decode('z3VNr6P');

    expect(new TextDecoder().decode(bytes)).toEqual('abcd');
  });
});
