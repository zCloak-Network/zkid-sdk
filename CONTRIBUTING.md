# Contributing

## Table of contents

- [Development](#development)
- [Submitting a Pull Request](#submitting-a-pull-request)
  - [After your pull request is merged](#after-your-pull-request-is-merged)

## Development

1. Clone the repo locally, via `git clone https://github.com/zCloak-Network/zkid-sdk.git`
2. Ensure that you have a recent version of Node.js, for development purposes [Node 16](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/getting-started/install) is required.
4. Install the dependencies by running `yarn`
5. Test the spec files via `yarn test`
6. Build the everything via `yarn build`

## Submitting a Pull Request

Before you submit your Pull Request (PR) consider the following guidelines:

- Make your changes in a new git branch:

  ```shell
  git checkout -b my-branch master
  ```

- Create your feature or patch, and **including appropriate test cases**.
- Run `yarn changeset` in the root and describe your changes. The files in `.changeset` must commit because it be used during release.
- Run the full test suite and ensure that all tests pass.
- Commit your changes using a descriptive commit message.

  ```shell
  git commit -a
  ```

  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

- Push your branch to GitHub:

  ```shell
  git push origin my-branch
  ```

- In GitHub, send a pull request to `zkid-sdk:master`.
- If we suggest changes then:

  - Make the required updates.
  - Re-run the test suites to ensure tests are still passing.
  - Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

That's it! Thank you for your contribution!

### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the master (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```shell
  git push origin --delete my-branch
  ```

- Check out the master branch:

  ```shell
  git checkout master -f
  ```

- Delete the local branch:

  ```shell
  git branch -D my-branch
  ```

- Update your master with the latest upstream version:

  ```shell
  git pull --ff upstream master
  ```
