#![no_std]
use crypto::{hash::rescue::rp64_256::ElementDigest, Digest, ElementHasher};
// use log::debug;
use sp_std::{vec, vec::Vec};
// use serde::{Serialize, Deserialize};
extern crate alloc;
use alloc::string::{String, ToString};
// RE-EXPORTS
// ================================================================================================

use math::fields::f64::BaseElement;
use math::StarkField;

// RESCUE
// ================================================================================================

/// Executes the `rescue` fucntion and returns the rescue hash result.
/// IF the input is [A,B,C,D] -- [a_0,a_1,a_2,a_3, b_0,b_1,b_2,b_3, c_0,c_1,c_2,c_3, d_0,d_1,d_2,d_3]
/// The input in the VM should be : [d_3,d_2,d_1,d_0, c_3,c_2,c_1,c_0, b_3,b_2,b_1,b_0, a_3,a_2,a_1,a_0,], in the VM the rescue sequense should be :
/// Hash(A,B,(C,D))
///
/// * `inputs` specifies the rescue input, it should contain 8 elements or more(over 8 but should be some multiple of 4);
/// *  Return the hash result Vec<u64>
pub fn rescue(values: String) -> Vec<u64> {
    let mut values_in_u64 = vec![];
    if values.len() != 0 {
        let values_a: Vec<&str> = values.split(',').collect();
        values_in_u64 = values_a
            .iter()
            // .map(|public_a| public_a.parse::<u64>().unwrap())
            .map(|public_a| public_a.parse::<u64>().expect("parse fail"))
            .collect();
    };
    assert!(
        (values_in_u64.len()== 8) || ( (values_in_u64.len() > 8) && (values_in_u64.len() % 4 == 0)),
        "expected len of values_in_u64 to be [exactly 8] or [over 8 but should be some multiple of 4] but received {}",
        values_in_u64.len()
    );
    let mut elements = from_vec(values_in_u64);
    let hash_times = if elements.len() == 8 {
        1
    } else {
        elements.len() / 4 - 1
    };
    let mut result: ElementDigest;
    if hash_times == 1 {
        result = crypto::hashers::Rp64_256::hash_elements(&elements);
    } else {
        let mut first: Vec<BaseElement> = elements.drain(elements.len() - 8..).collect();
        let mut to_be_hash = crypto::hashers::Rp64_256::hash_elements(&first);
        for i in 1..hash_times {
            let mut a = ElementDigest::digests_as_elements(&[to_be_hash]).to_vec();
            let mut drain_4_element: Vec<BaseElement> = elements.drain(elements.len() - 4..).collect();
            drain_4_element.append(&mut a);
            to_be_hash = crypto::hashers::Rp64_256::hash_elements(&drain_4_element);
        }
        result = to_be_hash;
    };

    return as_u64(result).to_vec();
}

pub fn as_u64(origin: ElementDigest) -> [u64; 4] {
    let mut result = [0; 4];
    result[..1].copy_from_slice(&[origin.0[0].as_int()]);
    result[1..2].copy_from_slice(&[origin.0[1].as_int()]);
    result[2..3].copy_from_slice(&[origin.0[2].as_int()]);
    result[3..4].copy_from_slice(&[origin.0[3].as_int()]);
    result
}

pub fn rescue_two_para(para_1: [u64; 4], para_2: [u64; 4]) -> Vec<u64> {
    let mut first: Vec<u64> = para_1.to_vec();
    let mut second: Vec<u64> = para_2.to_vec();
    first.append(&mut second);
    let elements = from_vec(first);
    let result = crypto::hashers::Rp64_256::hash_elements(&elements);
    return as_u64(result).to_vec();
}

pub fn rescue_two_para_u8_32(para_1: [u64; 4], para_2: [u64; 4]) -> [u8; 32] {
    let mut first: Vec<u64> = para_1.to_vec();
    let mut second: Vec<u64> = para_2.to_vec();
    first.append(&mut second);

    let elements = from_vec(first);
    let result = crypto::hashers::Rp64_256::hash_elements(&elements);
    return result.as_bytes();
}

