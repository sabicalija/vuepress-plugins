import { DirectoryClassifierPluginOptions } from "./interface/Options";
import { handleOptions, isIndexed } from "./handleOptions";
// import { handleOptions } from "./handleOptions";

function injectExtraAPI(ctx: any) {
  const { layoutComponentMap } = ctx.themeAPI;

  /**
   * A function used to check whether layout exists
   */
  const isLayoutExists = (name: string) => layoutComponentMap[name] !== undefined;

  /**
   * Get layout
   */
  ctx.getLayout = (name?: string | any, fallback?: string) => {
    return isLayoutExists(name) ? name : fallback || "Layout";
  };
}

module.exports = (options: DirectoryClassifierPluginOptions, ctx: any) => {
  injectExtraAPI(ctx);

  const { pageEnhancers, indexPages } = handleOptions(options, ctx);

  return {
    name: "vuepress-plugin-directory-classifier",

    /**
     * 1. Execute `pageEnhancers` generated in handleOptions
     */
    extendPageData(pageCtx: any) {
      const { frontmatter: rawFrontMatter } = pageCtx;
      pageEnhancers.forEach(({ when, data = {}, frontmatter = {} }) => {
        if (when(pageCtx)) {
          Object.keys(frontmatter).forEach((key) => {
            /**
             * Respect the original frontmatter in markdown.
             */
            if (!rawFrontMatter[key]) {
              rawFrontMatter[key] = frontmatter[key];
            }
          });
          Object.assign(pageCtx, data);
        }
      });
    },
    /**
     * 2. Create pages according to user's config.
     */
    async ready() {
      const { pages } = ctx;
      /**
       * 2.1 Add paths of indexed pages to index pages.
       */
      for (let { permalink, frontmatter } of indexPages) {
        if (frontmatter)
          frontmatter.indexed = pages
            .filter(({ regularPath }: { regularPath: string }) =>
              isIndexed(regularPath, permalink, frontmatter ? frontmatter.subdirlevel : 1)
            )
            .map(({ regularPath }: any) => regularPath);
      }

      /**
       * 2.2 Add frontmatter to exiting index pages.
       */
      const existingPages = pages.map(({ path }: any) => path);
      const existingIndexPages = indexPages.filter(({ permalink }) =>
        existingPages.includes(permalink)
      );
      for (let { permalink, frontmatter } of existingIndexPages) {
        const page = pages.find(({ path }: any) => path && path === permalink);
        const { frontmatter: rawFrontMatter } = page;
        for (let key in frontmatter) {
          /**
           * Respect the original frontmatter in markdown.
           */
          if (!rawFrontMatter[key]) {
            rawFrontMatter[key] = frontmatter[key];
          }
        }
      }

      /**
       * 2.3 Combine all pages.
       *
       *   - Missing index pages.
       */
      const missingIndexPages = indexPages.filter(
        ({ permalink }) => !existingPages.includes(permalink)
      );
      const allExtraPages = [...missingIndexPages];
      await Promise.all(allExtraPages.map(async (page) => ctx.addPage(page)));
    },
  };
};
