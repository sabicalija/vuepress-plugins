# vuepress-plugin-directory-classifier

> directory based classifier plugin for vuepress

This plugin classifies the contents of directories and generates index pages for every directory.
For every entry in the configuration, an **index page** will be injected, together with an array of all **indexed** pages.
The layout of every index page and all its pages is set according to the provided configuration.

## Directory Structure

<!-- textlint-disable terminology -->

::: vue
.
├── docs
│   ├── README.md
│   ├── guide/
│   │   └── README.md
│   ├── **`plugins/`** (**Directory**)
│   │   └── item-1.md (**Item**)
│   │   └── item-2.md (**Item**)
│   │   └── ...
│   │   └── item-n.md (**Item**)
│   ├── **`reference/`** (**Directory**)
│   │   └── item-1.md (**Item**)
│   │   └── item-2.md (**Item**)
│   │   └── ...
│   │   └── item-n.md (**Item**)
│   └── .vuepress/
│ 
└── package.json
:::

<!-- textlint-enable -->

## Configuration

A configuration for a project/documentation directory structure as above, could look like the following snippet.

::: warning Note
The directories that are *registered* with the plugin configuration do not have to have a `README.md`, as the index pages are injected instead.
:::

```javascript
module.exports = {
  plugins: [
    ["directory-classifier", {
      directories: [
        {
          dirname: "plugins",
          layout: "IndexPlugins",
          itemLayout: "PluginPage",
          subdirlevel: 1,
          frontmatter: {
            title: "Plugins"
          }
        },
        {
          dirname: "reference",
          layout: "IndexReferences",
          itemLayout: "ReferencePage",
          frontmatter: {
            title: "References"
          }

        }
      ]
    }]
  ]
}
```

The plugin will inject two index pages, that is `plugins/index.html` and `reference/index.html` and will apply the configured `layout` to each index page and add the array `indexed`, containing the paths of all indexed pages.
The plugins will also apply the `itemLayout` to every page inside the configured directory.

::: tip Note
Original `frontmatter` data provided by every page will not be overwritten.
:::

The value of `$site` of this site will look as follows:

```json
{
  "title": "VuePress",
  "description": "Vue-powered Static Site Generator",
  "base": "/",
  "pages": [
    ...
    {
      "path": "/plugins/index.html",
      "frontmatter": {
        "title": "Plugins",
        "layout": "IndexPlugins",
        "indexed": [
          "/plugins/item-1.html",
          "/plugins/item-2.html",
          ...
          "/plugins/item-n.html"
        ]
      }
    },
    ...
    {
      "path": "/plugins/item-1.html",
      "frontmatter": {
        "layout": "PluginPage"
      }
    },
    {
      "path": "/plugins/item-2.html",
      "frontmatter": {
        "layout": "PluginPage"
      }
    },
    ...
    {
      "path": "/reference/index.html",
      "frontmatter": {
        "title": "References",
        "layout": "IndexReferences",
        "indexed": [
          "/reference/item-1.html",
          "/reference/item-2.html",
          ...
          "/reference/item-n.html"
        ]
      }
    },
    ...
  ]
}
```
