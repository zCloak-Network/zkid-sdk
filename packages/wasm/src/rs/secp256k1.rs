// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

use secp256k1::{ecdsa::{RecoverableSignature, RecoveryId}, Message, PublicKey, SecretKey, SECP256K1};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn ext_secp_pub_compress(pubkey: &[u8]) -> Vec<u8> {
	match PublicKey::from_slice(&pubkey) {
		Ok(p) => p
			.serialize()
			.to_vec(),
		_ => panic!("Invalid pubkey provided.")
	}
}

#[wasm_bindgen]
pub fn ext_secp_pub_expand(pubkey: &[u8]) -> Vec<u8> {
	match PublicKey::from_slice(&pubkey) {
		Ok(p) => p
			.serialize_uncompressed()
			.to_vec(),
		_ => panic!("Invalid pubkey provided.")
	}
}

#[wasm_bindgen]
pub fn ext_secp_from_seed(seed: &[u8]) -> Vec<u8> {
	match SecretKey::from_slice(seed) {
		Ok(s) => {
			let mut res = vec![];
			let pubkey = PublicKey::from_secret_key(SECP256K1, &s);

			res.extend_from_slice(&s.serialize_secret());
			res.extend_from_slice(&pubkey.serialize());

			res
		},
		_ => panic!("Invalid seed provided.")
	}
}

#[wasm_bindgen]
pub fn ext_secp_recover(hash: &[u8], sig: &[u8], rec: i32) -> Vec<u8> {
	match RecoveryId::from_i32(rec) {
		Ok(r) => match (Message::from_slice(hash), RecoverableSignature::from_compact(&sig, r)) {
			(Ok(m), Ok(s)) => match s.recover(&m) {
				Ok(k) => k
					.serialize()
					.to_vec(),
				_ => panic!("Unable to recover.")
			},
			_ => panic!("Invalid signature provided.")
		},
		_ => panic!("Invalid recovery data provided.")
	}
}

#[wasm_bindgen]
pub fn ext_secp_sign(hash: &[u8], seckey: &[u8]) -> Vec<u8> {
	match (Message::from_slice(hash), SecretKey::from_slice(seckey)) {
		(Ok(m), Ok(s)) => {
			let mut res = vec![];
			let (rec, sig) = SECP256K1
				.sign_ecdsa_recoverable(&m, &s)
				.serialize_compact();

			res.extend_from_slice(&sig);
			res.push(rec.to_i32() as u8);

			res
		},
		_ => panic!("Invalid message or secret provided.")
	}
}
