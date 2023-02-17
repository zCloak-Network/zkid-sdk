// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export class InvalidDidError extends Error {
  constructor() {
    super('The DID supplied does not conform to valid syntax.');
  }
}

export class DidNotFoundError extends Error {
  constructor() {
    super('The DID Document not found.');
  }
}

export class RepresentationNotSupportedError extends Error {
  constructor() {
    super('representation not supported.');
  }
}
export class ServerResponseError extends Error {
  constructor(msg: string) {
    super(`An exception occurred on the server. ${msg}`);
  }
}
