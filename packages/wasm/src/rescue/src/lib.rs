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
/// * `inputs` specifies the rescue input, the inputs should be a u64 array string, like: "12331231203,123949053121,39018241409...."
/// *  Return the hash result Vec<u64>
pub fn u64_string_rescue(values: String) -> Vec<u64> {
    let mut values_in_u64 = vec![];
    if values.len() != 0 {
        let values_a: Vec<&str> = values.split(',').collect();
        values_in_u64 = values_a
            .iter()
            // .map(|public_a| public_a.parse::<u64>().unwrap())
            .map(|public_a| public_a.parse::<u64>().expect("parse fail"))
            .collect();
    };
    if values_in_u64.len() < 8 {
        values_in_u64.push(1);
        while (values_in_u64.len() < 8) {
            values_in_u64.push(0);
        }
    } else if (values_in_u64.len() % 4 == 3) {
        values_in_u64.push(1);
    } else if (values_in_u64.len() % 4 == 0) {
    } else {
        values_in_u64.push(1);
        while (values_in_u64.len() % 4 != 0) {
            values_in_u64.push(0);
        }
    }

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
            let mut drain_4_element: Vec<BaseElement> =
                elements.drain(elements.len() - 4..).collect();
            drain_4_element.append(&mut a);
            to_be_hash = crypto::hashers::Rp64_256::hash_elements(&drain_4_element);
        }
        result = to_be_hash;
    };

    return as_u64(result).to_vec();
}

/// Executes the `rescue` fucntion and returns the rescue hash result.
/// The inputs should be a u64vec(BigUint64Array)
pub fn u64a_rescue(values: Vec<u64>) -> Vec<u64> {
    let mut values_in_u64 = values;
    if values_in_u64.len() < 8 {
        values_in_u64.push(1);
        while (values_in_u64.len() < 8) {
            values_in_u64.push(0);
        }
    } else if (values_in_u64.len() % 4 == 3) {
        values_in_u64.push(1);
    } else if (values_in_u64.len() % 4 == 0) {
    } else {
        values_in_u64.push(1);
        while (values_in_u64.len() % 4 != 0) {
            values_in_u64.push(0);
        }
    }

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
            let mut drain_4_element: Vec<BaseElement> =
                elements.drain(elements.len() - 4..).collect();
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

/// convert a [u64;4] hash result(BigUint64Array) to [u8;32](Uint8Array)
pub fn u64a_to_u8a(values: Vec<u64>) -> Vec<u8> {
    let values_in_u64 = values;
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

/// convert a [u8;32](Uint8Array) hash result to [u64;4](BigUint64Array)
pub fn u8a_to_u64a(values: Vec<u8>) -> Vec<u64> {
    use utils_core::{Deserializable, SliceReader};

    let values_in_u8 = values;
    assert!(
        (values_in_u8.len() == 32),
        "expected len of values_in_u8 to be exactly 32 but received {}",
        values_in_u8.len()
    );

    let mut reader = SliceReader::new(&values_in_u8);
    let convert_result = ElementDigest::read_from(&mut reader).unwrap();

    return as_u64(convert_result).to_vec();
}

/// convert a [u64;4] string hash result to [u8;32](Uint8Array)
pub fn string_to_u8array(values: String) -> Vec<u8> {
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

/// convert a [u8;32](Uint8Array) string hash result to [u64;4](BigUint64Array)
pub fn string_to_u64array(values: String) -> Vec<u64> {
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
