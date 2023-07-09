<div style="text-align: center;" align="center">

# axios-series

A tool to extend axios to return sequentially

When multiple requests are made to the same interface in a short period of time, axios-series can be useful if you need to ensure that the request executed first returns the results first

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

### **[Documentation](https://www.saqqdy.com/axios-series)** • **[Change Log](./CHANGELOG.md)**

**Read this in other languages: English | [简体中文](./README-zh_CN.md)**

</div>

- [axiosSeries](#axios-series)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Add serializer feature to axios](#add-serializer-feature-to-axios)
    - [or axios instance](#or-axios-instance)
  - [Behavior](#behavior)
    - [Option.unique](#unique)
    - [Option.orderly](#unique)
  - [API Reference](#api-reference)
    - [axiosSeries](#axiosseries)
    - [axiosSeries.clear](#axiosseriesclear)
    - [axiosSeries.series](#axiosseriesseries)
  - [Using unpkg CDN](#using-unpkg-cdn)
  - [Support & Issues](#support--issues)
  - [License](#license)

## Installing

```bash
# use pnpm
$ pnpm install axios-series

# use npm
$ npm install axios-series --save
```

## Usage

### Add serializer feature to axios

```js
import axios from 'axios'
import wrapper from 'axios-series'

const axiosSeries = wrapper(axios, {
  // unique: false,
  // orderly: true
})

export default axiosSeries
```

### or axios instance

```js
import axios from 'axios'
import wrapper from 'axios-series'

const instance = axios.create({
  withCredentials: true
})
const axiosSeries = wrapper(instance, {
  // unique: false,
  // orderly: true
})

export default axiosSeries
```

## Behavior

serializer options

| Parameters | Description                                     | Type                                                   | Optional   | Required | Default |
| ---------- | ----------------------------------------------- | ------------------------------------------------------ | ---------- | -------- | ------- |
| unique     | make request unique, clear all similar requests | `boolean`                                              | true/false | false    | false   |
| orderly    | resolve results orderly                         | `boolean`                                              | true/false | false    | true    |
| onCancel   | callback function for cancel requests           | `(err: any, config: InternalAxiosRequestConfig): void` | -          | false    | null    |

### unique

When multiple requests are made to the same interface (url is the same but data can be different) at the same time (or at short intervals), the user may only need the result of the last request, and when `unique` is set to `true`, the previous request will be cancelled.

> Here's the magic: when multiple requests are made to the same interface at the same time, axiosSerios does not wait rigidly for the previous interface to return before starting the request. All requests are made at the same time, so axiosSerios has **no loss in performance**

- Since: `1.0.0`

- Example:

Make 2 requests to /test/api/1 (data can be different) at the same time (or at very short intervals). set `unique` to `true`

```ts
// request 1
axiosSeries({
  url: '/test/api/1',
  data: { id: 1 }
})
// request 2
axiosSeries({
  url: '/test/api/1',
  data: { id: 2 }
})

// request 1 will be cancelled
```

### orderly

When multiple requests are launched to the same interface (url is the same but data can be different) at the same time (or a short interval), the first request executed cannot be guaranteed to return the result first due to network reasons, and this `orderly` parameter is used to solve this problem. When `orderly` is set to true, the first request will definitely return the result before the second request.

- Since: `1.0.0`

- Example:

Make 2 requests to xxx (data can be different) at the same time (or at very short intervals). set `orderly` to `true`

```ts
// request 1
axiosSeries({
  url: '/test/api/1',
  data: { id: 1 }
})
// request 2
axiosSeries({
  url: '/test/api/1',
  data: { id: 2 }
})

// request 1 will definitely return the result before the request 2
```

## API Reference

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

### Using unpkg CDN

```html
<script src="https://unpkg.com/browse/axios@1.4.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/axios-series@1.0.0/dist/index.global.prod.js"></script>
<script>
  const http = axiosSeries(axios)
</script>
```

## Support & Issues

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
