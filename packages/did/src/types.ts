import type { DidUrl, Service } from '@zcloak/did-resolver/types';

export interface IDidDetails {
  id: DidUrl;
  controller: Set<DidUrl>;
  authentication?: Set<Uint8Array>;
  assertionMethod?: Set<Uint8Array>;
  keyAgreement?: Set<Uint8Array>;
  capabilityInvocation?: Set<Uint8Array>;
  capabilityDelegation?: Set<Uint8Array>;
  service?: Service[];
}
