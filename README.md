# grmc

> git release management command-line tool

[![npm version](https://badge.fury.io/js/grmc.svg)](https://badge.fury.io/js/grmc)
[![Build Status](https://travis-ci.com/gloriaJun/github-release-cli.svg?branch=main)](https://travis-ci.com/gloriaJun/github-release-cli)

## Functions

- Create Pull Request
- Merge Pull Request
- Create tag
- Create Release note
  - write release note by pr list

## Installation

```bash
yarn add -D grmc
npm install --save-dev grmc
```

### Get Git Access Token

- https://github.com/settings/tokens

> git token needs the read and write auth

### Create the .env.local

```bash
BASE_URL=https://api.github.com
TOKEN=
REPO_OWNER=
REPO_NAME=

# branch info
#MASTER=main
#DEVELOP=develop
#RELEASE=release
#HOTFIX=hotfix
```

## Usage

### Run Cli

```bash
$ grmc rel major -c .env.local
🚀 Start create pr & merge process
? Do you want to create pr? (Y/n) Y
? Choose the target branch release/1.0.0
? Create PR to 'main' branch Yes
? Merge PR to 'main' branch Yes
? Create PR to 'feature/cli' branch No


======================================
Pull Request & Merge Configuration
======================================
Release Branch:      release/1.0.0

Target Branch List
  - main:            PR(Y), Merge(Y)
  - feature/cli:     PR(N), Merge(N)


? Do you want to continue? (Y/n)
```

#### Run Only Create Release Note

```bash
$ grmc rel major -c .env.local
🚀 Start create pr & merge process
? Do you want to create pr? No

🚀 Start create tag and release note from main
⠧ Loading generate release content...

✔ generated the release note content
------------------------------------
#### Changelogs
* ci: add build script (#18) bae63f4

#### Milestone
https://github.com/gloriaJun/github-release-cli/milestone/1
------------------------------------
? Do you want to create the tag (v0.2.0 -> v0.3.0) ? Yes
✔ Success release v0.3.0 from main 🎉🎉🎉
🔗  https://github.com/gloriaJun/github-release-cli/releases/tag/v0.3.0
✨  Done in 73.98s.
```
