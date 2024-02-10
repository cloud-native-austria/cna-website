// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CNA',
  tagline: 'CNCF is cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Cloud Native Austria', // Usually your GitHub org/user name.
  projectName: 'cna-website', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
  },

  plugins: [
    async function locationOverviewPlugin(context, options) {
      return {
        name: 'location-overview-plugin',
        async loadContent() {
          const fs = require('fs');
          const path = require('path');
          
          const currentDate = new Date();
          const locations = []; 
          
          const locationFolders = fs.readdirSync("./src/pages", { withFileTypes: true })
            .filter(folder => folder.isDirectory())
            .map(folder => folder.name);

          locationFolders.forEach(folder => {
            const files = fs.readdirSync("./src/pages/"+folder);
            const dateFiles = files.filter(file => /^\d{8}\.md$/.test(file));
            const startDate = Number(new Date(2024,1,1));

            locations.push({
              location: folder.charAt(0).toUpperCase() + folder.slice(1),
              logo: '/img/'+folder+'.svg',
              meetings: []
            }); 

            dateFiles.forEach(file => {
              const fileDateString = file.substring(0, 8);
              locations[locations.length-1].meetings.push(fileDateString); 
            });
          });

          return locations;
        },
        async contentLoaded({content, actions}) {
          const {setGlobalData} = actions;
          setGlobalData({locations: content});
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Cloud Native Austria',
        logo: {
          alt: 'CNA Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'clubSidebar',
            position: 'left',
            label: 'Club',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/cloud-native-austria',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Club',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Meetup',
                href: 'https://www.meetup.com/cncf-graz/',
              },
              {
                label: 'CNCF Community Graz',
                href: 'https://community.cncf.io/graz/',
              },
              {
                label: 'Cloud Native CNCF Slack',
                href: 'https://communityinviter.com/apps/cloud-native/cncf',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/cloud-native-austria'
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Cloud Native Austria`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
