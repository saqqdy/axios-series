import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		proxy: {
			'/app/': {
				target: 'http://rap2api.taobao.org',
				changeOrigin: true
			}
		},
		fs: { allow: ['..'] },
		cors: true,
		host: true,
		port: 8888
	}
})
