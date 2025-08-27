import { defineConfig, loadEnv } from 'vite'
import { VERSION } from './version.js'

export default defineConfig(({ mode }) => {
    const publicEnv = loadEnv('public', process.cwd(), '')
    const privateEnv = loadEnv('private', process.cwd(), '')
    
    let gameMode = 'click'
    let gameType = 'scratch'
    
    if (mode && mode !== 'development') {
        const parts = mode.split('-')
        if (parts.length >= 2 && parts[0] === 'wheel') {
            gameType = 'wheel'
            gameMode = parts[1] // wheel-auto -> auto, wheel-click -> click
        } else if (parts.length >= 1) {
            gameType = 'scratch'
            gameMode = parts[0] // auto -> auto, click -> click
        }
    }
    
    const currentSettings = {
        VITE_GAME_MODE: gameMode,
        VITE_GAME_TYPE: gameType
    }
    
    const mergedEnv = { ...publicEnv, ...privateEnv, ...currentSettings }
    
    return {
        base: './',
        server: {
            open: true,
            port: 5173
        },
        resolve: {
            alias: {
                '@': '/src',
                '@assets': '/src/assets',
                '@images': '/src/assets/images',
                '@js': '/src/assets/js',
                '@css': '/src/assets/css'
            }
        },
        build: {
            outDir: mode === 'wheel-auto' ? 'dist/wheel-indiana-auto' :
                    mode === 'wheel-click' ? 'dist/wheel-indiana-click' :
                    mode === 'auto' ? 'dist/scratch-indiana-auto' : 
                    mode === 'click' ? 'dist/scratch-indiana-click' : 'dist',
            assetsDir: 'assets',
            cssCodeSplit: true,
            cssMinify: true,
            rollupOptions: {
                input: {
                    main: '/index.html'
                },
                output: {
                    assetFileNames: (assetInfo) => {
                        let extType = assetInfo.name.split('.')[1];
                        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                            return `assets/images/[name]-${VERSION}-[hash][extname]`;
                        }
                        return `assets/${extType}/[name]-${VERSION}-[hash][extname]`;
                    },
                    chunkFileNames: `assets/js/[name]-${VERSION}-[hash].js`,
                    entryFileNames: `assets/js/[name]-${VERSION}-[hash].js`
                }
            }
        },
        css: {
            devSourcemap: true
        },
        define: {
            __APP_VERSION__: JSON.stringify(VERSION),
            ...Object.keys(mergedEnv).reduce((prev, key) => {
                if (key.startsWith('VITE_')) {
                    prev[`import.meta.env.${key}`] = JSON.stringify(mergedEnv[key])
                }
                return prev
            }, {})
        }
    }
})