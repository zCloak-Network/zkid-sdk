// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

use bip39::{Mnemonic, MnemonicType, Language, Seed};
use hmac::Hmac;
use pbkdf2::pbkdf2;
use sha2::Sha512;
use wasm_bindgen::prelude::*;

/// Generate a bip39 phrase
///
/// words: number of words, either 12, 15, 18 21 or 24
///
/// Returns the bip 39 phrase
#[wasm_bindgen]
pub fn ext_bip39_generate(words: u32) -> String {
	match MnemonicType::for_word_count(words as usize) {
		Ok(p) => Mnemonic::new(p, Language::English)
			.into_phrase(),
		_ => panic!("Invalid count provided.")
	}
}

/// Create entropy from a bip39 phrase
///
/// * phrase: mnemonic phrase
///
/// Returns the entropy
#[wasm_bindgen]
pub fn ext_bip39_to_entropy(phrase: &str) -> Vec<u8> {
	match Mnemonic::from_phrase(phrase, Language::English) {
		Ok(m) => m
			.entropy()
			.to_vec(),
		_ => panic!("Invalid phrase provided.")
	}
}

/// Create a mini-secret from a bip39 phrase
///
/// * phrase: mnemonic phrase
///
/// Returns the 32-byte mini-secret via entropy
#[wasm_bindgen]
pub fn ext_bip39_to_mini_secret(phrase: &str, password: &str) -> Vec<u8> {
	match Mnemonic::from_phrase(phrase, Language::English) {
		Ok(m) => {
			let mut res = [0u8; 64];
			let mut seed = vec![];

			seed.extend_from_slice(b"mnemonic");
			seed.extend_from_slice(password.as_bytes());

			pbkdf2::<Hmac<Sha512>>(m.entropy(), &seed, 2048, &mut res);

			res[..32].to_vec()
		},
		_ => panic!("Invalid phrase provided.")
	}
}

/// Creates a BTC/ETH compatible seed from a bip-39 phrase
///
/// @phrase: mnemonic phrase
///
/// Returns a 32-byte seed
#[wasm_bindgen]
pub fn ext_bip39_to_seed(phrase: &str, password: &str) -> Vec<u8> {
	match Mnemonic::from_phrase(phrase, Language::English) {
		Ok(m) => Seed::new(&m, password)
			.as_bytes()[..32]
			.to_vec(),
		_ => panic!("Invalid phrase provided.")
	}
}

/// Validates a bip39 phrase
///
/// * phrase: mnemonic phrase
///
/// Returns the true/false
#[wasm_bindgen]
pub fn ext_bip39_validate(phrase: &str) -> bool {
	match Mnemonic::validate(phrase, Language::English) {
		Ok(_) => true,
		_ => false
	}
}
