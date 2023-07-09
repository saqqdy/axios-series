import type { AxiosInstance, AxiosResponse } from 'axios'
import type { SerializerOptions, SerializerRequestOptions } from './types'
export type * from './types'
import Serializer from './serializer'

/**
 * axios serializer wrapper function
 *
 * @param instance - axios or axios instance
 * @param options - serializer options
 * @return - axios instance with serializer feature
 */
export default function axiosSeries(instance: AxiosInstance, options?: SerializerOptions) {
	const serializer = new Serializer(instance, options)

	/**
	 * axios serializer factory function
	 *
	 * @param url - string or SerializerRequestOptions<D>
	 * @params config - SerializerRequestOptions<D>
	 * @return - Promise<R>
	 */
	function axiosWithSeries<T = any, R = AxiosResponse<T>, D = any>(
		config: SerializerRequestOptions<D>
	): Promise<R>
	function axiosWithSeries<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		config?: SerializerRequestOptions<D>
	): Promise<R>
	function axiosWithSeries<T = any, R = AxiosResponse<T>, D = any>(
		url: string | SerializerRequestOptions<D>,
		config?: SerializerRequestOptions<D>
	): Promise<R> {
		if (typeof url !== 'string') {
			config = url
		} else {
			config ??= {} as SerializerRequestOptions<D>
			config.url ??= url
		}

		return serializer.request(config)
	}

	// axiosWithSeries.defaults = instance.defaults
	// axiosWithSeries.interceptors = instance.interceptors
	// axiosWithSeries.getUri = instance.getUri
	// axiosWithSeries.request = instance.request
	// axiosWithSeries.get = instance.get
	// axiosWithSeries.delete = instance.delete
	// axiosWithSeries.head = instance.head
	// axiosWithSeries.options = instance.options
	// axiosWithSeries.post = instance.post
	// axiosWithSeries.put = instance.put
	// axiosWithSeries.patch = instance.patch
	// axiosWithSeries.postForm = instance.postForm
	// axiosWithSeries.putForm = instance.putForm
	// axiosWithSeries.patchForm = instance.patchForm
	// axiosWithSeries.create = instance.create
	// not in axios instance
	// axiosWithSeries.Cancel = instance.Cancel
	// axiosWithSeries.CancelToken = instance.CancelToken
	// axiosWithSeries.Axios = instance.Axios
	// axiosWithSeries.VERSION = instance.VERSION
	// axiosWithSeries.isCancel = instance.isCancel
	// axiosWithSeries.all = instance.all
	// axiosWithSeries.spread = instance.spread
	// axiosWithSeries.isAxiosError = instance.isAxiosError

	/**
	 * all waiting series
	 */
	axiosWithSeries.series = serializer.waiting

	/**
	 * clear all series
	 */
	axiosWithSeries.clear = () => {
		// clear all
		serializer.clear()
	}

	return axiosWithSeries
}
