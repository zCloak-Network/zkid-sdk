# @zcloak/did-resolver

The repo define `DidDocument` and `DidResolver`

Resolve the DID synctax liked string and then fetching the DID Document from the registry, the registry might be a centralized database or a blockchain.

Each resolver should extend the class `DIDResolver` and implement the resolve method that accepts a DID and returns the `DidDocument`.


## Usage

Installation -

```
yarn add @zcloak/did-resolver
```

Functions can be imported as follows:

```js
import { ArweaveDidResolver } from '@zcloak/did-resolver';
```
