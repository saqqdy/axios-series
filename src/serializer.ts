import axios from 'axios'
import type { AxiosInstance, AxiosResponse, CancelTokenSource } from 'axios'
import type { SerializerOptions, SerializerRequestOptions, Series, WaitingList } from './types'

export default class Serializer {
	axiosInstance: AxiosInstance
	waiting: WaitingList = {}
	unique: SerializerOptions['unique'] = false
	orderly: SerializerOptions['orderly'] = true
	onCancel: SerializerOptions['onCancel'] | null = null
	constructor(instance: AxiosInstance, options?: SerializerOptions) {
		const defaultOptions = {
			unique: false,
			orderly: true
		}
		options = Object.assign(defaultOptions, options || ({} as SerializerOptions))

		this.axiosInstance = instance
		this.unique = options.unique
		this.orderly = options.orderly
		options.onCancel && (this.onCancel = options.onCancel)
	}

	/**
	 * Do request
	 *
	 * @param config - axios request config
	 * @returns - Promise<unknown>
	 */
	// public async request<T = any, R = AxiosResponse<T>, D = any>(
	// 	config: SerializerRequestOptions<D>
	// ): Promise<R>

	// public async request<T = any, R = AxiosResponse<T>, D = any>(
	// 	url: string,
	// 	config?: SerializerRequestOptions<D>
	// ): Promise<R>

	public async request<T = any, R = AxiosResponse<T>, D = any>(
		// url: string | SerializerRequestOptions<D>,
		config: SerializerRequestOptions<D>
	): Promise<R> {
		// let key
		// if (typeof url !== 'string') {
		// 	config = url
		// 	key = config.url || ''
		// } else {
		// 	config ??= {} as SerializerRequestOptions<D>
		// 	key = url
		// }
		const { unique = this.unique, orderly = this.orderly, url = '' } = config
		const promiseKey = Symbol('promiseKey')
		const source: CancelTokenSource = axios.CancelToken.source()
		let abortController
		// config.requestOptions = extend(true, {}, options)
		config.cancelToken = source.token
		if (typeof AbortController === 'function') {
			abortController = new AbortController()
			config.signal = abortController.signal
		}

		unique && this.clear(url)

		const promise = new Promise((resolve, reject) => {
			this.axiosInstance(config)
				.then((res: any) => {
					if (!orderly) resolve(res)
					else
						this.wait(url, promiseKey).then(() => {
							resolve(res)
						})
				})
				.catch(err => {
					// Request cancelled
					if (axios.isCancel(err)) this.onCancel && this.onCancel(err, config)
					// Request error
					else reject(err)
				})
				.finally(() => {
					const index = this.waiting[url].findIndex(el => el.promiseKey === promiseKey)
					index > -1 && this.waiting[url].splice(index, 1)
				})
		})

		this.add(url, {
			promiseKey,
			promise,
			source,
			abortController
		})

		return promise as Promise<R>
	}

	/**
	 * Drop all un-need requests
	 *
	 * @param key - the key of waiting line, usually to be the request url
	 */
	public clear(key?: string) {
		for (const url in this.waiting) {
			// no key => clean all
			if (!key || url === key) {
				const seriesList = this.waiting[url] || []

				for (const series of seriesList) {
					series.source.cancel('request canceled')
					series.abortController && series.abortController.abort()
				}
				this.waiting[url] = []
			}
		}
	}

	/**
	 * Waiting to resolve the series before this request
	 *
	 * @param key - the key of waiting line, usually to be the request url
	 * @param promiseKey - the unique promise key
	 * @returns - Promise<void>
	 */
	private async wait(key: string, promiseKey: symbol) {
		if (!this.orderly) return Promise.resolve()

		const seriesList = this.waiting[key] || []
		let index = seriesList.findIndex(item => item.promiseKey === promiseKey)

		while (index > 0) {
			index--
			// do not waiting self
			if (seriesList[index] && seriesList[index].promiseKey !== promiseKey) {
				try {
					await seriesList[index].promise
					// await seriesList.splice(index, 1)[0].promise
				} catch {
					console.info('The task has been dropped')
				}
				seriesList.splice(index, 1)
			}
		}
	}

	/**
	 * set series to waiting list
	 *
	 * @param key - the key of waiting line, usually to be the request url
	 * @param series - waiting object
	 */
	private add(key: string, series: Series) {
		if (!(key in this.waiting)) this.waiting[key] = []

		this.waiting[key].push(series)
	}
}
