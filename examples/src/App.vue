<script setup>
import axios from 'axios'
import wrapper from 'axios-series'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const instance1 = axios.create()
const instance2 = axios.create()

const axiosSeriesUnique = wrapper(instance1, { unique: true })
const axiosSeriesOrderly = wrapper(instance2, { orderly: true })

// unique
const doRequestUnique = () => {
	// request 1
	axiosSeriesUnique({
		url: '/app/mock/312972/axios-series/demo',
		data: { test: 1 }
	}).then(({ data }) => {
		console.log('request 1 resolved => ', data)
	})
	// request 2
	axiosSeriesUnique({
		url: '/app/mock/312972/axios-series/demo',
		data: { test: 2 }
	}).then(({ data }) => {
		console.log('request 2 resolved => ', data)
	})
}

// orderly
const doRequestOrderly = () => {
	// request 1
	axiosSeriesOrderly({
		url: '/app/mock/312972/axios-series/demo',
		data: { test: 3 }
	}).then(({ data }) => {
		console.log('request 3 resolved => ', data)
	})
	// request 2
	axiosSeriesOrderly({
		url: '/app/mock/312972/axios-series/demo',
		data: { test: 4 }
	}).then(({ data }) => {
		console.log('request 4 resolved => ', data)
	})
	// request 3
	axiosSeriesOrderly({
		url: '/app/mock/312972/axios-series/demo',
		data: { test: 5 }
	}).then(({ data }) => {
		console.log('request 5 resolved => ', data)
	})
}

defineExpose({
	doRequestUnique,
	doRequestOrderly
})
</script>

<template>
	<div>
		<button type="button" @click="doRequestUnique">Do Request (cancel similar request)</button>
		<button type="button" @click="doRequestOrderly">Do Request (return in sequence)</button>
	</div>
</template>
