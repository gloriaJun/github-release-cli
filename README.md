# github-release-cli


## Usage

### Add .env file

```bash
BASE_URL=https://api.github.com
TOKEN=
REPO_OWNER=
REPO_NAME=

# branch info
MASTER=
DEVELOP=
RELEASE=
HOTFIX=
```

### Run Cli

```bash
$ node ./dist/src/index.js release .env.local
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



