# @zcloak/cli

## Usage

**Get claimer Did object**

Using this command to generate a did object json file, if using `--dry-run` flag, it will print output to console.
```bash
zkid-cli did --did did:zk:0x1234abcd...67890fghl --dry-run
```

**Get ctype**

This command will return a ctype object json file when giving a ctype hash, if using `--dry-run` flag, it will print output to console.
```bash
zkid-cli ctype --ctypeHash 0x123abcd...67890kjsne --dry-run
```

**Build Raw**

This command can help you build a raw object.
```bash
zkid-cli raw --contents name claimer age 24 ... --ctypeHash 0x123abcd...67890rtyu --owner did:zk:0x1234abcd...67890hjkl --hashType Blake3
```

**Build VC from Raw and Send it to Claimer**

Using this command, you can build a VC from raw object and send vc to claimer.

Required:
1. `--attester did:zk:0x1234abcd...5678defg` this flag indicates who will execute sending credential operation
2. `--raw /path/to/raw.json ( or raw object {...})` this flag indicates what raw object will be uesed

Options:
1. `--rawCredHashType` this flag indicates that what crypto method will use when build a raw credential, default is keccak256
2. `--isPublic` this flag indicates that what type of credential you will create, default is false, that is private credential

```bash
zkid-cli sendVCFromRaw --attester did:zk:0x1234abcd...5678defg --raw /path/to/raw.json ( or raw object {...})
```

**Send VC to Claimer**

Build a VC (default is private vc) and then send it to claimer, we need the flowing flags:

Required:
1. `--attester did:zk:0x1234abcd...5678defg` this flag indicates who will execute sending credential operation
2. `--claimer did:zk:0x5678defg...1234abcd` this flag indicates who can receive credential
3. `--ctypeHash 0x123abcd...67890rtyu` this flag indicates that what credential type attetser will use
4. `--content /path/to/content.csv ( or name john age 24 ...)` this flag indicates that what raw content will include, you can pass a csv file or a content string.

Options:
1. `--rawHashType Blake3` this flag indicates that what crypto method will use when build a raw, default is blake3
2. `--rawCredHashType` this flag indicates that what crypto method will use when build a raw credential, default is keccak256
3. `--isPublic` this flag indicates that what type of credential you will create, default is false, that is private credential

```bash
zkid-cli sendVC --attester did:zk:0x1234abcd...5678defg --claimer did:zk:0x5678defg...1234abcd --ctypeHash 0x123abcd...67890rtyu --content /path/to/content.csv ( or name john age 24 ...)
```
