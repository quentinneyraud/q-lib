# Library starter

> CLI tool to create library project with documentation, local development server, eslint and build ready (minified, polyfilled)

## Usage

```bash
# Install package and create project
npm install -g @qneyraud/q-lib
q-lib create-new [directory]

# Or use npx
npm @qneyraud/q-lib create-new [directory]
```

Then, follow instructions

## Features

### Eslint

```bash
npm run lint
```

Personal config is extended by default but it can be changed in `.eslintrc.js`.

### Example for testing in development

```bash
npm run dev
```

Go to `http://localhost:1234` to test your code.  
Exported functions in `src/index.js` are imported `example/index.js` so you can test your library with live-reload.

### Build polyfilled version

Create polyfilled version of your library for older browsers. Edit `.babelrc` browsers target to  what you need.

### Documentation


```bash
npm run docs
```

Go to `http://localhost:3000` to view your documentation.  
Write your documentation in markdown in `docs/README.md`. See [Docsify documentation](https://docsify.js.org/#/) for configuration and examples.

## Build

```bash
yarn build
```

## Deploy on npm

```bash
npm version [patch | minor | major]
npm publish
```

## Deploy documentation

1. Set up [GitHub Pages](https://help.github.com/en/articles/configuring-a-publishing-source-for-github-pages) to use `/docs` folder

2. `git push`

Or use other [Deploy methods](https://docsify.js.org/#/deploy)

## Resources links

- [Docsify](https://docsify.js.org/#/)  
- [Rollup](https://rollupjs.org/guide/en/)  
- [Parcel](https://parceljs.org/)
- [Babel-preset-env](https://babeljs.io/docs/en/babel-preset-env)
- [Eslint](https://eslint.org/)
