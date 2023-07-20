/* eslint-disable no-console */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import viteCompression from 'vite-plugin-compression';
// This function gets the IP that the Development server will point to from `local.config.ts`.
// To change your local IP create a file named `local.config.ts` in the same directory as vite.config.ts
// And contents:
// -------------------------------------------------
// const localConfig = { targetIp: '192.168.0.21' };
// export default localConfig;
// -------------------------------------------------
async function getDevelopmentIp() {
  const defaultTargetIp = '192.168.4.1';
  try {
    const localConfig = await import('./local.config');
    console.info(`Development server proxying to ${localConfig.default.targetIp}`);
    return localConfig.default.targetIp;
  } catch (e) {
    console.info(`Didn not find local_config.ts file. IP will default to ${defaultTargetIp}`);
    return defaultTargetIp;
  }
}

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  server: {
    proxy: {
      '/api': {
        target: `http://${await getDevelopmentIp()}`,
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: `ws://${await getDevelopmentIp()}`,
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    viteCompression()
  ],
  build: {
    outDir: '../data',
    emptyOutDir: true,
  },
}));
