// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

use miden_vm::{execute_zk_program, generate_program_hash, verify_zk_program};
use wasm_bindgen::prelude::*;

/// miden execute zk program
#[wasm_bindgen]
pub fn ext_execute_zk_program(program_code: String, stack_init: String, advice_tape: String) -> String {
	return execute_zk_program(program_code, stack_init, advice_tape)
}

/// miden generate program hash
#[wasm_bindgen]
pub fn ext_execute_zk_program(program_in_assembly: String) -> String {
	return generate_program_hash(program_in_assembly)
}

/// miden verify zk program result
#[wasm_bindgen]
pub fn ext_verify_zk_program(program_hash: String, stack_inputs: String, final_result: String) -> u32 {
	return verify_zk_program(program_hash, stack_inputs, final_result)
}
