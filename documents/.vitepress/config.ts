import { join } from 'path'
import { readdirSync, statSync } from 'fs'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
const nav: DefaultTheme.NavItem[] = [
  {
    text: 'Docs',
    link: '/guide/getting-started',
  },
]

export default defineConfig({
  title: 'Vethers',
  description: 'Vue Hooks for Ethereum',
  themeConfig: {
    siteTitle: 'Vethers',
    logo: '/logo.svg',
    editLink: {
      repo: 'vethers/vethers',
      text: 'Edit this page',
      dir: 'packages',
    },
    lastUpdatedText: 'Last Updated',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vethers/vethers' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Vethers Team',
    },
    nav,
    sidebar: {
      '/guide': commonSlidebar(),
      '/hooks': commonSlidebar(),
    },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'stylesheet', href: '/styles/home.css' }],
  ],

})

function commonSlidebar() {
  return [{
    text: 'Guide',
    collapsible: true,
    items: sidebarGuide(),
  }, {
    text: 'Hooks',
    collapsible: true,
    items: sidebarHooks(),
  }]
}

function sidebarGuide() {
  return [
    {
      text: 'Getting Started',
      link: '/guide/getting-started',
    },
    {
      text: 'Configurations',
      link: '/guide/configurations',
    },
  ]
}

function sidebarHooks() {
  const sliebars = []
  const hooksPath = join(__dirname, '../hooks')
  const dirs = readdirSync(hooksPath)
  for (const dir of dirs) {
    const dirPath = join(hooksPath, dir)
    const isDirectory = statSync(dirPath).isDirectory()
    if (isDirectory && !dir.indexOf('use')) {
      sliebars.push({
        text: dir,
        link: `/hooks/${dir}/index.html`,
      })
    }
  }
  return sliebars
}
