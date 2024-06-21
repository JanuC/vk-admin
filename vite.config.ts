import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          // onBeforeRouteLeave 'vue-router’的这个Api未被自动导入，在这里补充
          'vue-router': ['onBeforeRouteLeave'],
          'lodash/isUndefined': [['default', 'isUndefined']],
          /* 自定义模块 */
          api: [['default', 'api']],
          hooks: [['default', 'hooks']],
          store: [['default', 'store']],
        },
      ],
      dts: 'src/auto-import.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // dirs 指定组件所在位置，默认为 src/components
      // 可以让我们使用自己定义组件的时候免去 import 的麻烦
      dirs: ['src/components/', 'src/pages/lauch/components/'],
      // 配置需要将哪些后缀类型的文件进行自动按需引入，'vue'为默认值
      extensions: ['vue'],
      // 解析组件，这里以 Element Plus 为例
      resolvers: [ElementPlusResolver()],
      // 生成components.d.ts
      dts: true,
      // 遍历子目录
      deep: true,
    }),
  ],
})
