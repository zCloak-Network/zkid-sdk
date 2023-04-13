# @zcloak/login-providers

Generic transport providers to send method calls from dapp to did wallet. It provides an interface to making RPC calls and is generally implements @zcloak/login-rpc defined rpc methods.

## Installation

```
yarn add @zcloak/login-providers
```

## Selection

All providers has abstract `BaseProvider` and `Events`, `BaseProvider` accept a request function defined by `@zcloak/login-rpc`, the events needs to implements by each provider.

`ZkidWalletProvider` for zCloak ID Wallet extension, use it to call methods to extension, and can listen extension events. The request method and the events of `ZkidWalletProvider` is to get the `zkid` object injected into the window by the extension.

## Usage

ZkidWalletProvider Initialization

```typescript
import { ZkidWalletProvider } from '@zcloak/login-providers'

const provider = new ZkidWalletProvider();

// Check if the extension is installed before used
provider.isInstalled();
```

## Events

All providers implements the `EventEmitter` API. This sections details the events emitted via that API. There are innumerable EventEmitter guides elsewhere, but you can listen for events like this:

```typescript
provider.on('did_changed', (did) => {
  // Handle the new did when wallet selected did changed
  // `did` is an Object of `DidInfo`
})
```

```typescript
provider.on('lock', (did) => {
  // Handle the wallet locked
})
```

```typescript
provider.on('unlock', (did) => {
  // Handle the wallet unlock
})
```

## Method by BaseProvider

Send an auth request to wallet.
```typescript
await provider.requestAuth();

// get auth status
const authed: boolean = await provider.isAuth();
```

Get Current selected did in wallet.

```typescript
const did: DidInfo = await provider.getCurrentDid();
```

Send a credential digest request to wallet.(Login with credential digest)

```typescript
const credentialDigest = await provider.requestCredentialDigest(...args);
```

Send a credential content request to wallet.(Login with credential content)

```typescript
const credential = await provider.requestCredentialContent(...args);
```

Login with did

```typescript
const signature = await provider.didLogin('0x...');
```

Sign data use current selected did.

```typescript
const signature = await provider.sign('0x...');
```

Encrypt and decrypt data for peer.

```typescript
const encrypted = await provider.encrypt('0x...', receiver);

const decrypted = await provider.decrypt('0x...', sender);
```
