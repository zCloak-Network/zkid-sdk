// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

use std::convert::TryFrom;
use ed25519_dalek::{Keypair, PublicKey, SecretKey, Signature, Signer as _, Verifier as _};
use wasm_bindgen::prelude::*;

/// Keypair helper function
fn new_from_seed(seed: &[u8]) -> Keypair {
	match SecretKey::from_bytes(seed) {
		Ok(secret) => {
			let public: PublicKey = (&secret).into();

			Keypair { secret: secret, public: public }
		},
		_ => panic!("Invalid seed provided.")
	}
}

/// Generate a key pair.
///
/// * seed: UIntArray with 32 element
///
/// returned vector is the concatenation of first the seed (32 bytes)
/// followed by the public key (32) bytes, as the full secret keys.
#[wasm_bindgen]
pub fn ext_ed_from_seed(seed: &[u8]) -> Vec<u8> {
	new_from_seed(seed)
		.to_bytes()
		.to_vec()
}

/// Sign a message
///
/// The combination of both public and private key must be provided.
/// This is effectively equivalent to a keypair.
///
/// * _: UIntArray with 32 element (was pubkey, now ignored)
/// * private: UIntArray with 64 element
/// * message: Arbitrary length UIntArray
///
/// * returned vector is the signature consisting of 64 bytes.
#[wasm_bindgen]
pub fn ext_ed_sign(_: &[u8], seckey: &[u8], message: &[u8]) -> Vec<u8> {
	// https://github.com/MystenLabs/ed25519-unsafe-libs
	// we never use the provided pubkey
	new_from_seed(seckey)
		.sign(message)
		.to_bytes()
		.to_vec()
}

/// Verify a message and its corresponding against a public key;
///
/// * signature: UIntArray with 64 element
/// * message: Arbitrary length UIntArray
/// * pubkey: UIntArray with 32 element
#[wasm_bindgen]
pub fn ext_ed_verify(signature: &[u8], message: &[u8], pubkey: &[u8]) -> bool {
	match (Signature::try_from(signature), PublicKey::from_bytes(pubkey)) {
		(Ok(s), Ok(k)) => k
			.verify(message, &s)
			.is_ok(),
		_ => false
	}
}
