import { generateMnemonic, mnemonicToSeed, validateMnemonic } from './mnemonic';

const MNEMONIC =
  'health correct setup usage father decorate curious copper sorry recycle skin equal';

describe('mnemonic', (): void => {
  it('generate mnemonic', (): void => {
    console.log(generateMnemonic(12));
  });

  it('validate mnemonic', (): void => {
    validateMnemonic(MNEMONIC);
  });

  it('mnemonic to seed', (): void => {
    const seed = mnemonicToSeed(MNEMONIC);

    console.log(seed);
  });
});
