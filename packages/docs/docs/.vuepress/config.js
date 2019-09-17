const { fs, path, logger, chalk } = require("@vuepress/shared-utils");

const supportedPlugins = fs
  .readdirSync(path.resolve(__dirname, "../reference"))
  .map(filename => filename.slice(0, -3))
  .sort();

module.exports = ctx => ({
  dest: "build",
  base: baseConfiguration(),
  title: "VuePress Plugins",
  head: require("./head"),
  themeConfig: {
    logo: "/hero.svg",
    repo: "sabicalija/vuepress-plugins",
    editLinks: true,
    editLinkText: "Edit this page on GitHub",
    lastUpdated: "Last Updated",
    docsDir: "packages/docs/docs",
    nav: require("./nav/en"),
    sidebar: {
      "/reference/": [
        {
          title: "Plugins",
          collapsable: false,
          children: supportedPlugins
        }
      ]
    }
  },
  plugins: [
    ["@vuepress/back-to-top", true],
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: true
      }
    ],
    [
      "container",
      {
        type: "vue",
        before: '<pre class="vue-container"><code>',
        after: "</code></pre>"
      }
    ]
  ],
  extraWatchFiles: [".vuepress/nav/en.js"]
});

function baseConfiguration() {
  const base = process.env.BASE || "/";
  logger.info(`Building site with base ${chalk.magenta(base)} ...`);
  return base;
}
