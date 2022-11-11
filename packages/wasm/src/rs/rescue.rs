// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

use wasm_bindgen::prelude::*;
use rescue::{u64a_rescue};

#[wasm_bindgen]
pub fn rescue_hash(values: Vec<u64>) -> Vec<u64> {
	return u64a_rescue(values)
}
