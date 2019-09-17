/**
 * A Directory-based Classifier
 */
export interface DirectoryClassifier {
  /**
   * Frontmatter for index page.
   */
  frontmatter?: Record<string, any>;
  /**
   * Matched directory name.
   */
  dirname: string;
  /**
   * Layout component name for index page.
   */
  layout?: string;
  /**
   * Layout for indexed pages.
   */
  itemLayout?: string;
  /**
   * Sub directory level of indexed pages.
   */
  subdirlevel?: number;
}

/**
 * Options for this plugin.
 */
export interface DirectoryClassifierPluginOptions {
  directories: DirectoryClassifier[];
}
