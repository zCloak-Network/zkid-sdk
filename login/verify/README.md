# @zcloak/login-verify

Provide some functions to verify login info with did or credentials.

Includes three login methods, "login with did", "login with credential digest", "login with credential"content`, see more for [@zcloak/login-providers](../providers)


## Installation

```
yarn add @zcloak/login-verify
```

## Usage


verify login result with did

```ts
import { verifyDidLogin } from '@zcloak/login-verify';

// to sign message
const message = '';

const did = await provider.getCurrentDid();

const signature = await provider.didLogin(message);

const result = verifyDidLogin(message, signature, did.authenticationKey);

console.log(result)
```

verify login result with credential digest, this verify verify claimerSignature, attestation status, credential owner.

```ts
import { verifyCredentialDigest } from '@zcloak/login-verify';

const challenge = '';

const did = await provider.getCurrentDid();

// verify credential digest
const credentialDigest = await provider.requestCredentialDigest(challenge);

const result = await verifyCredentialDigest(credentialDigest, challenge, did.didUri);

```

verify login result with credential, this function will verify all data for credential.

```ts
import { verifyCredentialContent } from '@zcloak/login-verify';

const challenge = '';

const did = await provider.getCurrentDid();

const credential = await provider.requestCredentialContent(challenge);

// verify credential content
const result = await verifyCredentialContent(credential, challenge, did.didUri);

console.log(result);
```
