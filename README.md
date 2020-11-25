# grmc

> git release management command-line tool

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
$ grmc release .env.local
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
