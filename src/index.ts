import Serializer from './serializer'

/**
 * [wrapper 包装器]
 * @param  {[axios instance]} instance
 * @param  {[obj]} option
 * @return {[axios instance with cache feature]}
 */
export default function wrapper(instance, option) {
	const series = new Serializer(option)

	const unCacheMethods = ['delete', 'head', 'options', 'post', 'put', 'patch']

	/**
	 * [axiosWithCache axios instance Proxy]
	 * @param  {...[any]} arg
	 * @return {[promise]}
	 */
	function axiosWithSeries(...arg) {
		if (arg.length === 1 && (arg[0].method === 'get' || arg[0].method === undefined)) {
			return requestWithCacheCheck(arg[0], instance, ...arg)
		} else {
			return instance(...arg)
		}
	}

	/**
	 * [requestWithCacheCheck 对于 get 请求检查缓存，返回结果 promise]
	 * @param  {[obj]}    option
	 * @param  {[request handler func]}    func
	 * @param  {...[any]} arg
	 * @return {[promise]}
	 */
	function requestWithCacheCheck(option, func, ...arg) {
		if (series.needCache(option)) {
			if (series.hasCache(option)) {
				return Promise.resolve({
					__fromAxiosCache: true,
					...series.getCache(option)
				})
			} else {
				return func(...arg).then(response => {
					series.setCache(option, response)
					return response
				})
			}
		} else {
			return instance(...arg)
		}
	}

	/**
	 * [get axios instance get function proxy]
	 * @param  {...[any]} arg
	 * @return {[promise]}
	 */
	axiosWithCache.get = function (...arg) {
		if (arg.length === 1) {
			return requestWithCacheCheck(
				{
					url: arg[0]
				},
				instance.get,
				...arg
			)
		} else if (arg.length === 2) {
			return requestWithCacheCheck(
				{
					url: arg[0],
					...arg[1]
				},
				instance.get,
				...arg
			)
		} else {
			return instance.get(...arg)
		}
	}

	/**
	 * [__addFilter series instance addFilter function proxy]
	 * @param  {[reg]} filter
	 */
	axiosWithCache.__addFilter = function (filter) {
		series.addFilter(filter)
	}

	/**
	 * [__removeFilter series instance removeFilter function proxy]
	 * @param  {[reg]} filter
	 */
	axiosWithCache.__removeFilter = function (filter) {
		series.removeFilter(filter)
	}

	/**
	 * [series instance proxy]
	 */
	axiosWithCache.__series = series

	/**
	 * [__clearCache series instance clear function proxy]
	 */
	axiosWithCache.__clearCache = function () {
		series.clear()
	}

	/**
	 * [proxy axios instance functions which are no need to be cached]
	 */
	unCacheMethods.forEach(method => {
		axiosWithCache[method] = function (...arg) {
			return instance[method](...arg)
		}
	})

	return axiosWithCache
}
