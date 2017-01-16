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
      target: 'categories',
      pager: 5
    }),
    new CollectionPageGenerator({
      target: 'tags',
      pager: 10
    })
  ],
  ...
```

## Options

- `type`(def:`'LIST'`)  
  Spwcify the contents type
- `target`(def:`''`)  
  Specify the keys to collect in each front matter data
- `pager`(def:`20`)  
  Specify how many items to display per page
- `title`(def:)  
  todo...
- `description`(def:)  
  todo...

## License

MIT
