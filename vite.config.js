import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
			usePolling: true,
			interval: 500,
			ignored: [
				'**/node_modules/**',
				'**/.git/**',
				'**/dist/**',
				'**/proc/**',
				'**/sys/**',
				'**/dev/**'
			]
		},
		host: '0.0.0.0',
		port: 3000,
		strictPort: false,
		open: false
	}
});
