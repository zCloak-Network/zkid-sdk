# @zcloak/cli

🤓 Sweet method to be an attester.

- 🎩 Generate a DID account
- 🔍 Query DID Document and cType
- ✍️  Build and sign VC
- 📮 Send an encrypted message using our message communication channel

## Tutorial

In this section, I would show you how to issue a credential with CLI.

### Step 1
Create a ctype on our [credential platform](https://cred.zkid.app).

### Step 2
Use the `zkid vc raw` command to build a raw credential.

```bash
zkid vc raw -c CTYPE_HASH --content CTYPE_CONTENT --claimer CLAIMER_DID_URL
```
This command can return a raw credential of type string.

### Step 3
Use the `zkid vc sign` command to build a verifiable credential (VC).

```bash
zkid vc sign -k /path/to/DID_KEYS_FILE.json  -r 'RAW_CREDENTIAL'
```
This command can return a signed VC.

### Step 4
Use the `zkid vc encrypt` command to encrypt VC.

```bash
zkid vc encrypt -k /path/to/DID_KEYS_FILE.json  -v 'VC'
```
This command can return an encrypted message, with the signed VC being a part of the message.

### Step 5
Use the `zkid message` command to send an encrypted message.

```bash
zkid message -s 'MESSAGE'
```
This command can send the encrypted message to our server, and our back-end service can push the message to the credential platform.
The claimer can decrypt this message and get your issued credential.