// convert a [u64;4] hash result to [u8;32]
pub fn to_u8array(values: String) -> Vec<u8> {
    let mut values_in_u64 = vec![];
    if values.len() != 0 {
        let values_a: Vec<&str> = values.split(',').collect();
        values_in_u64 = values_a
            .iter()
            // .map(|public_a| public_a.parse::<u64>().unwrap())
            .map(|public_a| public_a.parse::<u64>().expect("parse fail"))
            .collect();
    };
    assert!(
        (values_in_u64.len() == 4),
        "expected len of values_in_u64 to be exactly 4 but received {}",
        values_in_u64.len()
    );
    assert!(
        values_in_u64.len() == 4,
        "The input is not a U256, please check your input!"
    );
    let elements = from_vec(values_in_u64);
    return ElementDigest::new(elements.try_into().unwrap())
        .as_bytes()
        .to_vec();
}

// convert a [u8;32]
pub fn to_u64array(values: String) -> Vec<u64> {
    use utils_core::{Deserializable, SliceReader};

    let mut values_in_u8 = vec![];
    if values.len() != 0 {
        let values_a: Vec<&str> = values.split(',').collect();
        values_in_u8 = values_a
            .iter()
            // .map(|public_a| public_a.parse::<u64>().unwrap())
            .map(|public_a| public_a.parse::<u8>().expect("parse fail"))
            .collect();
    };
    assert!(
        (values_in_u8.len() == 32),
        "expected len of values_in_u8 to be exactly 32 but received {}",
        values_in_u8.len()
    );

    let mut reader = SliceReader::new(&values_in_u8);
    let convert_result = ElementDigest::read_from(&mut reader).unwrap();

    return as_u64(convert_result).to_vec();
}

/// HELPER
pub fn from_vec(origin: Vec<u64>) -> Vec<BaseElement> {
    let mut res: Vec<BaseElement> = Vec::new();
    for i in 0..origin.len() {
        res.push(math::fields::f64::BaseElement::from(origin[i as usize]))
    }
    let result = res.try_into().unwrap();
    return result;
}

// GLOBAL CONSTANTS
// ================================================================================================

pub const MAX_CONTEXT_DEPTH: usize = 16;
pub const MAX_LOOP_DEPTH: usize = 8;

#[test]
fn hash_elements() {
    // use libc_print;
    // let elements: [BaseElement; 8] = rand_array();
    let salted1 = String::from("fa160588c39c81a728a67f99d40b14fa341b5fabb87471528833897fe6a7a965");
    let salted2 = String::from("6ac31d152c204315e18e5adfeb66e69fdd395a8f382a8e8db3d589135ac2ade7");
    let salted1_encode = hex::decode(salted1).unwrap();
    //250,22,5,136,195,156,129,167,40,166,127,153,212,11,20,250,52,27,95,171,184,116,113,82,136,51,137,127,230,167,169,101

    let salted2_encode = hex::decode(salted2).unwrap();
    //106,195,29,21,44,32,67,21,225,142,90,223,235,102,230,159,221,57,90,143,56,42,142,141,179,213,137,19,90,194,173,231
    // libc_print::libc_println!("salted1_encode is {:?}",salted1_encode);
    // libc_print::libc_println!("salted2_encode is {:?}",salted2_encode);

    let para_1 = to_u64array("250,22,5,136,195,156,129,167,40,166,127,153,212,11,20,250,52,27,95,171,184,116,113,82,136,51,137,127,230,167,169,101".to_string());
    let para_2 = to_u64array("106,195,29,21,44,32,67,21,225,142,90,223,235,102,230,159,221,57,90,143,56,42,142,141,179,213,137,19,90,194,173,231".to_string());

    // libc_print::libc_println!("1 is {:?}",para_1);//12070100839944230650,18020041016752449064,5940657719976336180,7325570877318837128
    // libc_print::libc_println!("2 is {:?}",para_2);//1532103671941022570,11522009859924594401,10200136628452342237,16694213085862942131

    let elements = String::from("11552303281443191110,9931840600877352623,2109569013263734308,5271959068384342092,12988393255616004850,10794669482586504578,17960664921315273404,17632219554368387239");

    let result = rescue(elements);// 14541782993006284926,8635774954518030733,15730819215817492770,2795686671592326589
    // libc_print::libc_println!("result is {:?}",result);
    let result_u8 = to_u8array("14541782993006284926,8635774954518030733,15730819215817492770,2795686671592326589".to_string());
    // libc_print::libc_println!("result hash is {:?}",hex::encode(result_u8));

}
