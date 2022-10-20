import type { DidDocument, ParsedDid } from './types';

import { parseDid } from './parseDid';

export abstract class DidResolver {
  /**
   * parse a string to a ParsedDid
   * @param did The zkID did, did:zk:0x....
   * @returns `ParsedDid` object.
   */
  public parseDid(did: string): ParsedDid {
    return parseDid(did);
  }

  /**
   * Resolve a zkID DID.
   * @param didUrl - The zkid DID Url
   * @returns `Promise<DidDocument>`
   */
  public resolve(didUrl: string): Promise<DidDocument> {
    throw new Error(
      `Resolving not implemented in base class, please extend. ${this.constructor.name} ${didUrl}`
    );
  }
}
