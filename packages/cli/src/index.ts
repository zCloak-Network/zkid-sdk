// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { mnemonicGenerate } from '@zcloak/crypto';

import { buildRawCredential } from './commands/buildRawCredential';
import { buildVC } from './commands/buildVC';
import { generate } from './commands/generate';
import { issueVCs } from './commands/issueVC';
import { queryCType } from './commands/queryCType';
import { queryDidDoc } from './commands/queryDidDoc';

export async function main() {
  await yargs(hideBin(process.argv))
    .scriptName('zkid')
    .usage('$0 <cmd> [args]')
    .wrap(null)
    .locale('en')
    .option('did-resolver', {
      type: 'string',
      description: 'URL for the DID resolver. e.g. prod',
      default: 'prod'
    })
    // .option('issue-url', {
    //   type: 'string',
    //   description: 'URL for sending the issued credentials by message. e.g. https://did-service.zkid.app/message'
    // })
    // .option('output', {
    //   alias: 'o',
    //   type: 'string',
    //   description: 'output file with path, like /path/to/FILE_NAME.json'
    // })
    .command(
      'generate',
      'Generate an encrypted DID-keys file using a mnemonic phrase',
      (yargs) => {
        return (
          yargs
            // .option('output', {
            //   alias: 'o',
            //   type: 'string',
            //   description: 'Output file path for encrypted DID-keys (default: did:zk:<...>.json in the current directory)'
            // })
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
            })
          // .option('dry-run', {
          //   alias: 'r',
          //   type: 'boolean',
          //   description: 'Perform a dry run without actually generating the private key file.',
          //   default: false
          // })
        );
      },
      (argv) => {
        return generate(argv.deriveIndex, argv.mnemonic, argv.showMnemonic);
      }
    )
    // .command(
    //   'issue <file>',
    //   'Issue credentials by reading data from a file',
    //   (yargs) => {
    //     return yargs.positional('file', {
    //       type: 'string',
    //       description: 'Path to the input file',
    //       demandOption: 'You must provide a file path'
    //     });
    //   },
    //   (argv) => {
    //     // TODO issue
    //     console.log(`Issueing credentials from ${argv.file}...`);
    //   }
    // )
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
        queryDidDoc(argv.didResolver, argv.query as string);
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
      'Issue VC to claimer',
      (yargs) => {
        return yargs
          .option('attester-mnemonic', {
            alias: 'am',
            type: 'string',
            description: "attester mnemonic json file { mnemonic: 'xxx' }, like /path/to/mnemonic.json",
            default: ''
          })
          .option('claimer-did', {
            alias: 'c',
            type: 'string',
            description: "claimer DID URL or path to claimers' did url csv file which must inclued a DID column"
          })
          .option('ctype-hash', {
            alias: 'cth',
            type: 'string',
            description: 'ctype hash'
          })
          .option('content', {
            alias: 'ct',
            type: 'string',
            description: "ctype content json file { name: 'vss', age: 24 }, like /path/to/content.json"
          })
          .option('raw-hash-type', {
            alias: 'rht',
            type: 'string',
            description: 'what crypto method will use when building a raw',
            default: 'Blake3'
          })
          .option('raw-cred-hash-type', {
            alias: 'rcht',
            type: 'string',
            description: 'what crypto method will use when building a raw credential',
            default: 'Keccak256'
          })
          .option('is-public', {
            alias: 'p',
            type: 'number',
            description: 'what type of credential you will create. The default is false, that is private credential',
            default: 0
          });
      },
      (argv) => {
        issueVCs(
          argv.didResolver,
          argv.attesterMnemonic,
          argv.claimerDid,
          argv.ctypeHash,
          argv.content,
          argv.rawHashType,
          argv.rawCredHashType,
          argv.isPublic
        );
      }
    )
    .command(
      'rc',
      'Build a raw credential (raw => rawCredential)',
      (yargs) => {
        return yargs
          .option('ctype-hash', {
            alias: 'c',
            type: 'string',
            description: 'ctype hash that you want to use',
            demandOption: true
          })
          .option('content', {
            type: 'string',
            description: 'crdential main content',
            demandOption: true
          })
          .option('claimer-did-url', {
            type: 'string',
            description: 'claimer did url',
            demandOption: true
          })
          .option('raw-hash', {
            type: 'string',
            describe: 'hash method that is used to built raw object'
          })
          .option('raw-credential-hash', {
            type: 'string',
            describe: 'hash method that is used to built rawCredential object'
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
      'vc',
      'Build Verifiable Credential from RawCredential (RawCredential => VC)',
      (yargs) => {
        return yargs
          .option('raw-credential', {
            alias: 'r',
            type: 'string',
            describe: 'Raw-credential string object or file with path',
            demandOption: true
          })
          .option('attester-mnemonic', {
            alias: 'a',
            type: 'string',
            describe: 'Attester mnemonic string or json file',
            demandOption: true
          })
          .option('is-public', {
            alias: 'p',
            type: 'boolean',
            describe: 'Build a public vc or private vc, default is private vc',
            default: false
          });
      },
      (argv) => {
        buildVC(argv.didResolver, argv.attesterMnemonic, argv.rawCredential, argv.isPublic);
      }
    )
    // .command(
    //   'message',
    //   'Encryption and decryption communication with message',
    //   (yargs) => {
    //     return yargs
    //       .option('message-type', {
    //         alias: 'm',
    //         type: 'string',
    //         describe: 'communication message type',
    //         demandOption: true
    //       })
    //       .option('vc', {
    //         alias: 'v',
    //         type: 'string',
    //         describe: 'vc string or json file',
    //         demandOption: true
    //       })
    //       .option('attester-mnemonic', {
    //         alias: 'a',
    //         type: 'string',
    //         describe: 'Attester mnemonic string or json file',
    //         demandOption: true
    //       });
    //   },
    //   (argv) => {}
    // )
    .demandCommand(1, 'You must provide a valid command.')
    .help()
    .strict().argv;
}
