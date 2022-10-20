import { ArweaveDidResolver } from './ArweaveDidResolver';

const DID_URI = 'did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51';

describe('ArweaveDidResolver', (): void => {
  let resolver: ArweaveDidResolver;

  beforeEach(() => {
    resolver = new ArweaveDidResolver();
  });

  it('resolve didUrl', async (): Promise<void> => {
    await resolver.resolve(DID_URI);
  });
});
