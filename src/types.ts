import type { CancelToken, CancelTokenSource, InternalAxiosRequestConfig } from 'axios'

export interface SerializerOptions extends Record<string, unknown> {
	unique?: boolean
	orderly?: boolean
	onCancel?: (err: any, config: InternalAxiosRequestConfig) => void
}

export interface SerializerRequestOptions<D = any> extends InternalAxiosRequestConfig<D> {
	unique?: boolean
	orderly?: boolean
	cancelToken?: CancelToken
	signal?: AbortSignal
	type?: string
	error?: boolean
}

export interface Series {
	promiseKey: symbol
	promise: Promise<any>
	source: CancelTokenSource
	abortController?: AbortController
}

export type WaitingList = Record<string, Series[]>
