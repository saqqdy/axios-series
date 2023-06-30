<div style="text-align: center;" align="center">

# axios-series

A serializer for axios

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

## Installing

> `axios-series` comes with the latest version of axios, so you can install it without the `axios`

```bash
# use pnpm
$ pnpm install axios-series

# use npm
$ npm install axios-series --save

# use yarn
$ yarn add axios-series
```

## Usage

### General use

```js
// {app_root}/src/plugins/axios.js
import { getCookie, setCookie } from 'axios-series'
import AxiosSeries from 'axios-series'

/**
 * Set the request header
 *
 * @param {object} instance AxiosInstance
 */
function setHeaders(instance) {
  instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
}
/**
 * Request Interceptor
 *
 * @param {object} config AxiosRequestConfig
 * @param {object} options request options AxiosSeriesRequestOptions
 * @returns AxiosRequestConfig
 */
function onRequest(config, options = {}) {
  // some codes
  return config
}
/**
 * Execute on request error
 *
 * @param {object} err Error
 */
function onRequestError(err) {
  console.error(err)
}
/**
 * Response Interceptor
 *
 * @param {object} res AxiosResponse<any>
 * @param {object} options request options AxiosSeriesRequestOptions
 * @returns Promise<unknown>
 */
function onResponse(res, options = {}) {
  if (res.data.success) return res.data
  return Promise.reject(res.data)
}
/**
 * Execute in response error
 *
 * @param {object} err Error
 */
function onResponseError(err) {
  console.error(err)
}
/**
 * Execute on request error & response error
 *
 * @param {object} err Error
 */
function onError(err) {
  console.error(err)
}
/**
 * Request Cancelled
 *
 * @param {object} err Error
 */
function onCancel(err) {
  console.error(err.message)
}

// Instantiation
const axiosSeries = new AxiosSeries({
  unique: true, // Whether to cancel the previous similar requests, default: false
  setHeaders, // function for setting request headers
  onRequest, // Request Interceptor
  onRequestError, // Execute on request error
  onResponse, // Response Interceptor
  onResponseError, // Execute on response error
  onError, // Execute on request error & response error
  onCancel // Callback when request is cancelled
})

export default options => {
  // Here set the unique and orderly priority higher than the instantiation configuration
  options.unique = options.unique ?? false
  // Here the unique has a higher priority
  return axiosSeries.create(options)
}
```

### Using with `vue2.0`

Sometimes we need to use `this` (vue instance) inside `onRequest` or `onResponse`, we can use it like this

```js
import AxiosSeries from 'axios-series'

let axiosSeries = null
// Request Interceptor
function onRequest(config, options = {}) {
  // this => vueInstance
  return config
}
// Response Interceptor
function onResponse(res, options = {}) {
  // hide loading
  if (this instanceof Vue) {
    this.$loader.hide()
  }
  if (res.data.success) return res.data
  return Promise.reject(res.data)
}

export default options => {
  // Only need to initialize once
  if (!axiosSeries)
    axiosSeries = new AxiosSeries({
      onRequest: onRequest.bind(this),
      onResponse: onResponse.bind(this)
    })

  // show loading
  if (this instanceof Vue) {
    this.$loader.show()
  }
  return axiosSeries.create(options)
}
```

### Using unpkg CDN

```html
<script src="https://unpkg.com/axios-series@1.1.0/dist/index.global.prod.js"></script>
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
