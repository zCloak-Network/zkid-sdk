// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

use blake2_rfc::blake2b::blake2b;
use hmac::{Hmac, Mac};
use pbkdf2::pbkdf2;
use rescue::{u64a_rescue};
use scrypt::{ScryptParams, scrypt};
use sha2::{Digest, Sha256, Sha512};
use tiny_keccak::{Hasher, Keccak};
use wasm_bindgen::prelude::*;

/// rescue prime hash for input
#[wasm_bindgen]
pub fn ext_rescue_prime_hash(values: Vec<u64>) -> Vec<u64> {
	return u64a_rescue(values)
}

/// blake2b hash for the specified input
///
/// * data: Arbitrary data to be hashed
/// * key: Key to add to the hashing (normally empty)
/// * size: Size in bytes of the resulting output
///
/// Returns a vector with the hash result
#[wasm_bindgen]
pub fn ext_blake2b(data: &[u8], key: &[u8], size: u32) -> Vec<u8> {
	// we cast to usize here - due to the WASM, we'd rather have u32 inputs
	blake2b(size as usize, key, data)
		.as_bytes()
		.to_vec()
}

/// hmac with sha256
#[wasm_bindgen]
pub fn ext_hmac_sha256(key: &[u8], data: &[u8]) -> Vec<u8> {
	match Hmac::<Sha256>::new_varkey(key) {
		Ok(mut m) => {
			m.input(data);

			m
				.result()
				.code()
				.to_vec()
		},
		_ => panic!("Invalid key provided.")
	}
}

/// hmac with sha512
#[wasm_bindgen]
pub fn ext_hmac_sha512(key: &[u8], data: &[u8]) -> Vec<u8> {
	match Hmac::<Sha512>::new_varkey(key) {
		Ok(mut m) => {
			m.input(data);

			m
				.result()
				.code()
				.to_vec()
		},
		_ => panic!("Invalid key provided.")
	}

}

/// Create a keccak256 hash for the specified input
///
// * data: Arbitrary data to be hashed
///
/// Returns the hash as a vector
#[wasm_bindgen]
pub fn ext_keccak256(data: &[u8]) -> Vec<u8> {
	let mut keccak = Keccak::v256();
	let mut res = [0u8; 32];

	keccak.update(data);
	keccak.finalize(&mut res);

	res.to_vec()
}

/// Create a keccak512 hash for the specified input
///
// * data: Arbitrary data to be hashed
///
/// Returns the hash as a vector
#[wasm_bindgen]
pub fn ext_keccak512(data: &[u8]) -> Vec<u8> {
	let mut keccak = Keccak::v512();
	let mut res = [0u8; 64];

	keccak.update(data);
	keccak.finalize(&mut res);

	res.to_vec()
}

/// pbkdf2 kdf from an input, salt for the number of specified rounds
///
/// * data: Arbitrary data to be hashed
/// * salt: Salt for this hash
/// * rounds: The number of rounds to perform
///
/// Returns a vector with the hashed result
#[wasm_bindgen]
pub fn ext_pbkdf2(data: &[u8], salt: &[u8], rounds: u32) -> Vec<u8> {
	let mut res = [0u8; 64];

	// we cast to usize here - due to the WASM, we'd rather have u32 inputs
	pbkdf2::<Hmac::<Sha512>>(data, salt, rounds as usize, &mut res);

	res.to_vec()
}

/// scrypt kdf from input, salt and config
///
/// * password: Password to hash
/// * salt: Salt for this hash
/// * log2_n: log2(n)
/// * r: r
/// * p: p
///
/// Returns vector with the hashed result
#[wasm_bindgen]
pub fn ext_scrypt(password: &[u8], salt: &[u8], log2_n: u8, r: u32, p: u32) -> Vec<u8> {
	match ScryptParams::new(log2_n, r, p) {
		Ok(p) => {
			let mut res = [0u8; 64];

			match scrypt(password, salt, &p, &mut res) {
				Ok(_) => res.to_vec(),
				_ => panic!("Invalid scrypt hash.")
			}
		},
		_ => panic!("Invalid scrypt params.")
	}

}

/// sha256 hash for the specified input
///
/// * data: Arbitrary data to be hashed
///
/// Returns a vector with the hash result
#[wasm_bindgen]
pub fn ext_sha256(data: &[u8]) -> Vec<u8> {
	let mut hasher = Sha256::new();

	hasher.input(data);

	hasher
		.result()
		.to_vec()
}

/// sha512 hash for the specified input
///
/// * data: Arbitrary data to be hashed
///
/// Returns a vector with the hash result
#[wasm_bindgen]
pub fn ext_sha512(data: &[u8]) -> Vec<u8> {
	let mut hasher = Sha512::new();

	hasher.input(data);

	hasher
		.result()
		.to_vec()
}
