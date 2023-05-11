// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ConstraintField, ConstraintOperation } from '../types';

import MerkleTools from '@settlemint/merkle-tools';

export function prepareMembershipInOperation(value: ConstraintField[]) {
  let constraintProgram = '';
  let pushProgram = '';
  const readNumber = 'mem_load.99 exec.number_add ';

  for (let i = 0; i < value.length; i++) {
    pushProgram = `${pushProgram}push.${value[i]} swap `;
  }

  const checkInProgram = `
  push.0
  repeat.${value.length}
      dup.1 movup.3 eq
      if.true
          drop push.1
      end
  end
  if.true
      mem_load.101 push.1 and mem_store.101
  else
      push.0 mem_store.101
  end
  drop
  `;

  constraintProgram = `${readNumber} ${pushProgram} ${checkInProgram}`;

  return constraintProgram;
}

export function preprareMembershipOutOperation(value: ConstraintField[]) {
  let constraintProgram = '';
  let pushProgram = '';
  const readNumber = 'mem_load.99 exec.number_add ';

  for (let i = 0; i < value.length; i++) {
    pushProgram = `${pushProgram}push.${value[i]} swap `;
  }

  const checkOutProgram = `
  push.0
  repeat.${value.length}
      dup.1 movup.3 eq
      if.true
          drop push.1
      end
  end
  if.true
      push.0 mem_store.101
  else
      push.1 mem_load.101 and mem_store.101
  end
  drop
  `;

  constraintProgram = `${readNumber} ${pushProgram} ${checkOutProgram}`;

  return constraintProgram;
}
// // used to compare auth-proc for each leaf, push that into mem[301-303]
// function prepareAuthPath_and_read_to_mem(leavesCounts: any, field: any, number_to_save: any) {
//   let authProgram = prepareAuthPath(leavesCounts, field);
//   return `${authProgram}
//     mem_load.99 exec.number_add mem_store.${301 + number_to_save}`;
// }

// This function is used to prepare the authentication path for certain leaf, and prepare different code for different leaf
// due to the location (right/left) of a leaf when getting into a new layer.
export function prepareAuthPath(leavesCounts: number, leafIndex: number) {
  const treeOptions = {
    hashType: 'md5'
  };
  const merkleTools = new MerkleTools(treeOptions); // treeOptions is optional, we don't care much of the value here

  for (let i = 0; i < leavesCounts; i++) {
    // this just a helper function, the hash here doesn't mean anything
    merkleTools.addLeaf('05ae04314577b2783b4be98211d1b72476c59e9c413cfb2afa2f0c68e0d93911', false);
  }

  merkleTools.makeTree(false);
  const toDealWith = merkleTools.getProof(leafIndex);

  if (!toDealWith) {
    throw new Error('Can not find proof');
  }

  const needAuxPosition = toDealWith.map((value) => Object.keys(value)).flat();

  let programText = '';

  for (const element of needAuxPosition) {
    if (element === 'left') {
      programText = programText + 'adv_push.4' + ' swapw hmerge ';
    } else {
      programText = programText + 'adv_push.4' + ' hmerge ';
    }
  }

  // mem[100] is used to store roothash, compare to the pre-roothash; If not the same, the roothash is wrong
  programText = `
    exec.read_new_leaf exec.read_and_copy exec.multi_rphash dupw mem_storew.40 dropw adv_push.4 hmerge
    ${programText}
    padw mem_loadw.100 dupw mem_storew.100 dropw movup.4 eq swap movup.4 eq movup.2 movup.4
    eq movup.3 movup.4 eq and and and not
    if.true
        padw mem_storew.100 dropw
    end `;

  return programText;
}

