// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { mnemonicGenerate } from '@zcloak/crypto';

import { buildRawCredential } from './commands/buildRawCredential';
import { encryptVcMessage } from './commands/encryptVcMessage';
import { generate } from './commands/generate';
import { issueWithMessage } from './commands/issueWithMessage';
import { queryCType } from './commands/queryCType';
import { queryDidDoc } from './commands/queryDidDoc';
import { signRawVC } from './commands/signRawVC';

export async function main() {
  await yargs(hideBin(process.argv))
    .scriptName('zkid')
    .usage('$0 <cmd> [args]')
    .wrap(null)
    .locale('en')
    .option('did-resolver', {
      type: 'string',
      description: 'URL for the DID resolver. e.g. https://did-service.zkid.app',
      default: 'https://did-service.zkid.app'
    })
    .command(
      'generate',
      'Generate an encrypted DID-keys file using a mnemonic phrase',
      (yargs) => {
        return yargs
          .option('mnemonic', {
            alias: 'm',
            type: 'string',
            description: `Mnemonic phrase to generate the DID-keys (a new mnemonic will be generated if not provided).e.g.${mnemonicGenerate(
              12
            )}`
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
          });
      },
      (argv) => {
        generate(argv.didResolver, argv.deriveIndex, argv.mnemonic, argv.showMnemonic);
      }
    )
    .command(
      'did',
      'Query a DID Document',
      (yargs) => {
        return yargs.option('query', {
          alias: 'q',
          type: 'string',
          description: 'Query did document'
        });
      },
      (argv) => {
        queryDidDoc(argv.didResolver, argv.query);
      }
    )
    .command(
      'ctype',
      'Query a ctype object',
      (yargs) => {
        return yargs.option('ctype-hash', {
          alias: 'c',
          type: 'string',
          description: 'Ctype hash',
          default: ''
        });
      },
      (argv) => {
        queryCType(argv.didResolver, argv.ctypeHash);
      }
    )
    .command(
      'issue',
      'Issue VC with encrypted message',
      (yargs) => {
        return yargs.option('message', {
          alias: 'm',
          type: 'string',
          describe: 'Encrypted vc message',
          demandOption: true
        });
        // .option('attester-mnemonic', {
        //   alias: 'am',
        //   type: 'string',
        //   description: "attester mnemonic json file { mnemonic: 'xxx' }, like /path/to/mnemonic.json",
        //   default: ''
        // })
        // .option('claimer-did', {
        //   alias: 'c',
        //   type: 'string',
        //   description: "claimer DID URL or path to claimers' did url csv file which must inclued a DID column"
        // })
        // .option('ctype-hash', {
        //   alias: 'cth',
        //   type: 'string',
        //   description: 'ctype hash'
        // })
        // .option('content', {
        //   alias: 'ct',
        //   type: 'string',
        //   description: "ctype content json file { name: 'vss', age: 24 }, like /path/to/content.json"
        // })
        // .option('raw-hash-type', {
        //   alias: 'rht',
        //   type: 'string',
        //   description: 'what crypto method will use when building a raw',
        //   default: 'Blake3'
        // })
        // .option('raw-cred-hash-type', {
        //   alias: 'rcht',
        //   type: 'string',
        //   description: 'what crypto method will use when building a raw credential',
        //   default: 'Keccak256'
        // })
        // .option('is-public', {
        //   alias: 'p',
        //   type: 'number',
        //   description: 'what type of credential you will create. The default is false, that is private credential',
        //   default: 0
        // });
      },
      (argv) => {
        issueWithMessage(argv.didResolver, argv.message);
      }
    )
    .command('vc', 'Verifiable credential work flow', (yargs) => {
      return yargs
        .command(
          'raw',
          'Build a raw credential (raw => rawCredential)',
          (yargs) => {
            return yargs
              .option('ctype-hash', {
                alias: 'c',
                type: 'string',
                description: 'Ctype hash that you want to use',
                demandOption: true
              })
              .option('content', {
                type: 'string',
                description: 'Crdential main content',
                demandOption: true
              })
              .option('claimer-did-url', {
                type: 'string',
                description: 'Claimer did url',
                demandOption: true
              })
              .option('raw-hash', {
                type: 'string',
                describe: 'Hash method that is used to build raw object'
              })
              .option('raw-credential-hash', {
                type: 'string',
                describe: 'Hash method that is used to build rawCredential object'
              })
              .demandOption(
                ['ctype-hash', 'content', 'claimer-did-url'],
                'Please provide missing argument(s) to work with this tool'
              );
          },
          (argv) => {
            buildRawCredential(
              argv.didResolver,
              argv.content,
              argv.claimerDidUrl,
              argv.ctypeHash,
              argv.rawHash,
              argv.rawCredentialHash
            );
          }
        )
        .command(
          'sign',
          'Attester sign digest to build Verifiable Credential from RawCredential (RawCredential => VC)',
          (yargs) => {
            return yargs
              .option('raw-credential', {
                alias: 'r',
                type: 'string',
                describe: 'String type of Raw-credential',
                demandOption: true
              })
              .option('attester-identity', {
                alias: 'a',
                type: 'string',
                describe: 'Attester DID-Keys file with path or string of mnemonic phrase',
                demandOption: true
              })
              .option('is-public', {
                alias: 'p',
                type: 'boolean',
                describe: 'Public vc or private vc, false indicates private vc',
                default: false
              });
          },
          (argv) => {
            signRawVC(argv.didResolver, argv.attesterIdentity, argv.rawCredential, argv.isPublic);
          }
        )
        .command(
          'encrypt',
          'Build encryption communication message',
          (yargs) => {
            return yargs
              .option('vc', {
                alias: 'v',
                type: 'string',
                describe: 'String type of VC',
                demandOption: true
              })
              .option('attester-identity', {
                alias: 'a',
                type: 'string',
                describe: 'Attester DID-Keys file with path or string of mnemonic phrase',
                demandOption: true
              });
          },
          (argv) => {
            encryptVcMessage(argv.didResolver, argv.vc, argv.attesterIdentity);
          }
        );
    })
    .demandCommand(1, 'You must provide a valid command.')
    .help()
    .strict().argv;
}
