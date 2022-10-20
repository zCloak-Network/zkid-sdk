import { base32Decode, base32Encode, base32Validate } from './bs32';
import { base58Decode, base58Encode, base58Validate } from './bs58';
import { base64Decode, base64Encode, base64Validate } from './bs64';

describe('multibase', (): void => {
  it('base58 encode', (): void => {
    const bytes = new TextEncoder().encode('abcd');

    expect(base58Encode(bytes)).toEqual('z3VNr6P');
  });
  it('base58 decode', (): void => {
    const bytes = base58Decode('z3VNr6P');

    expect(new TextDecoder().decode(bytes)).toEqual('abcd');
  });
  it('base58 validate', (): void => {
    base58Validate('z3VNr6P');
  });

  it('base32 encode', (): void => {
    const bytes = new TextEncoder().encode('abcd');

    expect(base32Encode(bytes)).toEqual('bmfrggza');
  });
  it('base32 decode', (): void => {
    const bytes = base32Decode('bmfrggza');

    expect(new TextDecoder().decode(bytes)).toEqual('abcd');
  });
  it('base32 validate', (): void => {
    base32Validate('bmfrggza');
  });

  it('base64 encode', (): void => {
    const bytes = new TextEncoder().encode('abcd');

    expect(base64Encode(bytes)).toEqual('mYWJjZA==');
  });
  it('base64 decode', (): void => {
    const bytes = base64Decode('mYWJjZA==');

    expect(new TextDecoder().decode(bytes)).toEqual('abcd');
  });
  it('base64 validate', (): void => {
    base64Validate('mYWJjZA==');
  });
});
