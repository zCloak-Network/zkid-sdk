import { base58btc, base58flickr } from './base58';

describe('multibase', (): void => {
  it('base58 btc encode', (): void => {
    const bytes = new TextEncoder().encode('abcd');

    expect(base58btc.encode(bytes)).toEqual('z3VNr6P');
  });
  it('base58 btc decode', (): void => {
    const bytes = base58btc.decode('z3VNr6P');

    expect(new TextDecoder().decode(bytes)).toEqual('abcd');
  });
  it('base58 flickr encode', (): void => {
    const bytes = new TextEncoder().encode('abcd');

    expect(base58flickr.encode(bytes)).toEqual('Z3unR6o');
  });
  it('base58 flickr decode', (): void => {
    const bytes = base58flickr.decode('Z3unR6o');

    expect(new TextDecoder().decode(bytes)).toEqual('abcd');
  });
});
