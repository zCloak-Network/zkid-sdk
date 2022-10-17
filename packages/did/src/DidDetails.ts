import type { DidResolver } from '@zcloak/did-resolver';
import type { DidDocument, DidUrl, Service } from '@zcloak/did-resolver/types';

import { defaultResolver } from './defaults';
import { IDidDetails } from './types';
import { parseDidDocument } from './utils';

export class DidDetails implements IDidDetails {
  public id: DidUrl;
  public controller: Set<DidUrl>;
  public authentication?: Set<Uint8Array>;
  public assertionMethod?: Set<Uint8Array>;
  public keyAgreement?: Set<Uint8Array>;
  public capabilityInvocation?: Set<Uint8Array>;
  public capabilityDelegation?: Set<Uint8Array>;
  public service?: Service[];

  constructor({
    assertionMethod,
    authentication,
    capabilityDelegation,
    capabilityInvocation,
    controller,
    id,
    keyAgreement,
    service
  }: IDidDetails) {
    this.id = id;
    this.controller = controller;
    this.authentication = authentication;
    this.assertionMethod = assertionMethod;
    this.keyAgreement = keyAgreement;
    this.capabilityInvocation = capabilityInvocation;
    this.capabilityDelegation = capabilityDelegation;
    this.service = service;
  }

  /**
   * query did document from `VDR`, and parse it to [[DidDetails]]
   * @param did a string that conforms to the DID Syntax.
   * @param resolver(optional) a [[DidResolver]] instance, default [[ZkidDidResolver]]
   * @returns instance of [[DidDetails]]
   * @example
   * <BR>
   * ```typescript
   * import { DidDetails } from '@zcloak/did'
   *
   * const didDetails = DidDetails.fromDid('did:zk:0x082d674c00e27fBaAAE123a85f5024A1DD702e51');
   * ```
   */
  public static async fromDid(
    did: DidUrl,
    resolver: DidResolver = defaultResolver
  ): Promise<DidDetails> {
    const document = await resolver.resolve(did);

    return DidDetails.fromDidDocument(document);
  }

  /**
   * parse a did document to [[IDidDetails]]
   * @param document an object of [[DidDocument]]
   * @returns instance of [[DidDetails]]
   * @example
   * <BR>
   * ```typescript
   * import { DidDetails } from '@zcloak/did'
   * import type { DidDocument } from '@zcloak/did-resolver/types';
   *
   * const document: DidDocument = {};
   * const didDetails = DidDetails.fromDidDocument(document);
   * ```
   */
  public static fromDidDocument(document: DidDocument): DidDetails {
    const details = parseDidDocument(document);

    return new DidDetails(details);
  }
}
