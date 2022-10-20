import type { DidDocument } from '@zcloak/did-resolver/types';

import { numberToU8a, stringToU8a, u8aConcat } from '@polkadot/util';

/**
 * encode did document, used to sign it, do not encode proof, because the signature will push to.
 * @param document an object of [[DidDocument]]
 * @returns [[Uint8Array]]
 */
export function encodeDidDocument(document: DidDocument): Uint8Array {
  return u8aConcat(
    ...document['@context'].map((context) => stringToU8a(context)),
    stringToU8a(document.id),
    ...document.controller.map((controller) => stringToU8a(controller)),
    ...(document.verificationMethod ?? []).map(({ controller, id, publicKeyMultibase, type }) =>
      u8aConcat(
        stringToU8a(type),
        stringToU8a(id),
        ...controller.map((c) => stringToU8a(c)),
        stringToU8a(publicKeyMultibase)
      )
    ),
    ...(document.authentication ?? []).map((key) => stringToU8a(key)),
    ...(document.assertionMethod ?? []).map((key) => stringToU8a(key)),
    ...(document.keyAgreement ?? []).map((key) => stringToU8a(key)),
    ...(document.capabilityInvocation ?? []).map((key) => stringToU8a(key)),
    ...(document.capabilityDelegation ?? []).map((key) => stringToU8a(key)),
    ...(document.service ?? []).map(({ id, serviceEndpoint, type }) =>
      u8aConcat(stringToU8a(id), ...type.map((t) => stringToU8a(t)), stringToU8a(serviceEndpoint))
    ),
    numberToU8a(document.createdTime)
  );
}
