import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    VitePWA({
      selfDestroying: true,
      // 注入注册脚本到 HTML 中
      injectRegister: "script",
      // 使用 prompt 方式进行注册
      registerType: "autoUpdate",
      // 开发环境下启用 PWA 功能
      devOptions: {
        enabled: true,
      },
      // Workbox 配置
      workbox: {
        // 匹配需要被缓存的文件
        globPatterns: [
          "**/*.js",
          "**/*.html",
          "**/*.css",
          "**/*.svg",
          "**/*.png",
        ],
      },
      // 包含的资源文件
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      // 清单文件配置
      manifest: {
        // 显示模式
        display: "standalone",
        // 应用名称
        name: "这里是应用名称",
        // 应用短名称
        short_name: "这里是应用短名称",
        // 应用描述
        description: "这里是应用描述",
        // 主题颜色
        theme_color: "#000",
        // 应用图标配置
        icons: [
          {
            // 图标路径
            src: "pwa-192x192.png",
            // 图标尺寸
            sizes: "192x192",
            // 图标类型
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            // 任何用途的图标
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            // 适用于 maskable 图标
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 9999,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
