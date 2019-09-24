import { existsSync } from "fs";
import { join } from "path";

import { logger, chalk } from "@vuepress/shared-utils";

import { ExtraPage } from "./interface/ExtraPage";
import { DirectoryClassifierPluginOptions } from "./interface/Options";
import { PageEnhancer } from "./interface/PageEnhancer";

/**
 * Handle options from users.
 * @param options
 * @param ctx
 * @return {*}
 */
export function handleOptions(options: DirectoryClassifierPluginOptions, ctx: any) {
  let { directories = [] } = options;

  /**
   * Validate the existence of directory specified by directory classifier.
   */
  directories = directories.filter(({ dirname }) => {
    const targetDir = join(ctx.sourceDir, dirname);
    if (existsSync(targetDir)) {
      return true;
    }

    logger.warn(
      `[plugin-directory-classifier]` +
        `  Invalid directory classifier: ${chalk.cyan(dirname)}, ` +
        `  ${chalk.gray(targetDir)} doesn't exist!}`
    );
    return false;
  });

  const indexPages: ExtraPage[] = [];
  const pageEnhancers: PageEnhancer[] = [];

  /**
   * 1. Directory-based classification
   */
  for (const directory of directories) {
    const {
      dirname,
      layout: indexLayout = "IndexPage",
      frontmatter,
      itemLayout = "Page",
      subdirlevel = 1
    } = directory;

    const indexPath = `/${dirname}/`;

    /**
     * 1.1 Required index path.
     */
    if (!dirname || !indexPath) {
      continue;
    }

    /**
     * 1.2 Inject index page.
     */
    indexPages.push({
      permalink: indexPath,
      frontmatter: {
        layout: ctx.getLayout(indexLayout),
        subdirlevel,
        indexed: [],
        ...frontmatter
      },
      meta: {
        id: dirname
      }
    });

    /**
     * 1.3 Set layout for pages that match current directory classifier.
     */
    pageEnhancers.push({
      when: ({ regularPath }) => isIndexed(regularPath, indexPath, subdirlevel),
      frontmatter: {
        layout: itemLayout || "Page"
      },
      data: {
        id: dirname
      }
    });
  }

  return {
    pageEnhancers,
    indexPages
  };
}

/**
 * Filter pages in `dirname`, i.e. only top-level files or index files in sub directories.
 * @param regularPath
 * @param indexPath
 * @param level
 * @return {*}
 */
export function isIndexed(indexedPath: string, indexPath: string, level: number) {
  return (
    Boolean(indexedPath) &&
    indexedPath !== indexPath &&
    indexedPath.startsWith(indexPath) &&
    (indexedPath.endsWith("index.html") ||
      indexedPath.endsWith("/") ||
      isWithinSubDir(indexPath, indexedPath, level))
  );
}

/**
 * Subtract `sub` from `text`.
 * @param text
 * @param sub
 * @return {*}
 */
function diff(text: string, sub: string) {
  return text.split(sub).join("");
}

/**
 * Test weather subtraction makes sense.
 * @param text
 * @param sub
 * @return {*}
 */
function diffValidate(text: string, sub: string) {
  return text !== diff(text, sub);
}

/**
 * Test if path is within the next`level` sub directories.
 * @param index
 * @param path
 * @param level
 * @return {*}
 */
function isWithinSubDir(index: string, path: string, level: number = 1) {
  if (level > 0 && diffValidate(path, index)) {
    const dirLevel = diff(path, index).split("/").length;
    return dirLevel > 0 && dirLevel <= level + 1;
  }
  return false;
}
