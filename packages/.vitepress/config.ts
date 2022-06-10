import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'vethers',
  description: 'Vue Hooks for Ethereum',
  themeConfig: {
    siteTitle: 'vethers',
    logo: '/logo.svg',
    editLink: {
      repo: 'vethers/vethers',
      text: 'Edit this page',
    },
    lastUpdatedText: 'Last Updated',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vethers/vethers' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Vethers Team',
    },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  ],
})
