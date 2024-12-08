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
  url: 'https://cloud-native.at',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cloud-native-austria', // Usually your GitHub org/user name.
  projectName: 'cna-website', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  future: {
    experimental_faster: true,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
      de: {
        label: 'Deutsch',
        direction: 'ltr',
        htmlLang: 'de-DE',
        calendar: 'gregory',
        path: 'de',
      },
    },
  },

  plugins: [
    async function locationOverviewPlugin(context, options) {
      return {
        name: 'location-overview-plugin',
        async loadContent() {
          const fs = require('fs');

          const locations = [];

          const locationFolders = fs.readdirSync("./src/pages", { withFileTypes: true })
            .filter(folder => folder.isDirectory())
            .map(folder => folder.name);

          locationFolders.forEach(folder => {
            const files = fs.readdirSync("./src/pages/"+folder);
            const dateFiles = files.filter(file => /^\d{8}\.mdx$/.test(file)).reverse();

            const fileContent = fs.readFileSync("./src/pages/"+folder+"/description.mdx", 'utf8');
            const firstLine = fileContent.split('\n')[0];
            const locationName = firstLine.slice(2);

            locations.push({
              locationName: locationName,
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
        items: [
          /* {
            type: 'localeDropdown',
            position: 'left',
          }, */
          {
            type: 'docSidebar',
            sidebarId: 'associationSidebar',
            position: 'left',
            label: 'Association',
          },
          /* {to: '/blog', label: 'Blog', position: 'left'}, */
          {to: '/docs/sponsoring', label: 'Sponsoring', position: 'left'},
          {
            type: 'dropdown',
            label: 'Communities',
            position: 'left',
            items: [
              {
                type: 'html',
                value: '<span>Sponsored</span>', // The HTML to be rendered
              },
              {
                label: 'Graz',
                to: '/graz',
              },
              {
                label: 'Innsbruck',
                to: '/innsbruck',
              },
              {
                label: 'Vienna',
                to: '/vienna',
              },
              {
                type: 'html',
                value: '<hr>', // The HTML to be rendered
              },
              {
                type: 'html',
                value: '<span>Endorsed</span>', // The HTML to be rendered
              },
              {
                label: 'Linz',
                to: '/linz',
              },
            ],
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/cloud-native-austria',
            label: 'CNA GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        // style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Association',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'CNCF Slack',
                href: 'https://communityinviter.com/apps/cloud-native/cncf',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Impressum',
                to: '/data-privacy',
              },
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'Contribute to this page',
                href: 'https://github.com/cloud-native-austria/cna-website'
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
