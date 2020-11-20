# github-release-cli


## Usage

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
