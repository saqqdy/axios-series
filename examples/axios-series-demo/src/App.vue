<script setup>
import axios from 'axios'
import wrapper from 'axios-series'

const instance = axios.create()
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const axiosSeries = wrapper(instance, { unique: true })

const doRequest = () => {
	// request 1
	axiosSeries({
		url: '/app/mock/312972/axios-series/demo',
		data: { test: 1 }
	}).then(({ data }) => {
		console.log('request 1 resolved => ', data)
	})
	// request 2
	axiosSeries({
		url: '/app/mock/312972/axios-series/demo',
		data: { test: 2 }
	}).then(({ data }) => {
		console.log('request 2 resolved => ', data)
	})
	// request 3
	axiosSeries({
		url: '/app/mock/312972/axios-series/demo',
		data: { test: 3 }
	}).then(({ data }) => {
		console.log('request 3 resolved => ', data)
	})
}

defineExpose({
	doRequest
})
</script>

<template>
	<div>
		<button type="button" @click="doRequest">Do Request</button>
	</div>
</template>
