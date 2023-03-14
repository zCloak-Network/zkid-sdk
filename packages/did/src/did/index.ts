// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Service } from '@zcloak/did-resolver/types';

import { DidChain } from './chain';

/**
 * A class to use did keys and set document.
 *
 * @see helpers
 */
export class Did extends DidChain {
  public addService(service: Service): void {
    if (!this.service) {
      this.service = new Map();
    }

    this.service.set(service.id, service);
  }
}
