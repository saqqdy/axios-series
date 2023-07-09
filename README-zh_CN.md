<div style="text-align: center;" align="center">

# axios-series

一个让 axios 支持顺序返回的扩展

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![tree shaking][tree-shaking-image]][tree-shaking-url]
![typescript][typescript-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![gzip][gzip-image]][gzip-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

### **[API 文档](https://www.saqqdy.com/axios-series)** • **[更新日志](./CHANGELOG.md)**

**使用其他语言阅读：[English](./README.md) | 简体中文**

</div>

## 安装

```bash
# 使用pnpm
$ pnpm install axios-series

# 使用npm
$ npm install axios-series --save
```

## 使用

### 为 axios 赋上 serializer 功能

```js
import axios from 'axios'
import axiosSeries from 'axios-series'

const http = axiosSeries(axios, {
  // unique: false,
  // orderly: true
})

export default http
```

### 或者把 serializer 功能赋在 axios 实例上

```js
import axios from 'axios'
import axiosSeries from 'axios-series'

const instance = axios.create({
  withCredentials: true
})
const http = axiosSeries(instance, {
  // unique: false,
  // orderly: true
})

export default http
```

## Behavior

## API Reference

### options

serializer options

| Parameters | Description                                     | Type                                                   | Optional   | Required | Default |
| ---------- | ----------------------------------------------- | ------------------------------------------------------ | ---------- | -------- | ------- |
| unique     | make request unique, clear all similar requests | `boolean`                                              | true/false | false    | false   |
| orderly    | resolve results orderly                         | `boolean`                                              | true/false | false    | true    |
| onCancel   | callback function for cancel requests           | `(err: any, config: InternalAxiosRequestConfig): void` | -          | false    | null    |

### axiosSeries

axios serializer wrapper function

- Since: `1.0.0`

- Arguments:

| Parameters | Description             | Type                | Optional            | Required | Default |
| ---------- | ----------------------- | ------------------- | ------------------- | -------- | ------- |
| instance   | axios or axios instance | `AxiosInstance`     | axios/axiosInstance | true     | -       |
| options    | serializer options      | `SerializerOptions` | -                   | false    | -       |

- Returns: new axios instance with serializer

- Example:

```ts
const http = axiosSeries(instance, {
  // unique: false,
  // orderly: true
})
```

- Types:

```ts
function axiosWithSeries<T = any, R = AxiosResponse<T>, D = any>(
  config: SerializerRequestOptions<D>
): Promise<R>
function axiosWithSeries<T = any, R = AxiosResponse<T>, D = any>(
  url: string,
  config?: SerializerRequestOptions<D>
): Promise<R>
```

### axiosSeries.clear

clear all series

- Since: `1.0.0`

- Arguments: `none`

- Returns: 'none'

- Example:

```ts
const http = axiosSeries(instance, {})

http.clear()
```

- Types:

```ts
type clear = () => void
```

### axiosSeries.series

all waiting series

- Since: `1.0.0`

- Arguments: `none`

- Returns: 'WaitingList'

- Example:

```ts
const http = axiosSeries(instance, {})

console.log(http.series) // []
```

- Types:

```ts
declare interface Series {
  promiseKey: symbol
  promise: Promise<any>
  source: CancelTokenSource
  abortController: AbortController
}

declare type WaitingList = Record<string, Series[]>
```

### 使用 unpkg CDN

```html
<script src="https://unpkg.com/axios-series@1.0.0/dist/index.global.prod.js"></script>
```

## 问题和支持

Please open an issue [here](https://github.com/saqqdy/axios-series/issues).

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/axios-series.svg?style=flat-square
[npm-url]: https://npmjs.org/package/axios-series
[codacy-image]: https://app.codacy.com/project/badge/Grade/f70d4880e4ad4f40aa970eb9ee9d0696
[codacy-url]: https://www.codacy.com/gh/saqqdy/axios-series/dashboard?utm_source=github.com&utm_medium=referral&utm_content=saqqdy/axios-series&utm_campaign=Badge_Grade
[tree-shaking-image]: https://badgen.net/bundlephobia/tree-shaking/axios-series
[tree-shaking-url]: https://bundlephobia.com/package/axios-series
[typescript-url]: https://badgen.net/badge/icon/typescript?icon=typescript&label
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/axios-series.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/axios-series?branch=master
[download-image]: https://img.shields.io/npm/dm/axios-series.svg?style=flat-square
[download-url]: https://npmjs.org/package/axios-series
[gzip-image]: http://img.badgesize.io/https://unpkg.com/axios-series/dist/index.global.prod.js?compression=gzip&label=gzip%20size:%20JS
[gzip-url]: http://img.badgesize.io/https://unpkg.com/axios-series/dist/index.global.prod.js?compression=gzip&label=gzip%20size:%20JS
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_axios-series
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_axios-series
