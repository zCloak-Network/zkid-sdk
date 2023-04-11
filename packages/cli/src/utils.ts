// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import inquirer from 'inquirer';

export async function passwordPrompt(description: string, validate?: (input: string) => boolean) {
  const passwordPrompt = await inquirer.prompt<{ password: string }>([
    {
      type: 'password',
      name: 'password',
      message: description,
      mask: '*',
      validate: (input) => {
        if (typeof input === 'string' && input.length > 0) {
          return validate ? validate(input) : true;
        }

        return false;
      }
    }
  ]);

  return passwordPrompt.password;
}
