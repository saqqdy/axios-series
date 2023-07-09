<div style="text-align: center;" align="center">

# axios-series

一个扩展 axios 按顺序返回的工具，当向同一个接口短时间内发起多次请求时，如果需要确保先执行的请求先返回结果，axios-series 会很有用

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
import wrapper from 'axios-series'

const axiosSeries = wrapper(axios, {
  // unique: false,
  // orderly: true
})

export default axiosSeries
```

### 或者把 serializer 功能赋在 axios 实例上

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

## 使用表现

serializer 的配置

| 参数     | 描述                                            | 类型                                                   | 可选值     | 是否必填 | 默认值 |
| -------- | ----------------------------------------------- | ------------------------------------------------------ | ---------- | -------- | ------ |
| unique   | make request unique, clear all similar requests | `boolean`                                              | true/false | false    | false  |
| orderly  | resolve results orderly                         | `boolean`                                              | true/false | false    | true   |
| onCancel | callback function for cancel requests           | `(err: any, config: InternalAxiosRequestConfig): void` | -          | false    | null   |

### unique

当向同一个接口(url 一致但 data 可以不一样)同时(或者间隔很短时间)发起多次请求时，可能用户只需要最后一次的请求结果，当 `unique` 设置为 `true` 时，前面的请求会被取消

> 神奇的是：当向同一个接口同时发起多次请求时，axiosSerios 并不是死板地等待上一个接口返回之后才开始请求。所有的请求都是同时发起的，所以 axiosSerios 对于**网页性能是没有损失的**

- 版本: `1.0.0`

- 示例:

1. 向 /test/api/1 (data 可以不一样)同时(或者间隔很短时间)发起 3 次请求
   . 设置 `unique` 为 `true`

```ts
// 请求 1
axiosSeries({
  url: '/test/api/1',
  data: { id: 1 }
})
// 请求 2
axiosSeries({
  url: '/test/api/1',
  data: { id: 2 }
})

// 请求1会被取消
```

### orderly

当同时(或者间隔很短时间)向同一个接口(url 一致但 data 可以不一样)请求多次，由于网络原因无法保证先执行的请求先返回结果，这个 `orderly` 参数就是用来解决这个问题的。当`orderly`设置为 true 时，先请求的一定会先于后请求的先返回结果

- 版本: `1.0.0`

- 示例:

1. 向 /test/api/1 (data 可以不一样)同时(或者间隔很短时间)发起 3 次请求
   . 设置 `orderly` 为 true

```ts
// 请求 1
axiosSeries({
  url: '/test/api/1',
  data: { id: 1 }
})
// 请求 2
axiosSeries({
  url: '/test/api/1',
  data: { id: 2 }
})

// 请求1一定会先于请求2返回结果
```

## API 参考

### axiosSeries

axios serializer 包装器

- 版本: `1.0.0`

- 参数:

| 参数     | 描述                    | 类型                | 可选值              | 是否必填 | 默认值 |
| -------- | ----------------------- | ------------------- | ------------------- | -------- | ------ |
| instance | axios or axios instance | `AxiosInstance`     | axios/axiosInstance | true     | -      |
| options  | serializer options      | `SerializerOptions` | -                   | false    | -      |

- 返回: 返回带 serializer 的 axios 实例

- 示例:

```ts
const http = axiosSeries(instance, {
  // unique: false,
  // orderly: true
})
```

- 类型:

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

清理所有的请求队列

- 版本: `1.0.0`

- 参数: `none`

- 返回: 'none'

- 示例:

```ts
const http = axiosSeries(instance, {})

http.clear()
```

- 类型:

```ts
type clear = () => void
```

### axiosSeries.series

所有的请求队列

- 版本: `1.0.0`

- 参数: `none`

- 返回: 'WaitingList'

- 示例:

```ts
const http = axiosSeries(instance, {})

console.log(http.series) // []
```

- 类型:

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
<script src="https://unpkg.com/browse/axios@1.4.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/axios-series@1.0.0/dist/index.global.prod.js"></script>
<script>
  const http = axiosSeries(axios)
</script>
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
