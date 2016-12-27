# Collection Page Generator

A [Diz](https://github.com/nju33/diz) plugin that create a list page

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

## Install

```bash
$ yarn add -D diz-plugin-collection-page-generator
$ npm i -D diz-plugin-collection-page-generator
```

## Usage

```js
  ...,
  plugins: [
    new CollectionPageGenerator({
      collectionKey: 'collectionKey'
    })
  ],
  ...
```

## Options

- `type`(def:`'LIST'`)  
  Spwcify the contents type
- `collectionKey`(def:`''`)  
  Specify the keys to collect in each front matter data
- `pager`(def:`20`)  
  Specify how many items to display per page
- `titleTemplate`(def:)  
  todo...
- `descriptionTemplate`(def:)  
  todo...

## License

MIT
