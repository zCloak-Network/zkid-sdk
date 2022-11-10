// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

use wasm_bindgen::prelude::*;
use rescue::{rescue,to_u64array,to_u8array};

#[wasm_bindgen]
pub fn rescue_hash(values: String) -> Vec<u64> {
	return rescue(values)
}

#[wasm_bindgen]
pub fn u8_to_u64(values: String) -> Vec<u64> {
	return to_u64array(values)
}


#[wasm_bindgen]
pub fn u64_to_u8(values: String) -> Vec<u8> {
	return to_u8array(values)
}
