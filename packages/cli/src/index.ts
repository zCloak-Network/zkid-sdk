// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { mnemonicGenerate } from '@zcloak/crypto';

import { generate } from './commands/generate';
import { queryCType } from './commands/queryCType';
import { queryDidDoc } from './commands/queryDidDoc';

export async function main() {
  await yargs(hideBin(process.argv))
    .scriptName('zkid')
    .usage('$0 <cmd> [args]')
    .wrap(120)
    .option('did-resolver', {
      type: 'string',
      description:
        'URL for the DID resolver to upload the generated DID document. e.g. https://did-service.zkid.app/did'
    })
    .option('issue-url', {
      type: 'string',
      description: 'URL for sending the issued credentials by message. e.g. https://did-service.zkid.app/message'
    })
    .option('env', {
      alias: 'e',
      type: 'string',
      description: 'indicate query enviroment',
      default: 'dev'
    })
    .option('output', {
      alias: 'o',
      type: 'string',
      description: 'output file with path, like /path/to/FILE_NAME.json'
    })
    .command(
      'generate',
      'Generate an encrypted DID-keys file using a mnemonic phrase',
      (yargs) => {
        return yargs
          .option('output', {
            alias: 'o',
            type: 'string',
            description: 'Output file path for encrypted DID-keys (default: did:zk:<...>.json in the current directory)'
          })
          .option('mnemonic', {
            alias: 'm',
            type: 'string',
            description: `Mnemonic phrase to generate the DID-keys (a new mnemonic will be generated if not provided).
e.g.
${mnemonicGenerate(12)}
`
          })
          .option('derive-index', {
            alias: 'd',
            type: 'number',
            description: 'Derivation path for the mnemonic (default: 0).',
            default: 0
          })
          .option('show-mnemonic', {
            alias: 's',
            type: 'boolean',
            description: 'Display the mnemonic phrase after generating the DID-keys.',
            default: false
          })
          .option('dry-run', {
            alias: 'r',
            type: 'boolean',
            description: 'Perform a dry run without actually generating the private key file.',
            default: false
          });
      },
      (argv) => {
        return generate(argv.deriveIndex, argv.mnemonic, argv.output, argv.showMnemonic, argv.dryRun);
      }
    )
    .command(
      'issue <file>',
      'Issue credentials by reading data from a file',
      (yargs) => {
        return yargs.positional('file', {
          type: 'string',
          description: 'Path to the input file',
          demandOption: 'You must provide a file path'
        });
      },
      (argv) => {
        // TODO issue
        console.log(`Issueing credentials from ${argv.file}...`);
      }
    )
    .command(
      'did',
      'Query a DID Document',
      (yargs) => {
        return yargs.option('query', {
          alias: 'q',
          type: 'string',
          description: 'query did document'
        });
      },
      (argv) => {
        queryDidDoc(argv.env, argv.query as string, argv.output as string);
      }
    )
    .command(
      'ctype',
      'Query a ctype object',
      (yargs) => {
        return yargs.option('ctype-hash', {
          alias: 'c',
          type: 'string',
          description: 'ctype hash',
          default: ''
        });
      },
      (argv) => {
        queryCType(argv.env, argv.ctypeHash, argv.output);
      }
    )
    .demandCommand(1, 'You must provide a valid command.')
    .help()
    .strict().argv;
}
