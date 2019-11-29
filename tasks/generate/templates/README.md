# Library starter

> npm library starter with documentation, example, linting and build ready

## Usage

```bash
# clone repo
git clone git@github.com:quentinneyraud/library-starter.git my-project
cd my-project

# install dependencies
yarn
```

## Init

```bash
# Init and follow instructions
npm run init

# Clean git history (optional)
rm -rf .git
git init
git add .
git commit -m 'Initial commit'
```

## Write your library

```bash
npm run dev
```

Write your library in `src` folder and test it with livereload on `localhost:1234`

## Write documentation

```bash
npm run docs
```

Write documentation in the `docs` folder and see it with livereload on` localhost: 3000`

## Build

```bash
npm run build
```

## Deploy on npm

1. [Publish your own NPM package](https://hackernoon.com/publish-your-own-npm-package-946b19df577e)

```bash
npm version [patch | minor | major]
npm publish
```

## Deploy documentation

1. Set up [GitHub Pages](https://help.github.com/en/articles/configuring-a-publishing-source-for-github-pages) to use `/docs` folder

2. `git push`

Or use other [Deploy](https://docsify.js.org/#/deploy)

## Other links

- [Docsify](https://docsify.js.org/#/)  
- [Rollup](https://rollupjs.org/guide/en/)  
- [Parcel](https://parceljs.org/)
