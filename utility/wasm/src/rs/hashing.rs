// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

use rescue::{u64a_rescue, rescue_prime_optimized};
use wasm_bindgen::prelude::*;

/// rescue prime hash for input
#[wasm_bindgen]
pub fn ext_rescue_prime_hash(values: Vec<u64>) -> Vec<u64> {
	return u64a_rescue(values)
}

/// rescue prime optimized hash for input
#[wasm_bindgen]
pub fn ext_rescue_prime_optimized_hash(values: Vec<u64>) -> Vec<u64> {
	return rescue_prime_optimized(values)
}