// use to handle `Single String Constraint`
// TODO
export function prepareStringOperation(operation: ConstraintOperation, value: string) {
  let programText: string;

  let startCompareText = `push.${value.charCodeAt(value.length)} eq`;

  for (let i = value.length - 1; i >= 0; i--) {
    startCompareText = `${startCompareText} mem_load.101 and mem_store.101 push.${value.charCodeAt(i)} eq
        `;
  }

  startCompareText = `${startCompareText} mem_load.101 and mem_store.101`;

  let endCompareText = ` push.${value.charCodeAt(value.length)} eq`;

  for (let i = value.length - 1; i >= 0; i--) {
    endCompareText = `${endCompareText} mem_load.101 and mem_store.101 push.${value.charCodeAt(i)} eq
        `;
  }

  endCompareText = `${endCompareText} mem_load.101 and mem_store.101`;
  let dupProgram = '';
  let readToMemory = '';
  let j = 0;

  for (let i = value.length - 1; i >= 0; i--, j++) {
    readToMemory = `${readToMemory}  push.${value.charCodeAt(i)} push.${j + 301} mem_store
    `;
    dupProgram = `${dupProgram} dup.${value.length}`;
  }

  let dropText = '';

  for (let i = 0; i < value.length + 1; i++) {
    dropText = `${dropText} drop`;
  }

  switch (operation) {
    case 'contain':
      // 1. read advice_tape to memory, which start at 301
      // 2. the max compare time should be `mem[99] - (value).length - 1)` should stored on the second stack.
      // 3. the next address to be compared should stored on stack automatically.
      // 4. mem[300] use to store the compare result(init with 0), once found a success match, mem[300] should be 1. else 0
      // 5. mem[value.length + 301] use to store single compare result,every `while` should make it `1`
      programText = `
    mem_load.99 dup.0 push.${value.length} gte
    if.true
        push.0 mem_store.300
        sub.${value.length - 4}${readToMemory}    dup.0 push.1 gte
        while.true
            push.1 mem_store.${301 + value.length} ${dupProgram}
            push.301
            repeat.${value.length}
                dup.0 mem_load dup.0 dup.2 mem_store
                movup.2 eq mem_load.${301 + value.length} and mem_store.${301 + value.length}
                add.1
            end
            drop sub.1 swap drop
            mem_load.${301 + value.length} push.1 eq
            if.true
                push.1 mem_store.300
            end
            dup.0 push.1 gte
        end
        mem_load.300 mem_load.101 and mem_store.101 ${dropText}
    else
        dup.0 push.1 gte
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop push.0 mem_store.101
    end`;
      break;
    case 'uncontain':
      programText = `
    mem_load.99 dup.0 push.${value.length + 2} gte
    if.true
        push.1 mem_store.300
        sub.${value.length - 1}${readToMemory}    dup.0 push.1 gte
        while.true
            push.1 mem_store.${301 + value.length} ${dupProgram}
            push.301
            repeat.${value.length}
                dup.0 mem_load dup.0 dup.2 mem_store
                movup.2 eq mem_load.${301 + value.length} and mem_store.${301 + value.length}
                add.1
            end
            drop sub.1 swap drop
            mem_load.${301 + value.length} push.1 eq
            if.true
                push.0 mem_store.300
            end
            dup.0 push.1 gte
        end
        mem_load.300 mem_load.101 and mem_store.101 ${dropText}
    else
        dup.0 push.1 gte
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop push.0 mem_store.101
    end
            `;
      break;
    case 'start with':
      // here, mem_load.99 needs to be longer than the value.length
      // the first element is at the deepest of the stack.
      programText = `
    mem_load.99 dup.0 push.${value.length + 2} gte
    if.true
        sub.${value.length + 1}
        dup.0 push.1 gte
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop  ${startCompareText} mem_load.101 and mem_store.101 drop
    else
        dup.0 push.1 gte
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop push.0 mem_store.101 drop
    end`;
      break;
    case 'end with':
      // here, mem_load.99 needs to be longer than the value.length
      // the last element is on the top of the stack.

      programText = `
    mem_load.99 dup.0 push.${value.length + 2} gte
    if.true
        mem_store.99
        ${endCompareText}
        mem_load.99 sub.${value.length + 1}
        dup.0 push.1 gte
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop drop
    else
        dup.0 push.1 gte
        while.true
            swap drop sub.1 dup.0 push.1 gte
        end
        drop push.0 mem_store.101 drop
    end
            `;
      break;
    default:
      throw new Error('the string operation is wrong');
  }

  return programText;
}

// use to handle `Single Number Constraint`
export function prepareNumberOperationSingle(operation: ConstraintOperation, value: number) {
  let programText;
  const decimal = value.toString().split('.').length - 1;

  if (decimal > 1) throw new Error('decimal value has more than 1 digits');
  const multi = decimal === 0 ? 1 : 10;

  switch (operation) {
    case 'gt':
      programText = `push.${value * multi} gt`;
      break;
    case 'gte':
      programText = `push.${value * multi} gte`;
      break;
    case 'neq':
      programText = `push.${value * multi} neq`;
      break;
    case 'lte':
      programText = `push.${value * multi} lte`;
      break;
    case 'lt':
      programText = `push.${value * multi} lt`;
      break;
    default:
      throw new Error('error number compare operation');
  }

  programText = `
  mem_load.99 exec.number_add mul.${multi} ${programText} mem_load.101 and mem_store.101`;

  return programText;
}
