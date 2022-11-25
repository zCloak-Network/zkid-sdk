// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BaseCType } from './types';
import { validateSubject, validateSubjectPartial } from './validate';

describe('validate', (): void => {
  describe('validate subject', (): void => {
    it('validate subject', (): void => {
      const ctype: BaseCType = {
        title: 'Test',
        description: 'Test',
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          age: {
            type: 'integer'
          },
          no: {
            type: 'string'
          }
        },
        required: ['name', 'age']
      };

      expect(
        validateSubject(ctype, {
          name: 'zCloak',
          age: 19
        }).valid
      ).toBe(true);
      expect(
        validateSubject(ctype, {
          name: 'zCloak',
          age: 19,
          no: '1234'
        }).valid
      ).toBe(true);
      expect(
        validateSubject(ctype, {
          name: 'zCloak',
          no: '1234'
        }).valid
      ).toBe(false);
    });

    it('validate subject with length', (): void => {
      const ctype: BaseCType = {
        title: 'Test',
        description: 'Test',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 12,
            minLength: 4
          },
          age: {
            type: 'integer',
            maximum: 12,
            minimum: 10
          },
          no: {
            type: 'string'
          }
        },
        required: ['name', 'age']
      };

      expect(
        validateSubject(ctype, {
          name: 'zCloak',
          age: 11
        }).valid
      ).toBe(true);
      expect(
        validateSubject(ctype, {
          name: 'zCloak',
          age: 19,
          no: '1234'
        }).valid
      ).toBe(false);
      expect(
        validateSubject(ctype, {
          name: 'z',
          age: 10,
          no: '1234'
        }).valid
      ).toBe(false);
      expect(
        validateSubject(ctype, {
          name: 'zCloak',
          no: '1234'
        }).valid
      ).toBe(false);
    });
  });

  describe('validate partial subject', (): void => {
    it('validate partial subject', (): void => {
      const ctype: BaseCType = {
        title: 'Test',
        description: 'Test',
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          age: {
            type: 'integer'
          },
          no: {
            type: 'string'
          }
        },
        required: ['name', 'age']
      };

      expect(
        validateSubjectPartial(ctype, {
          name: 'zCloak',
          age: 19
        }).valid
      ).toBe(true);
      expect(
        validateSubjectPartial(ctype, {
          name: 'zCloak',
          age: 19,
          no: '1234'
        }).valid
      ).toBe(true);
      expect(
        validateSubjectPartial(ctype, {
          name: 'zCloak',
          no: '1234'
        }).valid
      ).toBe(true);
    });

    it('validate subject with length', (): void => {
      const ctype: BaseCType = {
        title: 'Test',
        description: 'Test',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 12,
            minLength: 4
          },
          age: {
            type: 'integer',
            maximum: 12,
            minimum: 10
          },
          no: {
            type: 'string'
          }
        },
        required: ['name', 'age']
      };

      expect(
        validateSubjectPartial(ctype, {
          name: 'zCloak',
          age: 11
        }).valid
      ).toBe(true);
      expect(
        validateSubjectPartial(ctype, {
          name: 'zCloak',
          age: 19,
          no: '1234'
        }).valid
      ).toBe(false);
      expect(
        validateSubjectPartial(ctype, {
          name: 'z',
          age: 10,
          no: '1234'
        }).valid
      ).toBe(false);
      expect(
        validateSubjectPartial(ctype, {
          name: 'zCloak',
          no: '1234'
        }).valid
      ).toBe(true);
    });
  });

  describe('validate subject with array', (): void => {
    it('validate subject enum with array', (): void => {
      const ctype: BaseCType = {
        title: 'Test',
        description: 'Test',
        type: 'object',
        properties: {
          type: {
            type: 'array',
            maxItems: 3,
            items: {
              type: 'string',
              enum: ['1', '2', '4', '3']
            }
          }
        },
        required: ['type']
      };

      expect(
        validateSubject(ctype, {
          type: ['1', '2', '4']
        }).valid
      ).toBe(true);
      expect(
        validateSubject(ctype, {
          type: ['1', '2', '4', '3']
        }).valid
      ).toBe(false);
      expect(
        validateSubject(ctype, {
          type: ['1', '2', '5']
        }).valid
      ).toBe(false);
    });
  });
});
